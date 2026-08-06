import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes"
import openAiRoutes from "./routes/openai.routes";
import reportRoutes from "./routes/report.routes";
import companiesRouter from "./routes/companies.routes";
import { apiLimiter } from "./middleware/rate-limit";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", apiLimiter);
app.use("/api/health", healthRoutes);
app.use("/api/openai", openAiRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/companies", companiesRouter);

export default app;