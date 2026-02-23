# Enba – Eneba Game Marketplace Clone

A full-stack web application cloning the Eneba game marketplace, built as part of a Software Engineer Intern assignment.

## Games included (12 listings across 3 titles)
- **Split Fiction** – 6 listings (EA App, Xbox Live, Nintendo Switch, PS5)
- **FIFA 23** – 3 listings (PC, PS5, Xbox)
- **Red Dead Redemption 2** – 3 listings (PC, PS4, Xbox)

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

## Free Hosting (Render.com)
The easiest way to host this full-stack app for free is on [Render](https://render.com/).

1. Push this repository to GitHub.
2. Go to Render.com and create a new **Web Service**.
3. Connect your GitHub repository.
4. Use the following settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Click **Create Web Service**. 

*Note: In production (`npm start`), the Express backend automatically serves the built React frontend from `/frontend/dist`.*

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /list` | Returns all 12 game listings |
| `GET /list?search=<query>` | Fuzzy search by game name |

### Example
```
GET /list?search=split fiction
GET /list?search=fifa
GET /list?search=red dead
```

## Production Build
```bash
cd frontend && npm run build
cd ../backend && npm start
```
Then visit `http://localhost:3001`
