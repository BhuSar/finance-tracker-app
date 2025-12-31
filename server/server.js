import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

// ✅ CORS: allow localhost + your deployed frontend
const allowedOrigins = [
  "http://localhost:5173",
  "https://finance-tracker-app-1-lkji.onrender.com", // ✅ your Render Static Site
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error("❌ CORS blocked:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Optional root route (nice for Render health check)
app.get("/", (req, res) => res.status(200).send("Finance Tracker API is running ✅"));

app.get("/api/ping", (req, res) => res.json({ message: "pong" }));

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/ai", aiRoutes);

// ✅ PROOF these endpoints exist:
app.get("/api/ai-test", (req, res) =>
  res.json({ ok: true, msg: "ai routes mounted" })
);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in environment variables.");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
    console.log("✅ RUNNING server/server.js with AI routes mounted");
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Server error:", err.message);
    process.exit(1);
  }
}

start();