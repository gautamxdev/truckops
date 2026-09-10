# TruckOps

Software for **Indian trucking businesses** to organise trucks, drivers, trips, and finances.

This repo is a polished Vite + React + TypeScript + Tailwind starter: marketing landing + demo app shell with realistic Indian mock data (MH/KA plates, Pune→Nashik lanes, diesel ₹, FASTag).

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v3 (PostCSS + Autoprefixer)
- react-router-dom
- lucide-react

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Routes

| Path | Page |
|------|------|
| `/` | Marketing landing — India trucking value prop |
| `/app` | Dashboard — fleet snapshot, live trips, diesel/toll |
| `/app/trucks` | Trucks — plates, fitness, insurance, status |
| `/app/drivers` | Drivers — licence, home base, assignment |
| `/app/trips` | Trips — lanes, freight, diesel, FASTag, margin |
| `/app/finances` | Finances — month P&L and expense ledger |

## Project layout

```
src/
  types/       Shared domain types
  data/        Indian mock fleet / trip / finance data
  layouts/     App shell with sidebar
  pages/       Landing + app sections
  components/  Reusable UI (badges, stat cards)
```

## Product

TruckOps targets transporters and fleet owners who today run ops on WhatsApp and spreadsheets — keeping fleet compliance, driver roster, trip money, diesel, and tolls in one place.
