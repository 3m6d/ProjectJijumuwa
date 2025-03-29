import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

// Import screens (we'll create these next)
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ElderlyInfoScreen from '../screens/auth/ElderlyInfoScreen';
import ElderlyDashboard from '../screens/elderly/ElderlyDashboard';
import CaretakerDashboard from '../screens/caretaker/CaretakerDashboard';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { isLoggedIn, userType, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isLoggedIn ? (
          // Auth Stack
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ElderlyInfo" component={ElderlyInfoScreen} />
          </>
        ) : (
          // App Stack
          <>
            {userType === 'elderly' ? (
              <Stack.Screen name="ElderlyDashboard" component={ElderlyDashboard} />
            ) : (
              <Stack.Screen name="CaretakerDashboard" component={CaretakerDashboard} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 