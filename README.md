# Enba - Assignment

## Tech Stack
- **Frontend**: React + Vite + Vanilla CSS
- **Backend**: Node.js + Express
- **Database**: SQLite (`sqlite3`)
- **Search**: Fuzzy search using `fuse.js`

## Quick Start (local)

The application has been configured exactly as requested. To run it locally, simply:

```bash
npm install && npm start
```

This will automatically install dependencies for both the frontend and backend, and concurrently start both:
- **Frontend** runs on `http://localhost:5173`
- **Backend** runs on `http://localhost:3001`

| Endpoint | Description |
|---|---|
| `GET /list` | Returns all 12 game listings |
| `GET /list?search=<query>` | Fuzzy search by game name |

