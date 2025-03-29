import React from 'react';
import {
  View,Text,StyleSheet,Image,TouchableOpacity,SafeAreaView} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <Image
          source={require('../../Elderly/Assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Title and Subtitle */}
        <Text style={styles.title}>Welcome to Project Jijumuwa</Text>
        <Text style={styles.subtitle}>
          Connect with your loved ones and caregivers in one secure platform
        </Text>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('RegisterScreen')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.loginButton}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA', // Light gray background
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E3A59', // Dark slate
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#8F9BB3', // Muted gray
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  registerButton: {
    backgroundColor: '#4A90E2', // Blue for primary action
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 40,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#8F9BB3',
    marginRight: 5,
  },
  loginButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
});

export default WelcomeScreen;