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

// Legacy Dependencies (omitting them from here if they conflict, but keeping them to not break the file)
// We will initialize the NEW Repositories, Use Cases, and Controllers
import { PgRouteRepository as NewPgRouteRepository } from "../../adapters/outbound/postgres/PgRouteRepository";
import { PgComplianceRepository } from "../../adapters/outbound/postgres/PgComplianceRepository";
import { GetRoutesUseCase } from "../../core/application/GetRoutesUseCase";
import { CalculateCBUseCase } from "../../core/application/CalculateCBUseCase";
import { GetRouteComparisonUseCase } from "../../core/application/GetRouteComparisonUseCase";
import { GetAdjustedCBUseCase } from "../../core/application/GetAdjustedCBUseCase";
import { BankSurplusUseCase } from "../../core/application/BankSurplusUseCase";
import { ApplyBankedSurplusUseCase } from "../../core/application/ApplyBankedSurplusUseCase";
import { GetBankRecordsUseCase } from "../../core/application/GetBankRecordsUseCase";
import { CreatePoolUseCase } from "../../core/application/CreatePoolUseCase";
import { SetBaselineUseCase } from "../../core/application/SetBaselineUseCase";

import { NewRouteController } from "../adapters/in/web/NewRouteController";
import { NewComplianceController } from "../adapters/in/web/NewComplianceController";
import { NewBankController } from "../adapters/in/web/NewBankController";
import { NewPoolController } from "../adapters/in/web/NewPoolController";

// New Initialization
const newRouteRepo = new NewPgRouteRepository();
const newComplianceRepo = new PgComplianceRepository();

const getRoutesUC = new GetRoutesUseCase(newRouteRepo);
const getRouteComparisonUC = new GetRouteComparisonUseCase(newRouteRepo);

const calculateCbUC = new CalculateCBUseCase(newComplianceRepo);
const getAdjustedCbUC = new GetAdjustedCBUseCase(newComplianceRepo);

const bankSurplusUC = new BankSurplusUseCase(newComplianceRepo);
const applyBankedSurplusUC = new ApplyBankedSurplusUseCase(newComplianceRepo);
const getBankRecordsUC = new GetBankRecordsUseCase(newComplianceRepo);
const createPoolUC = new CreatePoolUseCase(newComplianceRepo);

const newRouteCtrl = new NewRouteController(getRoutesUC, getRouteComparisonUC, new SetBaselineUseCase(newRouteRepo));
const newComplianceCtrl = new NewComplianceController(calculateCbUC, getAdjustedCbUC);
const newBankCtrl = new NewBankController(bankSurplusUC, applyBankedSurplusUC, getBankRecordsUC);
const newPoolCtrl = new NewPoolController(createPoolUC);

// Initialize Repositories (Legacy)
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
app.get("/routes/comparison", (req, res) => newRouteCtrl.getComparison(req, res));
app.get("/routes", (req, res) => newRouteCtrl.getRoutes(req, res));
app.post("/routes/:id/baseline", (req, res) => newRouteCtrl.setBaseline(req, res));

app.get("/compliance/cb", (req, res) => newComplianceCtrl.getComplianceCb(req, res));
app.get("/compliance/adjusted-cb", (req, res) => newComplianceCtrl.getAdjustedCb(req, res));

app.post("/banking/bank", (req, res) => newBankCtrl.bankSurplus(req, res));
app.post("/banking/apply", (req, res) => newBankCtrl.applyBankedSurplus(req, res));
app.get("/banking/records", (req, res) => newBankCtrl.getBankRecords(req, res));

app.post("/pools", (req, res) => newPoolCtrl.createPool(req, res));

// Legacy Endpoints
app.post("/api/routes", (req, res) => routeCtrl.registerRoute(req, res));
app.get("/api/routes", (req, res) => routeCtrl.getAllRoutes(req, res));
app.post("/api/routes/:id/baseline", (req, res) => routeCtrl.setBaseline(req, res));

app.get("/api/compliance/cb", (req, res) => complianceCtrl.getComplianceBalance(req, res));

app.post("/api/banking/bank", (req, res) => bankCtrl.bankSurplus(req, res));
app.get("/api/banking/:vesselName", (req, res) => bankCtrl.getBalance(req, res));

app.post("/api/pools", (req, res) => poolCtrl.createPool(req, res));
app.get("/api/pools", (req, res) => poolCtrl.getAllPools(req, res));

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
}

export default app;
