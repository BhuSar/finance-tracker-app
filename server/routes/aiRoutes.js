import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Transaction from "../models/Transaction.js";
import OpenAI from "openai";

const router = express.Router();

// =======================
// AI INSIGHTS ROUTE
// =======================
router.get("/insights", protect, async (req, res) => {
  try {
    // ✅ CREATE CLIENT HERE (KEY IS GUARANTEED)
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        insights: "AI service unavailable. Missing API key.",
      });
    }

    const transactions = await Transaction.find({ user: req.user });

    if (!transactions.length) {
      return res.json({
        insights:
          "No transactions yet. Add some transactions and click Refresh to generate insights.",
      });
    }

    // =======================
    // FORMAT TRANSACTIONS
    // =======================
    const formattedTransactions = transactions
      .map(
        (t) =>
          `${t.amount > 0 ? "INCOME" : "EXPENSE"}: $${Math.abs(
            t.amount
          )} - ${t.category}`
      )
      .join("\n");

    // =======================
    // PROMPT (PLAIN TEXT ONLY)
    // =======================
    const prompt = `
You are a financial advisor.

Analyze the user's transactions below and respond using ONLY plain text.
Do NOT use markdown, asterisks, bullet symbols, or special formatting.

Return the response in this exact structure:

Summary of Spending:
<one short paragraph>

Good Trends:
<one short paragraph>

Bad Trends or Warnings:
<one short paragraph>

Personalized Suggestions:
1. <suggestion one>
2. <suggestion two>

Keep the entire response under 120 words.

Transactions:
${formattedTransactions}
`;

    // =======================
    // OPENAI REQUEST
    // =======================
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });

    const insights = completion.choices[0].message.content;

    res.json({ insights });

  } catch (err) {
    console.error("❌ AI Insights Error:", err);
    res.status(500).json({
      insights: "AI service unavailable. Please try again later.",
    });
  }
});

export default router;