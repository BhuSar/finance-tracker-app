import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

const getUserId = (req) => req.user?._id || req.user?.id || req.user;

/* SUMMARY (must be above /:id) */
router.get("/summary", protect, async (req, res) => {
  try {
    const userId = getUserId(req);
    const transactions = await Transaction.find({ user: userId });

    let income = 0;
    let expenses = 0;

    transactions.forEach((t) => {
      if (t.amount >= 0) income += t.amount;
      else expenses += Math.abs(t.amount);
    });

    res.json({ income, expenses, balance: income - expenses });
  } catch (err) {
    res.status(500).json({ error: "Failed to load summary" });
  }
});

/* GET ALL */
router.get("/", protect, async (req, res) => {
  try {
    const userId = getUserId(req);
    const transactions = await Transaction.find({ user: userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

/* CREATE */
router.post("/", protect, async (req, res) => {
  try {
    const userId = getUserId(req);
    const { type, category, amount, note, date } = req.body;

    if (!category || amount === undefined) {
      return res.status(400).json({ error: "Category and amount are required" });
    }

    const transaction = await Transaction.create({
      user: userId,
      type: type || "expense",
      category,
      amount: Number(amount),
      note: note || "",
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: "Failed to create transaction" });
  }
});

/* UPDATE */
router.put("/:id", protect, async (req, res) => {
  try {
    const userId = getUserId(req);

    const txn = await Transaction.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!txn) return res.status(404).json({ error: "Transaction not found" });

    const { type, category, amount, note, date } = req.body;

    if (type !== undefined) txn.type = type;
    if (category !== undefined) txn.category = category;
    if (amount !== undefined) txn.amount = Number(amount);
    if (note !== undefined) txn.note = note;
    if (date !== undefined) txn.date = new Date(date);

    await txn.save();
    res.json(txn);
  } catch (err) {
    res.status(500).json({ error: "Failed to update transaction" });
  }
});

/* DELETE */
router.delete("/:id", protect, async (req, res) => {
  try {
    const userId = getUserId(req);

    const txn = await Transaction.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!txn) return res.status(404).json({ error: "Transaction not found" });

    await txn.deleteOne();
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});

export default router;