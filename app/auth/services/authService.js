// services/authService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Consolidate authentication services into one file
const BASE_URL = process.env.API_URL || 'http://localhost:8000/authentication/';

// Function to handle user login by making a POST request to the login endpoint
export const serviceLogin = async (phoneNumber, password) => {
  try {
    const response = await fetch(`${BASE_URL}login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'include',
      body: JSON.stringify({ 
        phone_number: phoneNumber.trim(),
        password: password // Should be hashed on the client side
      }),
    });
    console.log('Login response status:', response.status); // Debug
    const text = await response.text();
    console.log('Login response text:', text); // Debug raw response
    if (!response.ok) {
      throw new Error(`Login failed: ${text}`);
    }
    return JSON.parse(text); // { refresh, access, role, name }
  } catch (error) {
    console.error('Login error:', error);
    throw error; // Re-throw for handling in AuthContext or UI
  }
};

// Function to handle user registration by making a POST request to the register endpoint
export const serviceRegister = async (role, name, phoneNumber, password, elderlyUser = null) => {
  try {
    const body = { role, name, phone_number: phoneNumber, password };
    if (elderlyUser) body.elderly_user = elderlyUser; // { name, phone_number, password }
    const url = `${BASE_URL}register/`; // Use BASE_URL consistently
    console.log('Register URL:', url); // Debug
    console.log('Register payload:', body); // Debug
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    console.log('Register response status:', response.status); // Debug
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`Registration failed: ${text}`);
    }
    return JSON.parse(text); // { refresh, access, role, name }
  } catch (error) {
    console.error('Register error:', error);
    throw error; // Re-throw for handling in AuthContext or UI
  }
};

// Function to handle user logout by making a POST request to the sign out endpoint
export const serviceLogout = async () => {
  try {
    const refresh = await AsyncStorage.getItem('refreshToken');
    if (!refresh) {
      throw new Error('No refresh token found');
    }
    const url = `${BASE_URL}sign out/`; // Use BASE_URL consistently
    console.log('Logout URL:', url); // Debug
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    console.log('Logout response status:', response.status); // Debug
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`Logout failed: ${text}`);
    }
    return true; // Indicate success
  } catch (error) {
    console.error('Logout error:', error);
    throw error; // Re-throw for handling in AuthContext or UI
  }
};