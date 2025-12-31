const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// =======================
// HELPER: AUTH HEADER
// =======================
function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// =======================
// AUTH
// =======================
export async function signup(email, password) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.token) localStorage.setItem("token", data.token);
  return data;
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.token) localStorage.setItem("token", data.token);
  return data;
}

export function logout() {
  localStorage.removeItem("token");
}

// =======================
// TRANSACTIONS
// =======================
export async function getTransactions() {
  const res = await fetch(`${API_URL}/transactions`, {
    headers: {
      ...authHeader(),
    },
  });
  return res.json();
}

export async function addTransaction(data) {
  const res = await fetch(`${API_URL}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateTransaction(id, data) {
  const res = await fetch(`${API_URL}/transactions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTransaction(id) {
  const res = await fetch(`${API_URL}/transactions/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeader(),
    },
  });
  return res.json();
}

export async function getSummary() {
  const res = await fetch(`${API_URL}/transactions/summary`, {
    headers: {
      ...authHeader(),
    },
  });
  return res.json();
}

// =======================
// AI
// =======================
export async function getAIInsights() {
  const res = await fetch(`${API_URL}/ai/insights`, {
    headers: {
      ...authHeader(),
    },
  });
  return res.json();
}

export async function getAISavings() {
  const res = await fetch(`${API_URL}/ai/savings`, {
    headers: {
      ...authHeader(),
    },
  });
  return res.json();
}