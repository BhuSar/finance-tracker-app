import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Transaction from "../models/Transaction.js";
import OpenAI from "openai";

const router = express.Router();

const getUserId = (req) => req.user?.id || req.user?._id || req.user;

// =======================
// AI INSIGHTS ROUTE
// GET /api/ai/insights
// =======================
router.get("/insights", protect, async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        insights:
          "OPENAI_API_KEY is missing in server/.env. Add it and restart the backend.",
      });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const userId = getUserId(req);

    const transactions = await Transaction.find({ user: userId });

    if (!transactions.length) {
      return res.json({
        insights:
          "No transactions yet. Add some transactions and click Refresh to generate insights.",
      });
    }

    const formattedTransactions = transactions
      .map(
        (t) =>
          `${t.amount > 0 ? "INCOME" : "EXPENSE"}: $${Math.abs(t.amount)} - ${
            t.category
          }`
      )
      .join("\n");

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

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });

    const insights = completion.choices?.[0]?.message?.content || "No response.";

    return res.json({ insights });
  } catch (err) {
    console.error("❌ AI Insights Error:", err);
    return res.status(500).json({
      insights: "AI service unavailable. Please try again later.",
    });
  }
});

// =======================
// AI SAVINGS ROUTE (placeholder)
// GET /api/ai/savings
// =======================
router.get("/savings", protect, async (req, res) => {
  try {
    const userId = getUserId(req);
    const transactions = await Transaction.find({ user: userId });

    if (!transactions.length) {
      return res.json({
        savings: "Add some transactions first, then refresh for suggestions.",
      });
    }

    const expenses = transactions.filter((t) => t.amount < 0);
    const totalSpent = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return res.json({
      savings: `You spent $${totalSpent.toFixed(
        2
      )} in expenses. Try setting a weekly cap for your biggest category and review subscriptions.`,
    });
  } catch (err) {
    console.error("❌ AI Savings Error:", err);
    return res.status(500).json({
      savings: "Savings service unavailable. Please try again later.",
    });
  }
});

export default router;