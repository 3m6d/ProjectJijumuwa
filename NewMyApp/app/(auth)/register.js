import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const [selectedRole, setSelectedRole] = useState('caretaker');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePhoneNumber = (phone) => /^\d{10}$/.test(phone);
  const validatePin = (pin) => /^\d{4}$/.test(pin);

  const handleRegister = async () => {
    if (!name || !phoneNumber || !password) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Validation Error', 'Phone number must be exactly 10 digits.');
      return;
    }

    if (selectedRole === 'elderly' && !validatePin(password)) {
      Alert.alert('Validation Error', 'Elderly PIN must be exactly 4 digits.');
      return;
    }

    try {
      setLoading(true);
      if (selectedRole === 'caretaker') {
        const caretaker = {
          name,
          phoneNumber,
          password
        };
        router.push({
          pathname: '/(auth)/elderly-info',
          params: { caretaker: JSON.stringify(caretaker) }
        });
      } else {
        const result = await register(selectedRole, name, phoneNumber, password);
        if (result.success) {
          Alert.alert('Success', 'Registration successful!', [
            { text: 'OK', onPress: () => router.push('/(auth)/login') },
          ]);
        } else {
          throw new Error(result.error || 'Registration failed');
        }
      }
    } catch (error) {
      Alert.alert('Registration Error', error.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Choose your role and fill in details</Text>

          <View style={styles.form}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedRole}
                onValueChange={(itemValue) => setSelectedRole(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Caretaker" value="caretaker" />
                <Picker.Item label="Elderly" value="elderly" />
              </Picker>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={10}
            />

            <TextInput
              style={styles.input}
              placeholder={selectedRole === 'elderly' ? '4-digit PIN' : 'Password'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              maxLength={selectedRole === 'elderly' ? 4 : undefined}
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Processing...' : selectedRole === 'caretaker' ? 'Next' : 'Register'}
              </Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.loginButton}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
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
  },
  form: {
    width: '100%',
  },
  pickerContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 15,
  },
  picker: {
    height: 50,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
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