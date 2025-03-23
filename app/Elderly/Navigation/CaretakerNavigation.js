// app/Elderly/Navigation/CaretakerNavigation.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CaretakerDashboard from '../../Caretaker/Screens/CaretakerDashboard'; // Corrected path
// Add more caretaker-specific screens here as needed

const Stack = createStackNavigator();

const CaretakerNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="CaretakerDashboard" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CaretakerDashboard" component={CaretakerDashboard} />
      {/* Add additional screens like CaretakerProfile, ElderlyList, etc. */}
    </Stack.Navigator>
  );
};

export default CaretakerNavigation;