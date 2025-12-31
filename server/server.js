import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// ✅ CORS (local dev + deployed frontend later)
const allowedOrigins = [
  "http://localhost:5173",
  // Add your deployed frontend URL here later (Render Static Site / Vercel / Netlify)
  // "https://your-frontend-domain.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman) or allowed origins
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ✅ Render / root route (prevents "Cannot GET /")
app.get("/", (req, res) => {
  res.status(200).send("Finance Tracker API is running ✅");
});

// ✅ Health check
app.get("/api/ping", (req, res) => res.json({ message: "pong" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/ai", aiRoutes);

// ✅ Proof route (optional)
app.get("/api/ai-test", (req, res) =>
  res.json({ ok: true, msg: "ai routes mounted" })
);

// ✅ IMPORTANT: Render provides PORT automatically
const PORT = process.env.PORT || 5000;

async function start() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing. Set it in Render Environment Variables.");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
    console.log("✅ RUNNING server/server.js with AI routes mounted");

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server error:", err.message);
    process.exit(1);
  }
}

start();
