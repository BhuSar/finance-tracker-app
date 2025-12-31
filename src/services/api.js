const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://finance-tracker-app-w4x.onrender.com";

export default API_BASE;

function getToken() {
  return localStorage.getItem("authToken") || localStorage.getItem("token");
}

async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

  if (!res.ok) {
    const msg = (data && data.message) || (typeof data === "string" ? data : "") || `Error ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

export const getTransactions = () => request("/api/transactions");

export const addTransaction = (payload) =>
  request("/api/transactions", { method: "POST", body: JSON.stringify(payload) });

export const deleteTransaction = (id) =>
  request(`/api/transactions/${id}`, { method: "DELETE" });

export const updateTransaction = (id, payload) =>
  request(`/api/transactions/${id}`, { method: "PUT", body: JSON.stringify(payload) });

export const getSummary = () => request("/api/transactions/summary");

export const getAIInsights = () => request("/api/ai/insights");
export const getAISavings = () => request("/api/ai/savings");