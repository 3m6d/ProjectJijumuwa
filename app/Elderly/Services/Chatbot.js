import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import * as Permissions from 'expo-permissions';
import * as Speech from 'expo-speech';

const Chatbot = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [recording, setRecording] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Microphone permission is required!');
      }
    })();
  }, []);

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
      setIsRecording(true);
    } catch (error) {
      console.log('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setIsRecording(false);
      setRecording(null);
      const userText = await sendAudioToServer(uri);
      handleChatbotInput(userText);
    } catch (error) {
      console.log('Error stopping recording:', error);
    }
  };

  const sendAudioToServer = async (uri) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve('Hello'), 1000); // Mock STT response
    });
  };

  const handleChatbotInput = (text) => {
    let botResponse = '';
    if (text.toLowerCase().includes('hello')) {
      botResponse = 'Hi there!';
    } else if (text.toLowerCase().includes('how are you')) {
      botResponse = 'I am fine, thank you!';
    } else {
      botResponse = 'I did not understand that.';
    }
    setConversation((prev) => [...prev, { user: text, bot: botResponse }]);
    speak(botResponse);
  };

  const speak = (text) => {
    Speech.speak(text);
  };

  const speakFixedText = () => {
    const thingToSay = '1'; // You can change this to any text
    Speech.speak(thingToSay);
  };

  // Render logic using React.createElement instead of JSX
  return React.createElement(
    View,
    { style: styles.container },
    React.createElement(Text, null, 'Chatbot'),
    React.createElement(FlatList, {
      data: conversation,
      keyExtractor: (item, index) => index.toString(),
      renderItem: ({ item }) =>
        React.createElement(
          View,
          null,
          React.createElement(Text, null, `User: ${item.user}`),
          React.createElement(Text, null, `Bot: ${item.bot}`)
        ),
    }),
    React.createElement(Button, {
      title: isRecording ? 'Stop Recording' : 'Start Recording',
      onPress: isRecording ? stopRecording : startRecording,
    }),
    React.createElement(Button, {
      title: 'Press to hear some words',
      onPress: speakFixedText,
    })
  );
};

export default Chatbot;

// Assuming StyleSheet is defined elsewhere; it remains unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});