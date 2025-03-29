import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [selectedRole, setSelectedRole] = useState('caretaker');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useContext(AuthContext);

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

    if (selectedRole === 'caretaker') {
      navigation.navigate('ElderlyInfoScreen', { caretaker: { name, phoneNumber, password } });
    } else {
      if (!validatePin(password)) {
        Alert.alert('Validation Error', 'Elderly PIN must be exactly 4 digits.');
        return;
      }
      try {
        const { success, error } = await register(selectedRole, name, phoneNumber, password);
        if (success) {
          Alert.alert('Success', 'Registration successful!', [
            { text: 'OK', onPress: () => navigation.navigate('LoginScreen') },
          ]);
        } else {
          throw new Error(error || 'Registration failed');
        }
      } catch (error) {
        Alert.alert('Registration Error', error.message || 'Registration failed.');
      }
    }
  };

  const buttonText = selectedRole === 'elderly' ? 'Register' : 'Next';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <Text style={styles.label}>Select Role</Text>
      <Picker
        selectedValue={selectedRole}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedRole(itemValue)}
      >
        <Picker.Item label='Elderly' value='elderly' />
        <Picker.Item label='Caretaker' value='caretaker' />
      </Picker>
      <TextInput style={styles.input} placeholder='Name' value={name} onChangeText={setName} />
      <TextInput
        style={styles.input}
        placeholder='Phone Number'
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType='phone-pad'
      />
      <TextInput
        style={styles.input}
        placeholder={selectedRole === 'elderly' ? 'Enter 4-digit PIN' : 'Password'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.loginText}>Already have an account? Login here</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  label: {
    alignSelf: "flex-start",
    marginLeft: 10,
    marginBottom: 5,
    fontSize: 16,
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
  picker: {
    width: "100%",
    height: 50,
    marginBottom: 15,
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
  loginText: {
    marginTop: 20,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
});

export default RegisterScreen;
