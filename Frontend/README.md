# FuelEU Maritime — Frontend

Interactive compliance dashboard for the FuelEU Maritime Regulation. Built with **React 19, Vite 8, TypeScript, TailwindCSS 4, and Recharts 3**.

## Architecture

The frontend follows **Hexagonal Architecture** (Ports & Adapters):

```
src/
├── core/
│   ├── domain/          ← Business entities & types
│   └── ports/           ← Outbound port interfaces
├── adapters/
│   ├── infrastructure/  ← API clients (Axios → Backend REST)
│   └── ui/
│       ├── components/  ← Reusable UI components
│       └── pages/       ← Tab pages (Routes, Compare, Banking, Pooling)
├── components/          ← Layout components (Dashboard, tabs)
├── services/            ← Legacy API service layer
├── App.tsx              ← Root component with routing
└── main.tsx             ← Entry point
```

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

> **Note:** The frontend expects the Backend API at `http://localhost:3001`. Make sure the backend is running before using the dashboard.

## Available Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `vite --force` | Start dev server with HMR |
| `npm run build` | `tsc -b && vite build` | Type-check and build for production |
| `npm run preview` | `vite preview` | Preview production build locally |
| `npm test` | `vitest run` | Run tests via Vitest |
| `npm run lint` | `eslint .` | Run ESLint on all files |

## Dashboard Tabs

| Tab | Description |
|---|---|
| **Routes** | Browse all routes, filter by vessel/fuel/year, set baseline routes |
| **Compare** | GHG intensity bar chart with 89.3368 gCO₂e/MJ reference line |
| **Banking** | Bank surplus compliance balance or apply banked amount to deficits (Art. 20) |
| **Pooling** | Multi-select ships for fleet pooling with greedy surplus allocation (Art. 21) |

## Tech Stack

- **React 19** — UI framework
- **Vite 8** — Build tool with HMR
- **TypeScript** — Strict mode
- **TailwindCSS 4** — Utility-first styling
- **Recharts 3** — Charting library
- **Axios** — HTTP client
- **React Router 7** — Client-side routing
- **Vitest + React Testing Library** — Testing
