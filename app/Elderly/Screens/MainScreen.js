import { View, Text, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import ChatFaceData from '../Services/ChatFaceData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const [chatFaceData, setChatFaceData] = useState([]);
  const [selectedChatFace, setSelectedChatFace] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    setChatFaceData(ChatFaceData);
    checkFaceId();
  }, []);

  const checkFaceId = async () => {
    const id = await AsyncStorage.getItem('chatFaceId');
    id ? setSelectedChatFace(ChatFaceData[id]) : setSelectedChatFace(ChatFaceData[0]);
  };

  // Styles with yellow color scheme
  const styles = {
    container: {
      alignItems: 'center',
      paddingTop: 80,
      marginTop: 90,
      backgroundColor: '#FFF9C4', // Light yellow background
    },
    greetingText: {
      fontSize: 60,
      color: '#FFC107', // Vibrant yellow text (overriding selectedChatFace?.primary)
    },
    chatImage: {
      height: 150,
      width: 150,
      marginTop: 50,
    },
    button: {
      backgroundColor: '#FFC107', // Vibrant yellow (overriding selectedChatFace?.primary)
      marginTop: 40,
      padding: 17,
      width: Dimensions.get('screen').width * 0.6,
      borderRadius: 100,
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 25,
      color: '#fff', // White text for contrast
    },
  };

  return React.createElement(
    View,
    { style: styles.container },
    React.createElement(
      Text,
      { style: [styles.greetingText] },
      'नमस्ते!'
    ),
    React.createElement(Image, {
      source: { uri: selectedChatFace.image },
      style: styles.chatImage,
    }),
    React.createElement(
      TouchableOpacity,
      {
        style: [styles.button],
        onPress: () => navigation.navigate('chat'),
      },
      React.createElement(Text, { style: styles.buttonText }, 'आउनुस्, कुरा गरौँ ।')
    )
  );
}