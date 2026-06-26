# Intelligent User Behavior Platform

A full-stack platform for intelligent user behavior analysis.

## Project Structure

```
Intelligent-User-Behavior-Platform/
├── client/       # React + Vite frontend
├── server/       # Node.js + Express backend
├── ml-service/   # Python ML service (placeholder)
└── docs/         # Project documentation
```

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Vite, React Router DOM, Axios, Tailwind CSS |
| Backend | Node.js, Express, MongoDB, Mongoose |
| ML Service | Python (placeholder) |

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) running locally or a connection URI
- [npm](https://www.npmjs.com/)

## Getting Started

### 1. Frontend

```bash
cd client
npm install
npm run dev
```

The React app runs at `http://localhost:5173` by default.

### 2. Backend

```bash
cd server
npm install
npm run dev
```

The API runs at `http://localhost:5000` by default.

Verify the health endpoint:

```
GET http://localhost:5000/api/health
```

### 3. ML Service

The ML service is a placeholder for future development. See `ml-service/` for the folder structure.

## Environment Variables

### Client (`client/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

### Server (`server/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `NODE_ENV` | Environment (`development` / `production`) |

## License

ISC
