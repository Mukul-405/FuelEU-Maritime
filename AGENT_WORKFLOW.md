# AGENT_WORKFLOW.md — Consolidated Workflow Log

This is the consolidated workflow log for both Backend and Frontend development, recording every prompt execution, refactor, and architectural decision.

---

## Backend

### [2026-03-22] Mission 1: Prisma → PostgreSQL Migration
- Uninstalled `prisma` and `@prisma/client`; installed `pg` and `@types/pg`.
- Created `DatabasePool.ts` connection pool utility.
- Migrated all repositories (`PgRouteRepository`, `PgBankRepository`, `PgPoolRepository`) from Prisma to raw SQL.
- Updated `Route` entity to match PostgreSQL schema (`route_id`, `vessel_type`, `fuel_type`, `ghg_intensity`, etc.).
- Built compliance math: `(Target - Actual) × (Fuel Consumption × 41,000)` mapped to `GET /compliance/cb`.
- Added Jest tests for `ComplianceService.ts`.

### [2026-03-22] Mission 2: Core Domain Logic (Art. 20/21)
- Implemented `ComplianceMath.ts`: `ComputeCB()` with Target Intensity `89.3368` and Energy Constant `41,000`.
- Implemented `PoolingBankingRules.ts`: `BankSurplus()` and `CreatePool()` with Greedy Allocation.
- Created `tests/core/domain/ComplianceMath.test.ts` and `PoolingBankingRules.test.ts`.

### [2026-03-22] Mission 3: Application Services & Infrastructure
- Plumbed `IRouteRepository` and `IComplianceRepository` behind domain Use Cases.
- Created `GetRoutesUseCase`, `CalculateCBUseCase`, `GetRouteComparisonUseCase`, `GetAdjustedCBUseCase`.
- Created `BankSurplusUseCase`, `ApplyBankedSurplusUseCase`, `GetBankRecordsUseCase`.
- Created `CreatePoolUseCase` with Greedy Allocation validation.
- Wired all to Express controllers in `ExpressApp.ts`.
- Built Supertest integration tests.

### [2026-03-22] Mission 4: Pooling & Banking Integration
- Implemented `savePool` with PostgreSQL `BEGIN`/`COMMIT`/`ROLLBACK` transactions.
- Added `GET /banking/records` endpoint with query param filtering.
- Seeded database with Routes R-001 through R-005.

---

## Frontend

### [2026-03-23] Initialization
- Scaffolded React + TypeScript + Vite project.
- Verified `strict: true` in `tsconfig.json`.
- Installed `tailwindcss`, `axios`, `react-router-dom`, `recharts`, `lucide-react`.
- Created Hexagonal folder structure: `core/domain`, `core/ports`, `adapters/infrastructure`, `adapters/ui`.
- Implemented `IRouteApiClient` port and `RouteApiClient` adapter for `GET /routes`.
- Built shared `Layout` with sidebar navigation (Routes, Compare, Banking, Pooling).

### [2026-03-23] Phase 2: Routes & Compare Tab
- **Validation correction:** Aligned `Route` interface to match backend `RouteData` shape. Previous AI-generated interface had placeholder fields (`name`, `sourcePort`). Fixed to `route_id`, `vessel_type`, `fuel_type`, `year`, `ghg_intensity`, etc.
- Created `RouteComparison.ts` domain entity matching `GET /routes/comparison`.
- Created `ComplianceCalculator.ts` with `percentDiff()` and `isCompliant()` domain logic.
- Expanded API client with `setBaseline(id)` and `getComparison()`.
- **Validation correction:** Fixed `baseUrl` from port `3000` to `3001` to match backend `ExpressApp.ts`.
- Built `RoutesTable` component with vessel/fuel/year text filters and "Set Baseline" button.
- Built `ComparePage` with Recharts bar chart, `ReferenceLine` at `89.3368`, color-coded bars, and compliance breakdown table.
- **Recharts challenge:** Used `vitest/config` import instead of triple-slash `/// <reference types="vitest" />` to avoid `tsconfig.node.json` type conflicts. Excluded test files from `tsconfig.app.json`.
- Configured Vitest with jsdom; wrote 10 tests (all passing).

### [2026-03-23] Phase 3: Banking (Art. 20) & Pooling (Art. 21)
- Created `BankingModels.ts` with `canBankSurplus()` domain rule.
- Created `PoolingModels.ts` matching backend `CreatePoolUseCase`.
- Created `PoolSumCalculator.ts` for real-time pool sum indicator.
- Expanded API client with 6 new methods: `getComplianceCb`, `getBankRecords`, `bankSurplus`, `applyBankedSurplus`, `getAdjustedCb`, `createPool`.
- Built Banking Tab: KPI cards (Current CB, Total Banked, Bank Status), CB calculator form, Bank/Apply forms with buttons disabled when CB ≤ 0, bank records table.
- Built Pooling Tab: Dynamic ship multi-select (add/remove rows), per-ship "Fetch CB", real-time Pool Sum Indicator (green ≥ 0, red < 0), "Create Pool" submission.
- **Multi-select state pattern:** Array of `ShipEntry` objects with individual loading states. CB fetched per-ship. Pool sum recalculates on render from filtered non-null entries.
- **API error handling pattern:** All calls wrapped in try/catch. Errors as timed auto-dismiss banners. Loading spinners on buttons during async. Backend error messages surfaced directly.
- Wrote 10 new tests (7 PoolSumCalculator, 3 canBankSurplus). Total: 20/20 passing.

### [2026-03-23] Phase 4: Grand Audit
- Verified naming convention consistency (backend `snake_case` mirrored exactly in frontend domain models).
- Added ARIA accessibility attributes to Pool Sum Indicator (`role="status"`, `aria-label`, `aria-live="polite"`).
- Created `.env.example` files for both Backend and Frontend.
- Consolidated documentation into root `README.md`, `REFLECTION.md`, and this `AGENT_WORKFLOW.md`.
