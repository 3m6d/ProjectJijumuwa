import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth/authService';
import { router } from 'expo-router';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isLoggedIn: false,
    userType: null,
    user: null,
  });

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await authService.getToken();
      if (token) {
        // Here you would typically validate the token with your backend
        // and get user data including role
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          isLoggedIn: true,
        }));
        
        // Redirect to appropriate dashboard if logged in
        // This is a simplified version - you'd normally get the role from a token verify call
        // router.replace('/(app)/(elderly)/dashboard');
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error('Auth state check error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  const login = async (phoneNumber, password, isMockLogin = false, mockData = null) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      let result;
      if (isMockLogin && mockData) {
        // Use mock data for demo logins
        result = mockData;
        
        // Save mock token to AsyncStorage
        await authService.saveMockToken(mockData.data.access);
      } else {
        // Normal login through API
        result = await authService.login(phoneNumber, password);
      }
      
      if (result.success) {
        setAuthState({
          isLoading: false,
          isLoggedIn: true,
          userType: result.data.role,
          user: { name: result.data.name, phone: phoneNumber },
        });
        
        // Navigate based on role
        if (result.data.role === 'elderly') {
          router.replace('/(app)/(elderly)/dashboard');
        } else {
          router.replace('/(app)/(caretaker)/dashboard');
        }
        
        return { success: true, data: result.data };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: error.message };
    }
  };

  const register = async (role, name, phoneNumber, password, elderlyUser = null) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const result = await authService.register(role, name, phoneNumber, password, elderlyUser);
      
      if (result.success) {
        setAuthState({
          isLoading: false,
          isLoggedIn: true,
          userType: result.data.role,
          user: { name: result.data.name, phone: phoneNumber },
        });
        
        // Navigate based on role
        if (result.data.role === 'elderly') {
          router.replace('/(app)/(elderly)/dashboard');
        } else {
          router.replace('/(app)/(caretaker)/dashboard');
        }
        
        return { success: true, data: result.data };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const result = await authService.logout();
      
      if (result.success) {
        setAuthState({
          isLoading: false,
          isLoggedIn: false,
          userType: null,
          user: null,
        });
        
        // Navigate to welcome screen
        router.replace('/');
        
        return { success: true };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: error.message };
    }
  };

  const value = {
    ...authState,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 