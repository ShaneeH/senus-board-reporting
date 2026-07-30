import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes"
import metricsRoutes from './routes/metrics.routes';
import openAiRoutes from "./routes/openai.routes";
import reportRoutes from "./routes/report.routes";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/health", healthRoutes);
app.use('/api', metricsRoutes);
app.use("/api/openai", openAiRoutes);
app.use("/api/reports", reportRoutes);

export default app;