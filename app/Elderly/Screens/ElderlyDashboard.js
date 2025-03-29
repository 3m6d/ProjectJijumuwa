// app/auth/screens/ElderlyDashboard.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import ChatFaceData from '../Services/ChatFaceData';

export default function ElderlyDashboard() {
  const [chatFaceData, setChatFaceData] = useState([]);
  const [selectedChatFace, setSelectedChatFace] = useState(null); // Null initially
  const navigation = useNavigation();

  useEffect(() => {
    setChatFaceData(ChatFaceData);
    checkFaceId();
  }, []);

  const checkFaceId = async () => {
    try {
      const id = await AsyncStorage.getItem('chatFaceId');
      const face = id ? ChatFaceData[id] : ChatFaceData[0]; // Default to first face if no ID
      setSelectedChatFace(face);
    } catch (error) {
      console.error('Error checking chat face ID:', error);
      setSelectedChatFace(ChatFaceData[0]); // Fallback on error
    }
  };

  // Ensure selectedChatFace is loaded before rendering
  if (!selectedChatFace) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ alignItems: 'center', paddingTop: 80, marginTop: 90 }}>
      {/* Greeting */}
      <Text style={[{ color: selectedChatFace.primary }, { fontSize: 60 }]}>
        नमस्ते!
      </Text>
      
      {/* Chat Face Image */}
      <Image
        source={{ uri: selectedChatFace.image }}
        style={{ height: 150, width: 150, marginTop: 50 }}
      />

      {/* Chatbot Button */}
      <TouchableOpacity
        style={[
          { backgroundColor: selectedChatFace.primary },
          {
            marginTop: 40,
            padding: 17,
            width: Dimensions.get('screen').width * 0.6,
            borderRadius: 100,
            alignItems: 'center',
          },
        ]}
        onPress={() => navigation.navigate('ChatbotInterface')}
      >
        <Text style={{ fontSize: 30, color: '#fff' }}>आउनुस्, कुरा गरौँ ।</Text>
      </TouchableOpacity>

      {/* Music Player Button */}
      <TouchableOpacity
        style={[
          { backgroundColor: selectedChatFace.secondary || '#FFA000' }, // Use secondary color or fallback
          {
            marginTop: 20,
            padding: 17,
            width: Dimensions.get('screen').width * 0.6,
            borderRadius: 100,
            alignItems: 'center',
          },
        ]}
        onPress={() => navigation.navigate('MusicPlayer')}
      >
        <Text style={{ fontSize: 30, color: '#fff' }}>संगीत सुन्नुहोस्</Text>
      </TouchableOpacity>
    </View>
  );
}