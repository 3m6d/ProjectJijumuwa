import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const ElderlyInfoScreen = () => {
  const { register } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const { caretaker } = route.params || {};
  const [formData, setFormData] = useState({ name: '', phoneNumber: '', pin: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const updateFormField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: null });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Enter a valid 10-digit phone number';
    else if (formData.phoneNumber === caretaker.phoneNumber) newErrors.phoneNumber = 'Elderly phone number must differ from caretaker's';
    if (!formData.pin.trim()) newErrors.pin = 'PIN is required';
    else if (!/^\d{4}$/.test(formData.pin)) newErrors.pin = 'PIN must be 4 digits';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      const { success, error } = await register(
        'caretaker',
        caretaker.name,
        caretaker.phoneNumber,
        caretaker.password,
        elderlyUser
      );
      if (success) {
        Alert.alert('Success', 'Registration successful!', [
          { text: 'OK', onPress: () => navigation.navigate('LoginScreen') },
        ]);
      } else {
        throw new Error(error || 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Registration Error', error.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Elderly Information</Text>
      <TextInput
        style={[styles.input, errors.name && styles.inputError]}
        placeholder='Elderly Name'
        value={formData.name}
        onChangeText={(text) => updateFormField('name', text)}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      <TextInput
        style={[styles.input, errors.phoneNumber && styles.inputError]}
        placeholder='Elderly Phone Number'
        value={formData.phoneNumber}
        onChangeText={(text) => updateFormField('phoneNumber', text)}
        keyboardType='phone-pad'
      />
      {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
      <TextInput
        style={[styles.input, errors.pin && styles.inputError]}
        placeholder='4-Digit PIN'
        value={formData.pin}
        onChangeText={(text) => updateFormField('pin', text)}
        keyboardType='numeric'
        maxLength={4}
        secureTextEntry
      />
      {errors.pin && <Text style={styles.errorText}>{errors.pin}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color='#fff' /> : <Text style={styles.buttonText}>Register</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F7FA' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10 },
  inputError: { borderWidth: 1, borderColor: '#FF3D71' },
  errorText: { color: '#FF3D71', marginBottom: 10 },
  button: { backgroundColor: '#4A90E2', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default ElderlyInfoScreen;