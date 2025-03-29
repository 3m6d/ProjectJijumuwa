// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './app/auth/context/AuthContext';
import AppNavigation from './app/Elderly/Navigation/AppNavigation';

export default function App() {
  return React.createElement(
    AuthProvider,
    null,
    React.createElement(
      NavigationContainer,
      null,
      React.createElement(AppNavigation, null)
    )
  );
}
