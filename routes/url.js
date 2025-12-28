const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const urls = new Map();

// Generate short code
function generateShortCode() {
  return crypto.randomBytes(4).toString('hex');
}

// Create short URL
router.post('/shorten', async (req, res) => {
  try {
    const { url, customAlias, expiresIn } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    const shortCode = customAlias || generateShortCode();
    
    if (urls.has(shortCode)) {
      return res.status(400).json({ error: 'Alias already exists' });
    }
    
    const urlData = {
      originalUrl: url,
      shortCode,
      clicks: 0,
      createdAt: new Date(),
      expiresAt: expiresIn ? new Date(Date.now() + expiresIn * 1000) : null
    };
    
    urls.set(shortCode, urlData);
    
    res.json({
      shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}`,
      shortCode,
      originalUrl: url
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Redirect to original URL
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const urlData = urls.get(code);
    
    if (!urlData) {
      return res.status(404).json({ error: 'URL not found' });
    }
    
    if (urlData.expiresAt && new Date() > urlData.expiresAt) {
      urls.delete(code);
      return res.status(410).json({ error: 'URL has expired' });
    }
    
    urlData.clicks++;
    res.redirect(urlData.originalUrl);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get URL statistics
router.get('/api/stats/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const urlData = urls.get(code);
    
    if (!urlData) {
      return res.status(404).json({ error: 'URL not found' });
    }
    
    res.json(urlData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;