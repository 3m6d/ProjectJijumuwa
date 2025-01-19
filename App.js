import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ChatScreen from './app/Elderly/Screens/ChatScreen';
import HomeScreen from './app/Elderly/Screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import HomeNavigation from './app/Elderly/Navigation/HomeNavigation';

export default function App() {

  return (
    <View style={styles.container}>
      {/* <ChatScreen/> */}
      <NavigationContainer>
          <HomeNavigation/>
      </NavigationContainer>
      {/* <HomeScreen/> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  
  },
});