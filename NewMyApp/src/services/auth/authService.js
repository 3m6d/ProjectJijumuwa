import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.API_URL || 'http://192.168.1.86:8081/authentication/';

export const authService = {
  login: async (phoneNumber, password) => {
    console.log('Attempting to log in with phone number:', phoneNumber);
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
          password: password.trim(),
        }),
      });

      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', data);

      if (response.ok) {
        await AsyncStorage.setItem('token', data.access);
        console.log('Login successful, token saved:', data.access);
        return { success: true, data };
      } else {
        console.error('Login failed with status:', response.status);
        throw new Error(data.detail || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  },

  saveMockToken: async (token) => {
    console.log('Saving mock token:', token);
    try {
      await AsyncStorage.setItem('token', token);
      console.log('Mock token saved successfully');
      return { success: true };
    } catch (error) {
      console.error('Save mock token error:', error);
      return { success: false, error: error.message };
    }
  },

  register: async (role, name, phoneNumber, password, elderlyUser = null) => {
    console.log('Attempting to register user:', { role, name, phoneNumber });
    try {
      const response = await fetch(`${BASE_URL}register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role,
          name,
          phone_number: phoneNumber.trim(),
          password: password.trim(),
          elderly_user: elderlyUser,
        }),
      });

      console.log('Registration response status:', response.status);
      const data = await response.json();
      console.log('Registration response data:', data);

      if (response.ok) {
        await AsyncStorage.setItem('token', data.access);
        console.log('Registration successful, token saved:', data.access);
        return { success: true, data };
      } else {
        console.error('Registration failed with status:', response.status);
        throw new Error(data.detail || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  },

  logout: async () => {
    console.log('Logging out user');
    try {
      await AsyncStorage.removeItem('token');
      console.log('User logged out successfully');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  },

  getToken: async () => {
    console.log('Retrieving token');
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token retrieved:', token);
      return token;
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  }
}; 