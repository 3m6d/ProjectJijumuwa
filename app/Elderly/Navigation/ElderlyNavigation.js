// app/Elderly/Navigation/ElderlyNavigation.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ElderlyDashboard from '../Screens/ElderlyDashboard';
import ChatbotInterface from '../Screens/ChatbotInterface';
import MusicPlayer from '../Screens/MusicPlayer';

const Stack = createStackNavigator();

const ElderlyNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="ElderlyDashboard" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ElderlyDashboard" component={ElderlyDashboard} />
      <Stack.Screen name="ChatbotInterface" component={ChatbotInterface} />
      <Stack.Screen name="MusicPlayer" component={MusicPlayer} />
    </Stack.Navigator>
  );
};

export default ElderlyNavigation;