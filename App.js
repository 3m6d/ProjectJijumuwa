// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './app/auth/context/AuthContext'; // Correct path
import AppNavigation from './app/Elderly/Navigation/AppNavigation';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigation />
      </NavigationContainer>
    </AuthProvider>
  );
}