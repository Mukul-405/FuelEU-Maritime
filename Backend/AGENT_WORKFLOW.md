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
