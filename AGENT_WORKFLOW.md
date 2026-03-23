# AI Agent Workflow Log

## Agents Used
- **Antigravity (Claude-based AI Agent)** — Primary agent used for architecture design, code generation, refactoring, debugging, and test authoring across the full stack.
- **GitHub Copilot** — Used for inline completions and boilerplate generation during initial file scaffolding.

## Prompts & Outputs

### Example 1: Backend Domain Logic Generation
**Prompt:**
> "Implement pure TypeScript domain functions for Fuel EU Maritime compliance: `ComputeCB` using Target Intensity 89.3368 and Energy Constant 41000, and `CreatePool` with greedy allocation logic sorting members desc by CB."

**Output (generated snippet):**
```typescript
export function ComputeCB(actualIntensity: number, fuelConsumption: number): number {
    return (TARGET_INTENSITY_2025 - actualIntensity) * (fuelConsumption * ENERGY_CONSTANT);
}
```
This was used directly in `src/core/domain/ComplianceMath.ts`.

### Example 2: Refinement of Pooling Algorithm
**Prompt:**
> "The greedy allocation needs to also validate that deficit ships cannot exit worse than they started, and surplus ships cannot exit negative."

**Output (refined):**
The agent initially generated a basic two-pointer approach. After refinement, it added the post-allocation validation loop checking `initialCb` vs final `cb` for both deficit and surplus ships. This final version is in `src/core/domain/PoolingBankingRules.ts`.

## Validation / Corrections
- **Prisma removal:** Agent initially tried to keep Prisma references; manually corrected to use raw `pg` queries throughout.
- **Port `3000` → `3001`:** Agent generated frontend API client pointing to port 3000; corrected to match the backend's actual port 3001.
- **Route entity mismatch:** AI-generated `Route` interface initially used placeholder fields (`name`, `sourcePort`). Manually corrected to match the PostgreSQL schema (`route_id`, `vessel_type`, `fuel_type`, `ghg_intensity`, etc.).
- **`POST /routes/:id/baseline`:** Was only wired on the legacy `/api/` path. Detected during audit and added to the new route set.
- **`GET /compliance/cb`:** Was using `actual_intensity` & `fuel_consumption` only. Updated to also accept `ship_id` & `year` for compute-and-store workflow.

## Observations
- **Where agent saved time:** Boilerplate generation (Express controllers, repository CRUD, Jest test scaffolding), Hexagonal folder structure setup, and Recharts chart configuration were all significantly faster with AI assistance.
- **Where it failed or hallucinated:** Agent occasionally generated incorrect import paths, assumed Prisma was still installed after removal, and initially created domain entity fields that didn't match the database schema.
- **How tools were combined:** Used Antigravity for architectural decisions and bulk code generation, GitHub Copilot for inline completions within existing files, and manual review for all domain logic correctness.

## Best Practices Followed
- Used `task.md` checklists to track progress across planning, execution, and verification phases.
- All domain logic (`ComplianceMath.ts`, `PoolingBankingRules.ts`) is framework-free and unit-tested independently.
- Agent outputs were always verified against the assignment spec before committing.
- Copilot inline completions were used for repetitive patterns (controller methods, repository queries) while agent was used for complex architectural decisions.
- Integration tests via Supertest validate the full request-response cycle including database interactions.

---

## Detailed Timeline

### Backend

#### [2026-03-22] Mission 1: Prisma → PostgreSQL Migration
- Uninstalled `prisma` and `@prisma/client`; installed `pg` and `@types/pg`.
- Created `DatabasePool.ts` connection pool utility.
- Migrated all repositories (`PgRouteRepository`, `PgBankRepository`, `PgPoolRepository`) from Prisma to raw SQL.
- Updated `Route` entity to match PostgreSQL schema.
- Built compliance math: `(Target - Actual) × (Fuel Consumption × 41,000)` mapped to `GET /compliance/cb`.

#### [2026-03-22] Mission 2: Core Domain Logic (Art. 20/21)
- Implemented `ComplianceMath.ts`: `ComputeCB()` with Target Intensity `89.3368` and Energy Constant `41,000`.
- Implemented `PoolingBankingRules.ts`: `BankSurplus()` and `CreatePool()` with Greedy Allocation.
- Created unit tests for both domain modules.

#### [2026-03-22] Mission 3: Application Services & Infrastructure
- Plumbed `IRouteRepository` and `IComplianceRepository` behind domain Use Cases.
- Created 8 Use Cases: `GetRoutesUseCase`, `CalculateCBUseCase`, `GetRouteComparisonUseCase`, `GetAdjustedCBUseCase`, `BankSurplusUseCase`, `ApplyBankedSurplusUseCase`, `GetBankRecordsUseCase`, `CreatePoolUseCase`.
- Wired all to Express controllers in `ExpressApp.ts`.
- Built Supertest integration tests.

#### [2026-03-22] Mission 4: Pooling & Banking Integration
- Implemented `savePool` with PostgreSQL `BEGIN`/`COMMIT`/`ROLLBACK` transactions.
- Added `GET /banking/records` endpoint.
- Seeded database with Routes R001–R005.

### Frontend

#### [2026-03-23] Phase 1: Initialization & Architecture
- Scaffolded React + TypeScript + Vite project with TailwindCSS.
- Created Hexagonal folder structure: `core/domain`, `core/ports`, `adapters/infrastructure`, `adapters/ui`.
- Implemented `IRouteApiClient` port and `RouteApiClient` adapter.
- Built shared `Layout` with sidebar navigation (Routes, Compare, Banking, Pooling).

#### [2026-03-23] Phase 2: Routes & Compare Tab
- Built `RoutesTable` component with vessel/fuel/year filters and "Set Baseline" button.
- Built `ComparePage` with Recharts bar chart, target reference line at `89.3368`, and compliance breakdown table.

#### [2026-03-23] Phase 3: Banking (Art. 20) & Pooling (Art. 21)
- Built Banking Tab: KPI cards, CB calculator, Bank/Apply forms with disabled states.
- Built Pooling Tab: Dynamic ship multi-select, per-ship CB fetch, real-time Pool Sum Indicator, Create Pool submission.
- 20/20 unit tests passing.

#### [2026-03-23] Phase 4: Audit & Polish
- Added missing `fuelConsumption` and `totalEmissions` columns to Routes table.
- Added transaction KPIs (`cb_before`, `applied`, `cb_after`) to Banking tab.
- ARIA accessibility attributes on Pool Sum Indicator.
