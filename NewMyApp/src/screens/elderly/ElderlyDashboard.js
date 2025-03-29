import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

const ElderlyDashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      // Navigation will be handled by the AuthContext
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {user?.name}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Elderly Dashboard</Text>
        <Text style={styles.subtitle}>Your health and safety are our priority</Text>

        {/* Placeholder for future features */}
        <View style={styles.featureGrid}>
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Emergency Contacts</Text>
            <Text style={styles.featureDescription}>
              Access your emergency contacts
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Health Records</Text>
            <Text style={styles.featureDescription}>
              View your health information
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Medication Reminders</Text>
            <Text style={styles.featureDescription}>
              Manage your medications
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Activity Tracking</Text>
            <Text style={styles.featureDescription}>
              Monitor your daily activities
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  logoutButton: {
    padding: 8,
  },
  logoutButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default ElderlyDashboard; 