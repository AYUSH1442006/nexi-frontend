// src/services/api.js
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";


// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// ✅ FIXED API CALL HELPER
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add Authorization header if token exists
  if (token && !options.skipAuth) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    // ✅ FIXED: Use parentheses () not backticks for fetch
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // ✅ SAFE RESPONSE PARSING
    let data = {};
    const text = await response.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.warn("Non-JSON response:", text);
        data = { error: text };
      }
    }

    if (!response.ok) {
      const error = new Error(data.error || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    throw err;
  }
};

// ================= AUTH APIs =================
export const authAPI = {
  register: (userData) =>
    apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
      skipAuth: true,
    }),
  login: (credentials) =>
    apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      skipAuth: true,
    }),
  verifyToken: () => apiCall("/auth/verify"),
};

// ================= USER APIs =================
export const userAPI = {
  getProfile: () => apiCall("/api/users/profile"),
  getUserById: (id) => apiCall(`/api/users/${id}`),
  updateProfile: (userData) =>
    apiCall("/api/users/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    }),
  changePassword: (passwords) =>
    apiCall("/api/users/change-password", {
      method: "PUT",
      body: JSON.stringify(passwords),
    }),
  getStats: () => apiCall("/api/users/profile/stats"),
  searchUsers: (skill) => apiCall(`/api/users/search?skill=${skill}`),
  getTopRated: (limit = 10) => apiCall(`/api/users/top-rated?limit=${limit}`),
};

// ================= TASK APIs =================
export const taskAPI = {
  createTask: (taskData) =>
    apiCall("/api/tasks/create", {
      method: "POST",
      body: JSON.stringify(taskData),
    }),
  getOpenTasks: () => apiCall("/api/tasks/open"),
  getTasksByCategory: (category) => apiCall(`/api/tasks/category/${category}`),
  searchTasks: (keyword) => apiCall(`/api/tasks/search?keyword=${keyword}`),
  getTaskById: (id) => apiCall(`/api/tasks/${id}`),
  getMyTasks: () => apiCall("/api/tasks/my-tasks"),
  getAssignedTasks: () => apiCall("/api/tasks/assigned-to-me"),
  updateTask: (id, taskData) =>
    apiCall(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(taskData),
    }),
  deleteTask: (id) =>
    apiCall(`/api/tasks/${id}`, {
      method: "DELETE",
    }),
  startTask: (id) =>
    apiCall(`/api/tasks/${id}/start`, {
      method: "PUT",
    }),
  completeTask: (id) =>
    apiCall(`/api/tasks/${id}/complete`, {
      method: "PUT",
    }),
};

// ================= BID APIs =================
export const bidAPI = {
  placeBid: (bidData) =>
    apiCall("/api/bids/place", {
      method: "POST",
      body: JSON.stringify(bidData),
    }),
  getBidsForTask: (taskId) => apiCall(`/api/bids/task/${taskId}`),
  getMyBids: () => apiCall("/api/bids/my-bids"),
  acceptBid: (bidId) =>
    apiCall(`/api/bids/accept/${bidId}`, {
      method: "POST",
    }),
  rejectBid: (bidId) =>
    apiCall(`/api/bids/reject/${bidId}`, {
      method: "POST",
    }),
  deleteBid: (bidId) =>
    apiCall(`/api/bids/${bidId}`, {
      method: "DELETE",
    }),
};

// ================= REVIEW APIs =================
export const reviewAPI = {
  submitReview: (reviewData) =>
    apiCall("/api/reviews/submit", {
      method: "POST",
      body: JSON.stringify(reviewData),
    }),
  getReviewsForUser: (userId) => apiCall(`/api/reviews/user/${userId}`),
  getReviewsForTask: (taskId) => apiCall(`/api/reviews/task/${taskId}`),
  deleteReview: (reviewId) =>
    apiCall(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    }),
};

// ================= DASHBOARD APIs =================
export const dashboardAPI = {
  getStats: () => apiCall("/api/dashboard/stats"),
  getActivity: () => apiCall("/api/dashboard/activity"),
  getPlatformStats: () => apiCall("/api/dashboard/platform-stats"),
};

// ================= CATEGORY APIs =================
export const categoryAPI = {
  getCategories: () => apiCall("/api/categories"),
};

// ============= AI APIs =============
export const aiAPI = {
  rankBids: (taskId) =>
    apiCall(`/api/ai/rank-bids/${taskId}`, {
      method: "POST",
    }),
};

export const walletAPI = {
  getWallet: () => apiCall("/api/wallet"),
  addMoney: (amount) =>
    apiCall("/api/wallet/add-money", {
      method: "POST",
      body: JSON.stringify({ amount }),
    }),
};
export const paymentAPI = {
  createRazorpayOrder: (bidId, amount) =>
    apiCall("/api/payment/create-order", {
      method: "POST",
      body: JSON.stringify({ bidId, amount }),
    }),
  
  verifyPayment: (paymentData) =>
    apiCall("/api/payment/verify", {
      method: "POST",
      body: JSON.stringify(paymentData),
    }),
};