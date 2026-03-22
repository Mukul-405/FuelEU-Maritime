# FuelEU Maritime Backend

This backend service implements the FuelEU Maritime framework standards, handling compliance logic (Banking Art 20, Pooling Art 21, and Deficit Calculations). It is built securely leveraging **Node.js, Express, TypeScript, and PostgreSQL**. The architecture strongly conforms to Hexagonal Architecture (Ports & Adapters) isolating all Domain Rules cleanly away from infrastructure interfaces.

## Setup Instructions

1. Ensure PostgreSQL is actively running locally on port 5432 using the `postgres` user.
2. Initialize tables and seeded routing data via our built-in SQL runner:
   ```bash
   npm run db:setup
   ```
3. Install missing core packages:
   ```bash
   npm install
   ```
4. Boot the Express API locally:
   ```bash
   npm run dev
   ```

## Testing & Quality

Execute robust Hexagonal assertions via Jest across our mapped Integration and Unit endpoints safely checking validation bounds.
```bash
npm run test
```

Formatting and Linting configurations ensure structural code compliance across updates:
```bash
npm run lint
npm run format
```
