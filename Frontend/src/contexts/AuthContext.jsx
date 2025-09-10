// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import { ROLE_PERMISSIONS } from "@/shared/constants/roles";
import authService from "@/services/authService";
import { setupResponseInterceptors } from "@/services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children, onLogout }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onLogoutCallback, setOnLogoutCallback] = useState(() => onLogout);
  const [error, setError] = useState(null);

  // Set a callback to be called on logout 
  const setLogoutCallback = useCallback((callback) => {
    setOnLogoutCallback(() => callback);
  }, []);

  // Set up response interceptors
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      if (onLogoutCallback) {
        onLogoutCallback();
      }
    };

    // Configure interceptors with the logout handler
    setupResponseInterceptors(handleLogout);
  }, [onLogoutCallback]);

  // Check authentication status on load
  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      if (!isMounted) return;
      
      try {
        setLoading(true);
        
        // Run token validation and user fetch in parallel
        const [isTokenValid, currentUser] = await Promise.all([
          authService.validateToken().catch(() => false),
          authService.getCurrentUser().catch(() => null)
        ]);
        
        if (!isMounted) return;
        
        if (isTokenValid && currentUser) {
          setUser(currentUser);
          setError(null);
        } else {
          // If token is not valid, clear the state
          setUser(null);
          authService.logout();
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error checking auth status:", error);
          setError(error.response?.data?.message || "Error verifying authentication");
          setUser(null);
          authService.logout();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    checkAuth();
    
    return () => {
      isMounted = false; // Prevent state updates after unmount
    };
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Registrar al usuario
      const response = await authService.register({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'STUDENT'
      });
      
      if (response) {
        return { success: true, data: response };
      }
      
      return { success: false, error: 'No se pudo completar el registro' };
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error.response?.data?.message || "Registration error. Please try again.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.login({ email, password });
      setUser(response);
      return { success: true, data: response };
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "Authentication error. Please check your credentials.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async (options = {}) => {
    try {
      // Clear authentication state
      await authService.logout();
      setUser(null);
      setError(null);
      
      // Get redirect path from callback if it exists
      let redirectTo = '/auth';
      if (onLogoutCallback) {
        const result = onLogoutCallback();
        if (result) {
          redirectTo = result;
        }
      }
      
      // Redirect after clearing state
      if (options.redirect !== false) {
        if (redirectTo) {
          window.location.href = redirectTo;
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error during logout:', error);
      return { success: false, error };
    }
  }, [onLogoutCallback]);

  const hasPermission = (permission) => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.[permission] ?? false;
  };

  // Get authenticated user's profile
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const profile = await authService.getCurrentUser();
      setUser(profile);
      return profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      const errorMessage = error.response?.data?.message || "Error loading user profile";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (updates) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedProfile = await authService.updateProfile(updates);
      setUser(prev => ({ ...prev, ...updatedProfile }));
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || "Error updating profile";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    role: user?.role || 'guest',
    login,
    logout,
    register,
    hasPermission,
    setLogoutCallback,
    fetchProfile,
    updateProfile,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
