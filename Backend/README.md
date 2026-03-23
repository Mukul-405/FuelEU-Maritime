# FuelEU Maritime — Backend

REST API implementing the FuelEU Maritime framework: compliance logic (Banking Art 20, Pooling Art 21, and Deficit Calculations). Built with **Node.js, Express 5, TypeScript, and PostgreSQL**. The architecture follows Hexagonal Architecture (Ports & Adapters), isolating domain rules from infrastructure.

## Setup Instructions

1. Ensure **PostgreSQL** is running locally (default port `5432`).

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your PostgreSQL credentials. See [.env.example](.env.example) for all available variables.

4. Create tables and seed data:
   ```bash
   npm run db:setup
   ```

5. Start the dev server (with hot-reload via Nodemon):
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:3001`.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DB_USER` | `postgres` | PostgreSQL username |
| `DB_PASSWORD` | `123456` | PostgreSQL password |
| `DB_HOST` | `localhost` | Database host |
| `DB_PORT` | `5432` | Database port |
| `DB_NAME` | `postgres` | Database name |
| `PORT` | `3001` | Express server port |

## Available Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `nodemon` + `ts-node` | Start dev server with hot-reload |
| `npm run build` | `tsc` | Compile TypeScript to `dist/` |
| `npm start` | `node dist/...` | Run compiled production build |
| `npm test` | `jest` | Run unit & integration tests |
| `npm run db:setup` | `ts-node seed.ts` | Create tables and seed data |
| `npm run lint` | `eslint` | Run ESLint on source files |
| `npm run format` | `prettier` | Format source files |

## Testing

Run all tests (unit + integration) via Jest:
```bash
npm test
```
