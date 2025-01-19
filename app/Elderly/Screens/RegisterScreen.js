import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import OtpInput from 'Elderly/Components/OtpInput';
import { sendOtp, verifyOtp } from 'Elderly/Services/AuthenticationService';

const RegistrationScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleRegister = async () => {
    if (!name || !phoneNumber || !role) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await sendOtp(phoneNumber);
      setOtpSent(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const verified = await verifyOtp(phoneNumber, otp);
      if (verified) {
        // Registration successful, navigate to login or home screen
        Alert.alert('Success', 'Registration successful!', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Role (elderly or caretaker)"
        value={role}
        onChangeText={setRole}
      />
      {!otpSent ? (
        <Button title="Register" onPress={handleRegister} />
      ) : (
        <View>
          <Text style={styles.otpText}>Enter OTP sent to your phone:</Text>
          <OtpInput length={6} onOtpChange={setOtp} />
          <Button title="Verify OTP" onPress={handleVerifyOtp} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 18,
  },
  otpText: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
  },
});

export default RegistrationScreen;

