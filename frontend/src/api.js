const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function login(email, password) {
  const body = new URLSearchParams({
    username: email,
    password,
  });
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error("Invalid credentials");
  return res.json();
}

export const api = {
  register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request("/me"),
  assessments: () => request("/assessments"),
  questions: (id) => request(`/assessments/${id}/questions`),
  startAssessment: (id) => request(`/assessments/${id}/start`, { method: "POST" }),
  submit: (payload) => request("/assessments/submit", { method: "POST", body: JSON.stringify(payload) }),
  adminAssessments: () => request("/admin/assessments"),
  createAssessment: (payload) => request("/admin/assessments", { method: "POST", body: JSON.stringify(payload) }),
  createQuestion: (payload) => request("/admin/questions", { method: "POST", body: JSON.stringify(payload) }),
  importQuestionBank: async (assessmentId, file) => {
    const token = getToken();
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API_BASE}/admin/question-bank/import?assessment_id=${assessmentId}`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Import failed");
    }
    return res.json();
  },
  listUsers: () => request("/admin/users"),
  updateUser: (id, payload) => request(`/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  leadershipOverview: () => request("/leadership/overview"),
};
