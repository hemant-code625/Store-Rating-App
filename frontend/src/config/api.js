// API configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    auth: {
      login: "/api/auth/signin",
      signup: "/api/auth/signup",
      logout: "/api/auth/logout",
      refresh: "/api/auth/refresh",
      updatePassword: "/api/auth/update-password",
    },
  },
};

export const fetchAPI = async (endpoint, options = {}) => {
  const url = `${apiConfig.baseURL}${endpoint}`;

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  return response;
};

export default apiConfig;
