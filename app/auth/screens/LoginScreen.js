"use client"

import { useState, useContext } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)

  
  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert("Error", "Please enter both phone number and password")
      return;
    }

    try {
      setLoading(true);
      const result = await login(phoneNumber, password);
      if (result.success) {
        const tokenData = result.data;
        console.log('Login tokenData:', tokenData); // Debug
        Alert.alert('Success', 'Login successful!');

        // Check role and navigate to the appropriate dashboard
        if (tokenData.role === 'elderly') {
          navigation.navigate('ElderlyNavigation');
        } else if (tokenData.role === 'caretaker') {
          navigation.navigate('CaretakerNavigation');
        } else {
          Alert.alert('Error', 'Unknown role received');
        }
      } else {
        throw new Error(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
        <Text style={styles.registerText}>Don't have an account? Register here</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 18,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  otpText: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  registerText: {
    marginTop: 20,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
})

export default LoginScreen