# REFLECTION.md — Project Retrospective

## Agents Used

| Agent | Role | Scope |
|---|---|---|
| **Antigravity** (Google DeepMind) | Primary development agent | All backend refactoring, frontend scaffolding, UI implementation, testing, and documentation |

---

## Validation / Corrections

### 1. Frontend `Route` Interface Mismatch — Manual Override

**Problem:** The initial frontend `Route` interface used placeholder field names (`name`, `sourcePort`, `destinationPort`, `distanceNm`) that did not match the backend's actual `RouteData` shape (`route_id`, `vessel_type`, `fuel_type`, `year`, `ghg_intensity`, etc.).

**What the AI generated:** A generic interface with fields like `id: string` and `sourcePort` — fields that don't exist in the backend's PostgreSQL schema or API responses.

**Correction:** Before Phase 2 implementation, I manually audited the backend `domain/entities/Route.ts` and `GetRouteComparisonUseCase.ts` to extract the exact data shape. The frontend `Route` interface was completely rewritten to match the backend's `snake_case` field names (`route_id`, `vessel_type`, `fuel_type`, `ghg_intensity`, `fuel_consumption`, `distance`, `total_emissions`, `is_baseline`). The API client base URL was also corrected from port `3000` to `3001`.

**Impact:** Without this correction, all API responses would have been silently mistyped. No runtime errors, but every rendered value would have been `undefined`.

---

### 2. Vitest Configuration TypeScript Error — Manual Resolution

**Problem:** Adding `test: { ... }` to `vite.config.ts` caused a TypeScript compilation error during `tsc -b`: _"Object literal may only specify known properties, and 'test' does not exist in type 'UserConfigExport'"_. This happened because `tsconfig.node.json` included `vite.config.ts` but only knew about `node` types, not `vitest` types.

**What the AI generated:** Used the `/// <reference types="vitest" />` triple-slash directive with `import { defineConfig } from 'vite'`, which was insufficient for the project's split `tsconfig` setup (separate `tsconfig.app.json` + `tsconfig.node.json`).

**Correction:** Replaced the import to use `import { defineConfig } from 'vitest/config'` instead of `vite`, which provides the extended type definitions including the `test` property. Additionally, test files (`*.test.ts`, `*.test.tsx`, `setupTests.ts`) were excluded from `tsconfig.app.json` to prevent `noUnusedLocals` errors during the app build.

**Impact:** Without this fix, `npm run build` would fail on every CI run.

---

## Best Practices Followed

### Hexagonal Architecture (Ports & Adapters)
- **Domain layer** (`core/domain/`) contains pure business logic with zero framework dependencies
- **Port interfaces** (`core/ports/`) define contracts between domain and infrastructure
- **Adapters** (`adapters/infrastructure/`, `adapters/ui/`) implement ports and are the only layer that knows about Axios, React, or Recharts
- Domain functions like `ComplianceCalculator.percentDiff()`, `canBankSurplus()`, and `PoolSumCalculator.calculateSum()` are unit-testable without mocking any external dependencies

### Naming Convention Consistency
- Backend uses `snake_case` throughout (PostgreSQL convention): `vessel_type`, `fuel_type`, `ghg_intensity`, `is_baseline`
- Frontend domain models mirror backend shapes exactly — the adapter layer handles no field renaming, ensuring end-to-end type safety
- TypeScript `strict: true` enforced in both projects

### Testing Strategy
- **Domain logic:** Tested with plain Vitest assertions (no UI framework needed)
- **UI components:** Tested with React Testing Library using `render`, `screen`, `fireEvent`
- **Backend:** Jest + Supertest for both unit and integration tests
- **Total frontend test count:** 20 tests across 4 files, all passing

### Accessibility
- Pool Sum Indicator uses both **color** (green/red) and **text labels** ("Valid configuration" / "Invalid configuration")
- ARIA attributes: `role="status"`, `aria-label`, `aria-live="polite"` for screen reader support
- All buttons have `hover:` states and `disabled:opacity-40 disabled:cursor-not-allowed` visual feedback

### Error Handling
- All API calls wrapped in `try/catch` with user-facing error banners
- Auto-dismiss error messages after 4 seconds
- Loading states on buttons during async operations to prevent double-submission
