import express from "express";
import OpenAI from "openai";
import { protect } from "../middleware/authMiddleware.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

router.get("/savings", protect, async (req, res) => {
    try {
        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const transactions = await Transaction.find({ user: req.user });

        if (!transactions.length) {
            return res.json({
                suggestions: "Add some transactions to unlock savings suggestions.",
            });
        }

        const formatted = transactions
            .map(t => `${t.type.toUpperCase()}: $${t.amount} - ${t.category}`)
            .join("\n");

        const prompt = `
You are a financial advisor AI. Based on the user's transactions:

${formatted}

Generate EXACTLY 3 practical, personalized savings suggestions.
Keep the entire response under 80 words.
Do NOT number them. Separate each suggestion with a newline.
`;

        const aiResponse = await client.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 150,
        });

        res.json({ suggestions: aiResponse.choices[0].message.content });

    } catch (err) {
        console.error("AI Error:", err);
        res.status(500).json({ message: "AI service unavailable." });
    }
});

export default router;