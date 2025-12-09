// AuthProvider.jsx
import { useState, useCallback } from "react";
import AuthContext from "../context/AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = useCallback((userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    const userId = user?.id;
    setUser(null);
    sessionStorage.removeItem("user");

    // Clear user-specific rating data
    if (userId) {
      sessionStorage.removeItem(`ratings_${userId}`);
      sessionStorage.removeItem(`averageRatings_${userId}`);
    }
  }, [user?.id]);

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
