import { authService } from '../auth/authService';

const BASE_URL = process.env.API_URL || 'http://192.168.1.86:8081/authentication/';

export const caretakerService = {
  // Appointments
  getAppointments: async () => {
    try {
      const token = await authService.getToken();
      const response = await fetch(`${BASE_URL}appointments/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Get appointments error:', error);
      return { success: false, error: error.message };
    }
  },

  createAppointment: async (appointmentData) => {
    try {
      const token = await authService.getToken();
      const response = await fetch(`${BASE_URL}appointments/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Create appointment error:', error);
      return { success: false, error: error.message };
    }
  },

  // Emergency Contacts
  getEmergencyContacts: async () => {
    try {
      const token = await authService.getToken();
      const response = await fetch(`${BASE_URL}emergency-contacts/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Get emergency contacts error:', error);
      return { success: false, error: error.message };
    }
  },

  addEmergencyContact: async (contactData) => {
    try {
      const token = await authService.getToken();
      const response = await fetch(`${BASE_URL}emergency-contacts/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Add emergency contact error:', error);
      return { success: false, error: error.message };
    }
  },

  // Medicine Management
  getMedicines: async () => {
    try {
      const token = await authService.getToken();
      const response = await fetch(`${BASE_URL}medicines/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Get medicines error:', error);
      return { success: false, error: error.message };
    }
  },

  addMedicine: async (medicineData) => {
    try {
      const token = await authService.getToken();
      const response = await fetch(`${BASE_URL}medicines/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(medicineData),
      });
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Add medicine error:', error);
      return { success: false, error: error.message };
    }
  },

  // Profile and Profit
  getProfile: async () => {
    try {
      const token = await authService.getToken();
      const response = await fetch(`${BASE_URL}profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Get profile error:', error);
      return { success: false, error: error.message };
    }
  },

  getProfitSummary: async () => {
    try {
      const token = await authService.getToken();
      const response = await fetch(`${BASE_URL}profit-summary/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Get profit summary error:', error);
      return { success: false, error: error.message };
    }
  },
}; 