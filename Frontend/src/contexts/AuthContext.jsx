// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import mockAuthService from "@/services/mockAuthService";
import { ROLE_PERMISSIONS } from "@/constants/roles";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (mockAuthService.isAuthenticated()) {
      // Recuperar token y rol del localStorage
      const token = mockAuthService.getToken();
      // ⚡ aquí podrías decodificar token si simulas JWT, pero ahora lo mockeamos
      setUser({ token, role: "student" });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const loggedUser = await mockAuthService.login(email, password);
      setUser(loggedUser);
      return loggedUser;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    mockAuthService.logout();
    setUser(null);
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.[permission] ?? false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};
