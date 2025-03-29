// app/Elderly/Navigation/AppNavigation.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../../auth/screens/WelcomeScreen';
import RegisterScreen from '../../auth/screens/RegisterScreen';
import ElderlyInfoScreen from '../../auth/screens/ElderlyInfoScreen';
import LoginScreen from '../../auth/screens/LoginScreen';
import ElderlyNavigation from './ElderlyNavigation'; // Nested navigator
import CaretakerNavigation from './CaretakerNavigation'; // New nested navigator

const Stack = createStackNavigator();

const AppNavigation = () => (
  <Stack.Navigator initialRouteName="WelcomeScreen">
    <Stack.Screen
      name="WelcomeScreen"
      component={WelcomeScreen}
      options={{ headerShown: false }} // Hide header for welcome screen
    />
    <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
    <Stack.Screen name="ElderlyInfoScreen" component={ElderlyInfoScreen} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen
      name="ElderlyNavigation"
      component={ElderlyNavigation}
      options={{ headerShown: false }} // Hide header for nested navigator
    />
    <Stack.Screen
      name="CaretakerNavigation"
      component={CaretakerNavigation}
      options={{ headerShown: false }} // Hide header for nested navigator
    />
  </Stack.Navigator>
);

export default AppNavigation;