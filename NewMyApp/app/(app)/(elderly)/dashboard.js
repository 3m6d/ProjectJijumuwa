import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../../src/context/AuthContext';

export default function ElderlyDashboard() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // Navigation is handled in the AuthContext
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

        {/* Voice-activated Chatbot Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ChatbotInterface')}
        >
          <Text style={styles.buttonText}>Voice-Activated Chatbot</Text>
        </TouchableOpacity>

        {/* Music Player Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('MusicPlayer')}
        >
          <Text style={styles.buttonText}>Music Player</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});