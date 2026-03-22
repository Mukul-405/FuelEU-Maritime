# Prisma to PostgreSQL Migration Log

This document logs the transition of the Backend project from using Prisma ORM to relying primarily on the standard Node-Postgres (`pg`) driver, while maintaining a Hexagonal architecture.

## Reason for Migration
To fix critical security vulnerabilities associated with `@prisma/client` and related packages, and to interact directly with the manually provisioned PostgreSQL database schemas via raw SQL queries.

## Steps Completed
1. **Uninstalled Prisma:** Removed `prisma` and `@prisma/client` dependencies from `package.json` and deleted `prisma` folder.
2. **Setup PG Driver:** Installed `pg` and `@types/pg` library to manage database connections.
3. **Initialized DatabasePool:** Created standard Database connection pool (`dbPool`) within `src/infrastructure/adapters/out/db/DatabasePool.ts`.
4. **Migrated Repositories:** Replaced Prisma query logic with raw SQL inserts and queries across our data access layer:
   - `PgRouteRepository` 
   - `PgBankRepository` 
   - `PgPoolRepository`
5. **Updated Entities & Math:** Modified Route entity to reflect the distinct PostgreSQL table structure (`id`, `vessel_type`, `fuel_type`, `ghg_intensity`, etc.). Created `IComplianceUseCase` to drive the correct Compliance Balance Math calculation endpoints:
   - `GET /api/compliance/cb` using mapping math logic: `(Target - Actual) * (Fuel Consumption * 41,000)`.
   - Built mapping logic for Postgres DB Tables (`routes`, `ship_compliance`, `bank_entries`, `pools`, `pool_members`).
6. **Executed Unit Testing:** Added Jest tests covering the core `ComplianceService.ts` calculation logic properly.
20. **Executed Unit Testing:** Added Jest tests covering the core `ComplianceService.ts` calculation logic properly.
21. **Implemented Core Domain Logic (Article 20/21):** Implemented pure TypeScript Domain Math (`ComputeCB` with Target Intensity 89.3368 and Energy Constant 41000) and Pooling & Banking rules (`BankSurplus`, `CreatePool` with Greedy Allocation logic) in `src/core/domain`.
22. **Expanded Unit Tests:** Created `tests/core/domain/ComplianceMath.test.ts` and `tests/core/domain/PoolingBankingRules.test.ts` to validate the pure domain formulas, including edge cases for negative pool sums.
23. **Mission 1: Application Services & Infrastructure Adapters**: Plumbed `IRouteRepository` and `IComplianceRepository` mapping PostgreSQL explicitly behind Domain Use Cases (`GetRoutesUseCase`, `CalculateCBUseCase`). Hooked adapters to Express controllers resolving dependencies cleanly in `ExpressApp.ts`. Built Supertest assertions hitting actual routes and PostgreSQL queries.
24. **Mission 2: Banking (Art. 20) & Route Comparison**: Resolved complex Route GHG Comparison logic. Implemented strict compliance rules mapped directly over `bank_entries` interacting via `PgComplianceRepository.saveBankEntry` and mapped them mathematically onto positive surpluses through `BankSurplusUseCase`.
25. **Mission 3: Pooling (Art. 21) Integration**: Configured Greedy Allocation structures pushing surplus transfers against deficit balances safely. Bound logic into `savePool` PostgreSQL transactions ensuring `BEGIN`, `COMMIT`, `ROLLBACK` safety maps natively without conflicting sequence fields!
26. **Mission 4: Audit & Seeding**: Added Database schema seeding files mapping Routes 001-005. Configured HTTP `GET /banking/records` mappings and completed Hexagonal bounds ESLint configurations. Documented backend workflow execution.
