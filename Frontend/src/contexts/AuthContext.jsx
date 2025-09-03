// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import mockAuthService from "@/interfaces/api/__mocks__/mockAuthService";
import { ROLE_PERMISSIONS } from "@/shared/constants/roles";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onLogoutCallback, setOnLogoutCallback] = useState(null);

  // Set a callback to be called on logout
  const setLogoutCallback = useCallback((callback) => {
    setOnLogoutCallback(() => callback);
  }, []);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        if (mockAuthService.isAuthenticated()) {
          const userData = mockAuthService.getCurrentUser();
          if (userData) {
            setUser({
              token: mockAuthService.getToken(),
              role: userData.role || 'student',
              name: userData.username || 'Usuario',
              email: userData.email
            });
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const loggedUser = await mockAuthService.login(email, password);
      if (loggedUser && loggedUser.token) {
        const userData = {
          token: loggedUser.token,
          role: loggedUser.role || 'student',
          name: loggedUser.username || 'Usuario',
          email: loggedUser.email
        };
        setUser(userData);
        return userData;
      }
      throw new Error("Invalid response from authentication service");
    } catch (error) {
      console.error("Login error:", error);
      if (!error.response) {
        error.response = { data: { message: error.message || "Authentication failed" } };
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    mockAuthService.logout();
    setUser(null);
    // Call the logout callback if it exists
    if (onLogoutCallback) {
      onLogoutCallback();
    }
  }, [onLogoutCallback]);

  const hasPermission = (permission) => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.[permission] ?? false;
  };

  // Profile APIs
  const fetchProfile = async () => {
    const profile = await mockAuthService.getProfile();
    // keep context basic user fields in sync
    setUser((prev) => prev ? { ...prev, name: profile.name, email: profile.email, role: profile.role } : prev);
    return profile;
  };

  const updateProfile = async (updates) => {
    const updated = await mockAuthService.updateProfile(updates);
    // sync context
    setUser((prev) => prev ? { ...prev, name: updated.name, email: updated.email } : prev);
    return updated;
  };

  const isAuthenticated = !!user;
  const role = user?.role || 'guest';

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading,
      setLogoutCallback,
      hasPermission,
      isAuthenticated,
      role,
      fetchProfile,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
