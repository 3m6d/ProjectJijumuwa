import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const OtpInput = ({ length, onOtpChange }) => {
  const [otp, setOtp] = useState(Array(length).fill(''));

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    onOtpChange(newOtp.join(''));

    // Move to next input if value is entered
    if (value !== '' && index < length - 1) {
      this[`otpInput${index + 1}`].focus();
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          style={styles.input}
          value={digit}
          onChangeText={(value) => handleChange(value, index)}
          keyboardType="numeric"
          maxLength={1}
          ref={(input) => { this[`otpInput${index}`] = input; }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  input: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#000',
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 10,
  },
});

export default OtpInput;

