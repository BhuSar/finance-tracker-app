import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Always load .env from /server
dotenv.config({ path: path.join(__dirname, ".env") });

// =======================
// IMPORTS
// =======================
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import aiInsightsRoutes from "./routes/aiInsightsRoutes.js";
import aiSavingsRoutes from "./routes/aiSavingsRoutes.js";

// =======================
// CREATE APP
// =======================
const app = express();

// =======================
// DEBUG ENV (KEEP THIS)
// =======================
console.log("========== ENV CHECK ==========");
console.log("CWD:", process.cwd());
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI ? "Loaded" : "❌ Missing");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Loaded" : "❌ Missing");
console.log(
  "OPENAI_API_KEY:",
  process.env.OPENAI_API_KEY ? "Loaded" : "❌ Missing"
);
console.log("================================");

// =======================
// MIDDLEWARE
// =======================
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// =======================
// BASE ROUTES
// =======================
app.get("/", (req, res) => {
  res.send("API running...");
});

app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

// =======================
// API ROUTES
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/ai", aiInsightsRoutes);
app.use("/api/ai", aiSavingsRoutes);

// =======================
// DATABASE CONNECT
// =======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});