# FuelEU Maritime — Compliance Dashboard

A full-stack application implementing the **FuelEU Maritime Regulation** (Articles 20 & 21) for greenhouse gas intensity monitoring, compliance banking, and fleet pooling.

## Architecture

Both Backend and Frontend follow **Hexagonal Architecture** (Ports & Adapters):

```
Backend/                          Frontend/
├── src/                          ├── src/
│   ├── core/                     │   ├── core/
│   │   ├── domain/               │   │   ├── domain/        ← Business logic
│   │   ├── ports/                │   │   └── ports/         ← Outbound interfaces
│   │   └── application/          │   ├── adapters/
│   ├── domain/entities/          │   │   ├── infrastructure/ ← API client (Axios)
│   └── infrastructure/           │   │   └── ui/
│       └── adapters/             │   │       ├── components/ ← RoutesTable, etc.
│           ├── in/web/           │   │       └── pages/      ← Tab pages
│           └── out/db/           │   └── App.tsx
```

## Tech Stack

| Layer | Backend | Frontend |
|---|---|---|
| Language | TypeScript (strict) | TypeScript (strict) |
| Framework | Express 5 | React 19 + Vite 8 |
| Database | PostgreSQL via `pg` | — |
| Styling | — | TailwindCSS 4 |
| Charts | — | Recharts 3 |
| Testing | Jest + Supertest | Vitest + React Testing Library |

## Dashboard Tabs

| Tab | Description | Key Endpoints |
|---|---|---|
| **Routes** | View all routes, filter by vessel/fuel/year, set baseline | `GET /routes`, `POST /api/routes/:id/baseline` |
| **Compare** | GHG intensity chart with 89.3368 reference line, compliance table | `GET /routes/comparison` |
| **Banking** | Bank surplus or apply banked to deficit (Art. 20) | `POST /banking/bank`, `POST /banking/apply` |
| **Pooling** | Multi-select ships, pool sum indicator, greedy allocation (Art. 21) | `POST /pools`, `GET /compliance/adjusted-cb` |

## Quick Start

### Backend
```bash
cd Backend
cp .env.example .env          # Edit with your PostgreSQL credentials
npm install
psql -U postgres -d fueleu -f db-setup.sql   # Seed database
npx ts-node src/infrastructure/config/ExpressApp.ts
```

### Frontend
```bash
cd Frontend
cp .env.example .env
npm install
npm run dev                    # Starts at http://localhost:5173
```

### Run Tests
```bash
# Backend
cd Backend && npm test

# Frontend
cd Frontend && npm test
```

## Key Constants

| Constant | Value | Source |
|---|---|---|
| Target GHG Intensity (2025) | **89.3368** gCO2e/MJ | `ComplianceMath.ts` |
| Energy Constant | **41,000** MJ/tonne | `ComplianceMath.ts` |

## API Reference

### Routes
- `GET /routes` — List all routes
- `GET /routes/comparison` — Compare GHG intensities against baseline
- `POST /api/routes` — Register a new route
- `POST /api/routes/:id/baseline` — Set a route as baseline

### Compliance
- `GET /compliance/cb?actual_intensity=X&fuel_consumption=Y` — Calculate CB
- `GET /compliance/adjusted-cb?ship_id=X&year=Y` — Get adjusted CB for a ship

### Banking (Art. 20)
- `POST /banking/bank` — Bank surplus `{ ship_id, year, amount }`
- `POST /banking/apply` — Apply banked surplus `{ ship_id, year, amount }`
- `GET /banking/records?shipId=X&year=Y` — Get bank records

### Pooling (Art. 21)
- `POST /pools` — Create pool `{ year, members: [{ shipId, cb }] }`

## Environment Variables

See [Backend/.env.example](Backend/.env.example) and [Frontend/.env.example](Frontend/.env.example).