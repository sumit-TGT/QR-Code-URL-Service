# QR URL Microservice

A lightweight microservice to generate QR codes for receipts, create short URLs, redirect users, and track link statistics. Built with **Node.js**, **Express**, and **ESM modules**.

---

## Features

- Generate QR codes (PNG or SVG) for receipts.
- Create short URLs for receipts with optional expiration.
- Redirect users from short URL to the original receipt URL.
- Track link statistics:
  - Scan count
  - Last scanned timestamp
  - Expiration date
- In-memory storage (can be extended to DB)
- Configurable via `.env`

---

## Folder Structure

qr-url-service/
│── server.js
│── package.json
│── .env
│── config/
│ └── index.js
└── src/
├── routes/
│ └── qrRoutes.js
├── controllers/
│ └── qrController.js
├── services/
│ └── qrService.js
└── store/
└── memoryStore.js


---

## Installation

```bash
git clone <repo-url>
cd qr-url-service
npm install

Configuration

Create a .env file in the project root:
PORT=3000
BASE_URL=http://localhost:3000
RECEIPT_BASE_URL=http://localhost:3000/receipts

PORT – server listening port (default: 3000)

BASE_URL – base URL for short links

RECEIPT_BASE_URL – base URL for receipt links

Running the Service
npm run dev   # For development with nodemon
npm start     # For production

API Endpoints
1. Generate QR Link

POST /generate

Request Body:
{
  "receiptId": "12345",
  "expiresIn": "1h",  // optional, format: s, m, h, d
  "format": "png"      // optional, png or svg
}

Response:
{
  "shortUrl": "http://localhost:4000/r/abcd1234",
  "qrCode": "data:image/png;base64,...",
  "expiresAt": "2025-08-31T15:30:00.000Z",
  "token": "abcd1234"
}
2. Redirect via Token

GET /r/:token

Redirects to the actual receipt URL.

Returns 404 if token is invalid.

Returns 410 if token is expired.

2. Redirect via Token

GET /r/:token

Redirects to the actual receipt URL.

Returns 404 if token is invalid.

Returns 410 if token is expired.

Response:
{
  "token": "abcd1234",
  "targetUrl": "http://localhost:4000/receipts/12345",
  "scanCount": 3,
  "lastScannedAt": "2025-08-31T15:25:00.000Z",
  "expiresAt": "2025-08-31T15:30:00.000Z"
}

Notes

Currently uses in-memory storage. Restarting the server will reset all data.

You can integrate MongoDB or another database for persistence.

Supports PNG and SVG QR code formats.

LICENSE:
MIT

Author
Sumit Kumar
[@Intern TGT ]