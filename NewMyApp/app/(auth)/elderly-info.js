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
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function ElderlyInfo() {
  const params = useLocalSearchParams();
  const { register } = useAuth();
  const caretaker = JSON.parse(params.caretaker || '{}');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    pin: '',
  });

  const validatePhoneNumber = (phone) => /^\d{10}$/.test(phone);
  const validatePin = (pin) => /^\d{4}$/.test(pin);

  const validateForm = () => {
    if (!formData.name || !formData.phoneNumber || !formData.pin) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return false;
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      Alert.alert('Validation Error', 'Phone number must be exactly 10 digits.');
      return false;
    }

    if (!validatePin(formData.pin)) {
      Alert.alert('Validation Error', 'PIN must be exactly 4 digits.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const elderlyUser = {
        name: formData.name,
        phone_number: formData.phoneNumber,
        password: formData.pin,
      };

      const result = await register(
        'caretaker',
        caretaker.name,
        caretaker.phoneNumber,
        caretaker.password,
        elderlyUser
      );

      if (result.success) {
        Alert.alert('Success', 'Registration successful!', [
          { text: 'OK', onPress: () => router.replace('/(auth)/login') },
        ]);
      } else {
        throw new Error(result.error || 'Registration failed');
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
          <Text style={styles.title}>Elderly Information</Text>
          <Text style={styles.subtitle}>
            Please provide details for the elderly person
          </Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Elderly Person's Name"
              value={formData.name}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, name: text }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Elderly Person's Phone Number"
              value={formData.phoneNumber}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, phoneNumber: text }))
              }
              keyboardType="phone-pad"
              maxLength={10}
            />

            <TextInput
              style={styles.input}
              placeholder="4-digit PIN for Elderly"
              value={formData.pin}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, pin: text }))
              }
              secureTextEntry
              maxLength={4}
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Processing...' : 'Complete Registration'}
              </Text>
            </TouchableOpacity>
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
}); 