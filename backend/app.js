import express from "express";
import cors from "cors";
import morgan from "morgan";
import reportRoutes from "./routes/report.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "SENTIC backend is running" });
});

app.get("/", (req, res) => {
  res.send("Welcome to the SENTIC backend API");
});

app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
