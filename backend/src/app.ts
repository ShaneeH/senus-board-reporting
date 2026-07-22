import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes"
import metricsRoutes from './routes/metrics.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/health", healthRoutes);
app.use('/api', metricsRoutes);

export default app;