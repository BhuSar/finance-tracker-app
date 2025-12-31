import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Transaction from "../models/Transaction.js";
import OpenAI from "openai";

const router = express.Router();

const getUserId = (req) => req.user?.id || req.user?._id || req.user;

// ✅ POST /api/ai/predict-category
router.post("/predict-category", protect, async (req, res) => {
  try {
    const { name = "", amount = 0 } = req.body;

    // basic fallback (always returns something)
    let category = "Other";
    let confidence = "Low";

    const n = String(name).toLowerCase();
    if (n.includes("uber") || n.includes("lyft") || n.includes("mta")) {
      category = "Transportation";
      confidence = "Medium";
    } else if (n.includes("netflix") || n.includes("spotify") || n.includes("hulu")) {
      category = "Subscriptions";
      confidence = "Medium";
    } else if (n.includes("grocery") || n.includes("walmart") || n.includes("target")) {
      category = "Groceries";
      confidence = "Medium";
    } else if (n.includes("pizza") || n.includes("chipotle") || n.includes("restaurant") || n.includes("food")) {
      category = "Food";
      confidence = "Medium";
    }

    // If you have OpenAI key, you can upgrade prediction later.
    // For now: keep it reliable + non-breaking.
    return res.json({ category, confidence, amount: Number(amount) || 0 });
  } catch (err) {
    console.error("❌ predict-category error:", err.message);
    return res.status(500).json({ category: "Other", confidence: "Low" });
  }
});

// ✅ GET /api/ai/insights
router.get("/insights", protect, async (req, res) => {
  try {
    const userId = getUserId(req);

    const transactions = await Transaction.find({ user: userId }).sort({ date: -1 });

    if (!transactions.length) {
      return res.json({
        insights:
          "No transactions yet. Add some transactions and click Refresh to generate insights.",
      });
    }

    // If no OpenAI key, return a helpful fallback (so UI still works)
    if (!process.env.OPENAI_API_KEY) {
      const expenses = transactions.filter((t) => t.amount < 0);
      const totalSpent = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const biggest = expenses
        .reduce((acc, t) => {
          const cat = t.category || "Other";
          acc[cat] = (acc[cat] || 0) + Math.abs(t.amount);
          return acc;
        }, {});
      const topCategory = Object.keys(biggest).sort((a, b) => biggest[b] - biggest[a])[0] || "Other";

      return res.json({
        insights: `Fallback Insights: You have ${transactions.length} transactions. Total expenses: $${totalSpent.toFixed(
          2
        )}. Biggest spending category: ${topCategory}. Add OPENAI_API_KEY in server/.env for AI-generated insights.`,
      });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const formattedTransactions = transactions
      .slice(0, 80)
      .map(
        (t) =>
          `${t.amount > 0 ? "INCOME" : "EXPENSE"}: $${Math.abs(t.amount)} - ${t.category}`
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

// ✅ GET /api/ai/savings
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
    if (!expenses.length) {
      return res.json({
        savings: "You have no expenses yet. Add an expense to get savings suggestions.",
      });
    }

    const byCategory = expenses.reduce((acc, t) => {
      const cat = t.category || "Other";
      acc[cat] = (acc[cat] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

    const topCategory = Object.keys(byCategory).sort((a, b) => byCategory[b] - byCategory[a])[0];
    const topTotal = byCategory[topCategory] || 0;
    const targetSave = topTotal * 0.1;

    return res.json({
      savings: `Your biggest expense category is ${topCategory} ($${topTotal.toFixed(
        2
      )}). Try cutting it by 10% this month to save about $${targetSave.toFixed(2)}.`,
    });
  } catch (err) {
    console.error("❌ AI Savings Error:", err);
    return res.status(500).json({
      savings: "Savings service unavailable. Please try again later.",
    });
  }
});

export default router;