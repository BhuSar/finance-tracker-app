import express from "express";
import OpenAI from "openai";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// ------------------------------------------
//  POST /api/ai/predict-category
//  Auto-predict transaction category
// ------------------------------------------
router.post("/predict-category", protect, async (req, res) => {
    try {
        const { name, amount } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Transaction name is required" });
        }

        const prompt = `
        You are an expert financial transaction classifier. 
        Predict the single MOST likely spending or income category.
        
        Transaction Name: "${name}"
        Amount: ${amount}
        
        Categories: Food, Groceries, Shopping, Bills, Transportation, Gas, Travel,
        Subscriptions, Entertainment, Personal Care, Salary, Income, Utilities, Other.
        
        Only return the category name. No explanation.
        `;

        const completion = await client.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                { role: "system", content: "You classify spending categories for finance apps." },
                { role: "user", content: prompt }
            ],
            max_tokens: 10,
            temperature: 0.3
        });

        const category = completion.choices[0].message.content.trim();

        return res.json({ category });
    } catch (error) {
        console.error("AI Category Error:", error);
        res.status(500).json({ message: "Failed to predict category" });
    }
});

export default router;