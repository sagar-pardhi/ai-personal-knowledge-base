import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./modules/auth/auth.routes.js";
import kbRoutes from "./modules/kb/kb.routes.js";
import healthRoutes from "./routes/health.routes.js";

import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(cors());

app.use(morgan("dev"));

app.use(express.json());

app.use("/health", healthRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/kbs", kbRoutes);

app.use(errorHandler);

export default app;
