import React, { useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { Audio } from 'expo-av';

const VoiceService = () => {
  const [sound, setSound] = useState(null);

  const tracks = [
    { id: '1', title: 'Track 1', uri: 'http://example.com/track1.mp3' },
    { id: '2', title: 'Track 2', uri: 'http://example.com/track2.mp3' },
  ];

  const playTrack = async (uri) => {
    if (sound) {
      await sound.unloadAsync();
    }
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync({ uri });
      await soundObject.playAsync();
      setSound(soundObject);
    } catch (error) {
      console.log('Error playing track:', error);
    }
  };

  const stopTrack = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  // Define styles as a plain object with yellow color scheme
  const styles = {
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFF99', // Light yellow background
    },
    titleText: {
      color: '#FFC107', // Vibrant yellow text
      fontSize: 24,
      fontWeight: 'bold',
    },
    buttonText: {
      color: '#FFEB3B', // Bright yellow for button text
    },
  };

  // Render using React.createElement instead of JSX
  return React.createElement(
    View,
    { style: styles.container },
    React.createElement(Text, { style: styles.titleText }, 'Music Player'),
    React.createElement(FlatList, {
      data: tracks,
      keyExtractor: (item) => item.id,
      renderItem: ({ item }) =>
        React.createElement(Button, {
          title: `Play ${item.title}`,
          onPress: () => playTrack(item.uri),
          color: styles.buttonText.color, // Apply yellow color to button text
        }),
    }),
    React.createElement(Button, {
      title: 'Stop',
      onPress: stopTrack,
      color: styles.buttonText.color, // Apply yellow color to button text
    })
  );
};

export default VoiceService;