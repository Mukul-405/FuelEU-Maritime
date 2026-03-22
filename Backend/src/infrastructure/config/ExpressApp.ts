import express from "express";
import cors from "cors";

// Adapters
import { PgRouteRepository } from "../adapters/out/db/PgRouteRepository";
import { PgBankRepository } from "../adapters/out/db/PgBankRepository";
import { PgPoolRepository } from "../adapters/out/db/PgPoolRepository";

// Use Cases
import { RegisterRouteUseCase } from "@application/use-cases/RegisterRouteUseCase";
import { BankingUseCase } from "@application/use-cases/BankingUseCase";
import { PoolingUseCase } from "@application/use-cases/PoolingUseCase";
import { ComplianceUseCase } from "@application/use-cases/ComplianceUseCase";

// Controllers
import { RouteController } from "../adapters/in/web/RouteController";
import { BankController } from "../adapters/in/web/BankController";
import { PoolController } from "../adapters/in/web/PoolController";
import { ComplianceController } from "../adapters/in/web/ComplianceController";

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Repositories
const routeRepo = new PgRouteRepository();
const bankRepo = new PgBankRepository();
const poolRepo = new PgPoolRepository();

// Initialize Use Cases
const routeUC = new RegisterRouteUseCase(routeRepo);
const bankUC = new BankingUseCase(bankRepo);
const poolUC = new PoolingUseCase(poolRepo);
const complianceUC = new ComplianceUseCase(routeRepo);

// Initialize Controllers
const routeCtrl = new RouteController(routeUC);
const bankCtrl = new BankController(bankUC);
const poolCtrl = new PoolController(poolUC);
const complianceCtrl = new ComplianceController(complianceUC);

// Endpoints
app.post("/api/routes", (req, res) => routeCtrl.registerRoute(req, res));
app.get("/api/routes", (req, res) => routeCtrl.getAllRoutes(req, res));
app.post("/api/routes/:id/baseline", (req, res) => routeCtrl.setBaseline(req, res));

app.get("/api/compliance/cb", (req, res) => complianceCtrl.getComplianceBalance(req, res));

app.post("/api/banking/bank", (req, res) => bankCtrl.bankSurplus(req, res));
app.get("/api/banking/:vesselName", (req, res) => bankCtrl.getBalance(req, res));

app.post("/api/pools", (req, res) => poolCtrl.createPool(req, res));
app.get("/api/pools", (req, res) => poolCtrl.getAllPools(req, res));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });

export default app;
