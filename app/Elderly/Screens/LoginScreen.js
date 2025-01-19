import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import OtpInput from 'Elderly/Components/OtpInput';
import { sendOtp, verifyOtp } from 'Elderly/Services/AuthenticationService';

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSendOtp = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    try {
      await sendOtp(phoneNumber);
      setOtpSent(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    }
  };

  const handleLogin = async () => {
    try {
      const verified = await verifyOtp(phoneNumber, otp);
      if (verified) {
        // Login successful, navigate to home screen
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
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
      {!otpSent ? (
        <Button title="Send OTP" onPress={handleSendOtp} />
      ) : (
        <View>
          <Text style={styles.otpText}>Enter OTP sent to your phone:</Text>
          <OtpInput length={6} onOtpChange={setOtp} />
          <Button title="Login" onPress={handleLogin} />
        </View>
      )}
      <Text style={styles.registerText} onPress={() => navigation.navigate('Registration')}>
        Don't have an account? Register here
      </Text>
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
  registerText: {
    marginTop: 20,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;

