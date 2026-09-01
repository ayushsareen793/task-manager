const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Central fetch wrapper: attaches the JWT (if present) and
// normalizes error handling so components don't repeat this logic.
async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = data?.message || "Something went wrong";
    throw new Error(message);
  }

  return data;
}

export const authApi = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload, auth: false }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload, auth: false }),
};

export const taskApi = {
  getAll: (params = "") => request(`/tasks${params}`),
  getOne: (id) => request(`/tasks/${id}`),
  create: (payload) => request("/tasks", { method: "POST", body: payload }),
  update: (id, payload) => request(`/tasks/${id}`, { method: "PUT", body: payload }),
  remove: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
};
