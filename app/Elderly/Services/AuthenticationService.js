// This is a mock service. In a real app, you'd integrate with a backend API.

const sendOtp = async (phoneNumber) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`OTP sent to ${phoneNumber}`);
        resolve();
      }, 1000);
    });
  };
  
  const verifyOtp = async (phoneNumber, otp) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, you'd verify the OTP with your backend
        const isValid = otp === '123456'; // For demo purposes, OTP is always 123456
        console.log(`OTP verification for ${phoneNumber}: ${isValid ? 'success' : 'failure'}`);
        resolve(isValid);
      }, 1000);
    });
  };
  
  export { sendOtp, verifyOtp };
  
  