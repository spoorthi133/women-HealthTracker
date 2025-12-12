import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle expired token
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/* ================= AUTH ================= */
// export const authAPI = {
//   login: (email, password) => api.post("/auth/login", { email, password }),
//   register: (email, password) =>
//     api.post("/auth/register", { email, password }),
//   me: () => api.get("/users/me"),
// };

export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (email, password) => api.post("/auth/register", { email, password }),
  getCurrentUser: () => api.get("/users/me"), // ✅ FIX
};


/* ================= CYCLES ================= */
export const cycleAPI = {
  getAll: () => api.get("/cycles/"),
  create: (data) => api.post("/cycles/", data),
  getCurrent: () => api.get("/cycles/current"),
  update: (id, data) => api.put(`/cycles/${id}`, data),
  delete: (id) => api.delete(`/cycles/${id}`),
};

/* ================= SYMPTOMS ================= */
export const symptomAPI = {
  getAll: (skip = 0, limit = 20) =>
    api.get(`/symptom-logs?skip=${skip}&limit=${limit}`),

  create: (data) => api.post("/symptom-logs", data),

  update: (id, data) => api.put(`/symptom-logs/${id}`, data),

  delete: (id) => api.delete(`/symptom-logs/${id}`),

  getToday: () => api.get("/symptom-logs/today"),
};


/* ================= AI ================= */
export const aiAPI = {
  analyze: (days = 30, type = "comprehensive") =>
    api.post("/ai/analyze", { days, analysis_type: type }),
  ask: (question) => api.post("/ai/ask", { question }),
  predictCycle: () => api.get("/ai/predict-cycle"),
};

/* ================= HEALTH ================= */
export const healthAPI = {
  getHormonalRisk: () => api.get("/health/hormonal-risk"),
};

export default api;
