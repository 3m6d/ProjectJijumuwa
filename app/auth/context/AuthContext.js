// app/auth/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { serviceLogin, serviceRegister, serviceLogout } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoading: false,      // Tracks loading state for UI feedback
    isLoggedIn: false,     // Tracks login status
    userType: null,        // Stores user role (elderly/caretaker)
    user: null,            // Stores user data (name, phone)
  });

  // Register function: Creates a new user and logs them in
  const register = async (role, name, phoneNumber, password, elderlyUser = null) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      const tokenData = await serviceRegister(role, name, phoneNumber, password, elderlyUser);
      console.log('Register tokenData:', tokenData); // Debug response

      // Store tokens in AsyncStorage
      await AsyncStorage.setItem('accessToken', tokenData.access);
      await AsyncStorage.setItem('refreshToken', tokenData.refresh);

      // Update auth state
      setAuthState({
        isLoading: false,
        isLoggedIn: true,
        userType: tokenData.role || role, // Fallback to role param if tokenData.role is missing
        user: { name: tokenData.name || name, phone: phoneNumber }, // Fallback to name param
      });

      return { success: true, data: tokenData }; // Return full response for UI
    } catch (error) {
      console.error('Register error:', error.message);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  // Login function: Authenticates user and updates state
  const login = async (phoneNumber, password) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      const tokenData = await serviceLogin(phoneNumber, password);
      console.log('Login tokenData:', tokenData); // Debug response

      // Store tokens in AsyncStorage
      await AsyncStorage.setItem('accessToken', tokenData.access);
      await AsyncStorage.setItem('refreshToken', tokenData.refresh);

      // Update auth state
      setAuthState({
        isLoading: false,
        isLoggedIn: true,
        userType: tokenData.role, // Expecting role from backend
        user: { name: tokenData.name, phone: phoneNumber }, // Expecting name from backend
      });

      return { success: true, data: tokenData }; // Return full tokenData for navigation
    } catch (error) {
      console.error('Login error:', error.message);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  // Logout function: Clears tokens and resets state
  const logout = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      await serviceLogout();

      // Clear tokens from AsyncStorage
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');

      // Reset auth state
      setAuthState({
        isLoading: false,
        isLoggedIn: false,
        userType: null,
        user: null,
      });

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error.message);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return { success: false, error: error.message || 'Logout failed' };
    }
  };

  // Optional: Check token on app load to restore session
  const restoreSession = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');

      if (accessToken && refreshToken) {
        // Optionally verify token with backend here
        setAuthState((prev) => ({
          ...prev,
          isLoggedIn: true,
          // userType and user would need to be fetched from backend or stored separately
        }));
      }
    } catch (error) {
      console.error('Session restore error:', error);
    } finally {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Expose authState and methods to consumers
  return (
    <AuthContext.Provider value={{ ...authState, register, login, logout, restoreSession }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy context access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};