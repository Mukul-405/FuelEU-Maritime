# Agent Workflow - Frontend

This file logs prompt executions, UI refactors, and architectural decisions for the FuelEU Frontend.

## [2026-03-23] Initialization
- Initialized React + TypeScript + Vite project.
- Verified `strict: true` in `tsconfig.json`.
- Installed `tailwindcss`, `axios`, `react-router-dom`, `recharts`, `lucide-react`.
- Setup Hexagonal Architecture folder structure (`core/domain`, `core/ports`, `adapters/infrastructure`, `adapters/ui`).
- Implemented Task 1: API Client Port/Adapter for `GET /routes`.

## [2026-03-23] Phase 2: Routes & Compare Tab UI
- Aligned frontend `Route` interface to match backend `RouteData` shape (`route_id`, `vessel_type`, `fuel_type`, `year`, `ghg_intensity`, etc.).
- Created `RouteComparison.ts` domain entity matching `GET /routes/comparison` response.
- Created `ComplianceCalculator.ts` with `percentDiff` and `isCompliant` domain logic.
- Expanded `IRouteApiClient` port and `RouteApiClient` adapter with `setBaseline(id)` and `getComparison()`.
- Fixed `baseUrl` from port 3000 to 3001 to match backend `ExpressApp.ts`.
- Built `RoutesTable` component with vessel/fuel/year filters and "Set Baseline" button per row.
- Rebuilt `ComparePage` with Recharts bar chart, `ReferenceLine` at 89.3368 gCO2e/MJ, color-coded bars, and compliance breakdown table.
- Configured Vitest with jsdom environment; wrote 10 unit/component tests (all passing).
- **Recharts note**: Used `vitest/config` import instead of triple-slash reference to avoid `tsconfig.node.json` type conflicts. Excluded test files from `tsconfig.app.json` to prevent `noUnusedLocals` errors during `tsc -b`.

## [2026-03-23] Phase 3: Banking (Art. 20) & Pooling (Art. 21)
- Created `BankingModels.ts` with `canBankSurplus()` domain rule and `PoolingModels.ts` matching backend `CreatePoolUseCase`.
- Created `PoolSumCalculator.ts` for real-time pool sum indicator logic.
- Expanded `IRouteApiClient` and `RouteApiClient` with 6 new methods: `getComplianceCb`, `getBankRecords`, `bankSurplus`, `applyBankedSurplus`, `getAdjustedCb`, `createPool`.
- **Banking Tab**: KPI cards (Current CB, Total Banked, Bank Status), CB calculator form, Bank/Apply forms with buttons disabled when CB ≤ 0, bank records table.
- **Pooling Tab**: Dynamic ship multi-select (add/remove rows), per-ship "Fetch CB" from `GET /compliance/adjusted-cb`, real-time Pool Sum Indicator (green ≥ 0, red < 0), "Create Pool" submission via `POST /pools` with result table.
- **Multi-select state**: Used array of `ShipEntry` objects with individual loading states per row. CB is fetched per-ship and stored in the array. Pool sum recalculates on every render from filtered entries with non-null CB.
- **API error handling**: All API calls wrapped in try/catch. Errors displayed as timed auto-dismiss banners. Loading spinners on buttons during async ops. Backend error messages surfaced directly to the user.
- Wrote 10 new tests: 7 for `PoolSumCalculator`, 3 for `canBankSurplus`. Total suite: 20/20 passing.

