# CodeVector Backend Assignment

## Overview

This project implements a scalable product catalog backend capable of handling **200,000+ products** while supporting efficient browsing, category filtering, and stable pagination.

The primary focus of the solution is to provide a pagination strategy that remains reliable even when new products are added while users are browsing the catalog.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Render (Deployment)

---

## Features

### Product Management

- Stores and manages 200,000 generated product records.
- Each product contains:
  - Name
  - Category
  - Price
  - Created At
  - Updated At

### Product Browsing

- Browse products sorted by newest records first.
- Efficient retrieval using database indexes.

### Category Filtering

Example:

```http
GET /products?category=Electronics
```

### Cursor-Based Pagination

Example:

```http
GET /products
```

Response:

```json
{
  "products": [...],
  "nextCursor": "6859abc123..."
}
```

Next page:

```http
GET /products?cursor=6859abc123...
```

---

## API Endpoints

### Get Products

```http
GET /products
```

### Filter by Category

```http
GET /products?category=Books
```

### Paginated Results

```http
GET /products?cursor=<cursor>
```

### Combined Filtering + Pagination

```http
GET /products?category=Electronics&cursor=<cursor>
```

---

## Database Indexes

```javascript
productSchema.index({ category: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ category: 1, createdAt: -1 });
```

---

## Why Cursor Pagination?

Traditional pagination using:

```javascript
.skip((page - 1) * limit)
```

can lead to duplicate or missing records when new data is inserted while users are browsing.

This implementation uses cursor-based pagination:

```http
GET /products?cursor=<cursor>
```

Benefits:

- More scalable for large datasets
- Avoids duplicate records
- Avoids missing records
- Better consistency when data changes during browsing

---

## Running Locally

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### Start Server

```bash
node server.js
```

### Seed Database

```bash
node scripts/seed.js
```

---

## Deployment

- Backend: Render
- Database: MongoDB Atlas

---

## AI Usage

AI tools were used for:

- Understanding requirements
- Reviewing pagination approaches
- Debugging issues
- Deployment guidance
- Architecture discussions

All implementation, testing, integration, and final verification were performed manually.

---

## Future Improvements

- Product search
- Price range filtering
- Automated testing
- Swagger/OpenAPI documentation
- Docker support
- Authentication and rate limiting

---

## Author

**Mohd Wasique Rahil**

