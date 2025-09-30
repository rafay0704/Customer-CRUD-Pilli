import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import customerRoutes from "./src/routes/customer.routes.js";
import { connectDB } from "./src/config/db.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});

// Customer routes
app.use("/api/v1/customers", customerRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
