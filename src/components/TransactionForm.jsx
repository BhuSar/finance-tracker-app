import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import axios from "axios";

export default function TransactionForm({ onAdd }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  // AI CATEGORY PREDICTION STATE
  const [aiCategory, setAiCategory] = useState("");
  const [confidence, setConfidence] = useState("");
  const [loadingPrediction, setLoadingPrediction] = useState(false);

  // ⭐ EMOJI MAP
  const categoryEmojis = {
    Food: "🍔",
    Groceries: "🛒",
    Shopping: "🛍️",
    Bills: "🧾",
    Transportation: "🚌",
    Gas: "⛽",
    Travel: "✈️",
    Subscriptions: "📺",
    Entertainment: "🎬",
    "Personal Care": "💅",
    Salary: "💼",
    Income: "💰",
    Utilities: "💡",
    Other: "📦",
  };

  const getEmoji = (cat) => categoryEmojis[cat] || "📦";

  // 🔮 AI PREDICTION
  const predictCategory = async (transactionName, amt) => {
    if (!transactionName || transactionName.trim().length < 2) {
      setAiCategory("");
      setConfidence("");
      return;
    }

    try {
      setLoadingPrediction(true);

      const res = await axios.post(
        "http://localhost:5000/api/ai/predict-category",
        { name: transactionName, amount: amt || 0 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      const { category, confidence: conf } = res.data;
      const finalCategory = category || "Unknown";
      const finalConfidence = conf || "Low";

      setAiCategory(finalCategory);
      setConfidence(finalConfidence);

      // Auto-fill if High
      if (String(finalConfidence).toLowerCase() === "high") {
        setCategory(finalCategory);
      }
    } catch (err) {
      console.error("AI Prediction Error:", err);
      toast.error("AI prediction failed");
      setAiCategory("Unknown");
      setConfidence("Low");
    } finally {
      setLoadingPrediction(false);
    }
  };

  // ⏳ Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      predictCategory(name, amount);
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  // SUBMIT HANDLER
  const submit = (e) => {
    e.preventDefault();

    if (!name || !amount || !category) {
      toast.error("Please fill out all fields.");
      return;
    }

    const t = {
      id: Date.now(),
      name,
      amount: Number(amount),
      category,
      date: new Date().toISOString(),
    };

    onAdd(t);

    setName("");
    setAmount("");
    setCategory("");
    setAiCategory("");
    setConfidence("");
    toast.success("Transaction added!");
  };

  // BADGE COLOR
  const level = String(confidence).toLowerCase();
  const badgeColor =
    level === "high"
      ? "bg-green-600"
      : level === "medium"
      ? "bg-yellow-500 text-black"
      : "bg-red-600";

  // ✅ One consistent input style (fixes “strange text”)
  const inputClass =
    "w-full p-2 rounded-md border " +
    "border-gray-300 bg-white text-gray-900 " +
    "placeholder:text-gray-500 " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500/30 " +
    "dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 " +
    "dark:placeholder:text-gray-400";

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        p-4 rounded-xl shadow-lg space-y-4 border
        bg-white border-gray-200 text-gray-900
        dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100
      "
    >
      <h2 className="text-lg font-semibold mb-2">Add Transaction</h2>

      {/* Name */}
      <input
        className={inputClass}
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Amount */}
      <input
        type="number"
        className={inputClass}
        placeholder="Amount (positive = income, negative = expense)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      {/* Category */}
      <input
        className={inputClass}
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      {/* AI SUGGESTION + CONFIDENCE */}
      {name && aiCategory && (
        <>
          {/* Suggestion Row */}
          <div
            className="
              flex items-center justify-between mt-1 px-2 py-1 rounded-lg text-xs
              bg-gray-100 text-gray-700
              dark:bg-gray-950 dark:text-gray-200
              border border-gray-200 dark:border-gray-800
            "
          >
            <p className="text-gray-700 dark:text-gray-200">
              <span className="font-semibold">AI Suggestion:</span>{" "}
              {loadingPrediction ? "Predicting..." : `${getEmoji(aiCategory)} ${aiCategory}`}
            </p>

            {!loadingPrediction && level !== "high" && (
              <button
                type="button"
                onClick={() => setCategory(aiCategory)}
                className="text-[10px] px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Use
              </button>
            )}
          </div>

          {/* Confidence Badge + Tooltip */}
          <div className="flex items-center gap-2">
            <div className={`inline-block px-3 py-1 mt-1 text-[10px] rounded-full ${badgeColor}`}>
              Confidence: {confidence}
            </div>

            {/* Tooltip */}
            <div className="relative group">
              <span className="text-gray-500 dark:text-gray-400 text-xs cursor-pointer">
                ℹ️
              </span>

              <div
                className="
                  absolute left-5 top-0 z-20 hidden group-hover:block
                  bg-black/80 text-white
                  dark:bg-white/90 dark:text-black
                  text-[10px] px-2 py-1 rounded shadow-lg w-40
                "
              >
                <p className="leading-tight">
                  <b>High</b> = Very confident
                  <br />
                  <b>Medium</b> = Unsure but likely
                  <br />
                  <b>Low</b> = Weak guess
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Submit Button */}
      <button
        className="
          w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700
          text-white font-semibold transform
          hover:scale-105 active:scale-95 transition
        "
      >
        Add Transaction
      </button>
    </motion.form>
  );
}