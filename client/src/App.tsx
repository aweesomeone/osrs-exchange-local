# GE Ledger

GE Ledger is a localhost-first OSRS Grand Exchange tracker designed for personal watchlists, flipping calculations, and local price tracking.

## Phase 2 implemented

This revision adds the OSRS Wiki adapter layer and server-side API endpoints for:
- /api/items/search
- /api/items/:itemId
- /api/items/:itemId/history
- /api/refresh
- protective timeout + retry-safe fetch handling
- user-agent + cache configuration

## Commands to run

```bash
npm install
npm run build
npm test
```

## Local environment

Create a `.env` file from `.env.example` before running the local server.

## Deployment note

This project is intentionally localhost-only and should not be exposed publicly without authentication and stronger controls.
