import express from "express";
import cors from "cors";
import qrRoutes from "./src/routes/qrRoutes.js";
import { PORT } from "./config/index.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", qrRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 QR Service running on http://localhost:${3000}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down gracefully...");
  server.close(() => process.exit(0));
});
