# URL Shortener Service

URL shortener service with custom aliases, click analytics, expiration dates, and QR code generation.

## Features

- Shorten long URLs
- Custom URL aliases
- Click tracking and analytics
- Expiration dates
- QR code generation
- API access
- Dashboard

## Tech Stack

- Node.js / Express
- MongoDB
- Redis (caching)

## Installation

```bash
npm install
npm start
```

## API Endpoints

- `POST /api/shorten` - Create short URL
- `GET /:code` - Redirect to original URL
- `GET /api/stats/:code` - Get URL statistics

## Note

This repository contains archived work originally created for learning purposes and uploaded later for documentation and portfolio purposes.