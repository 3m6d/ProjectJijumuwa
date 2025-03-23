import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.1.70:8000/authentication/register";

// Updated register function with logging
const register = async (role, name, phoneNumber, password) => {
  try {
    // Construct payload using keys expected by Django
    const payload = {
      role,
      name: name.trim(),
      phone_number: phoneNumber.trim(),
      password: password.trim(),
    };

    console.log("Register payload:", JSON.stringify(payload));

    const response = await fetch(`${API_URL}/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Log raw response text for debugging if JSON parsing fails
    const text = await response.text();
    console.log("Raw response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      throw new Error("Failed to parse JSON from response");
    }

    console.log("Response data:", data);

    if (response.ok) {
      return data.user;
    } else {
      throw new Error(data.message || "Registration failed");
    }
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

const login = async (phoneNumber, password) => {
  try {
    const response = await fetch(`${API_URL}/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone_number: phoneNumber.trim(),
        password: password.trim(),
      }),
    });

    const data = await response.json();

    if (response.ok) {
    // Store the access token
      await AsyncStorage.setItem("token", data.access);
      // Return the full data including role
      return data;
    } else {
      throw new Error(data.detail || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

const logout = async () => {
  await AsyncStorage.removeItem("token");
};

const getToken = async () => {
  return await AsyncStorage.getItem("token");
};

export { login, register, logout, getToken };
