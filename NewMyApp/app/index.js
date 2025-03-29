import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';

export default function Welcome() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo - using the actual logo from assets */}
        <Image
          source={require('../assets/chatbot-assets/logo.png')} // Update the path to your logo
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Welcome to Project Jijumuwa</Text>
        <Text style={styles.subtitle}>
          Connect with your loved ones and caregivers in one secure platform
        </Text>

        <Link href="/(auth)/register" asChild>
          <TouchableOpacity style={styles.registerButton}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </Link>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.loginButton}>Login</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Define styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  registerButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 30,
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginButton: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
}); 