import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Send } from 'react-native-gifted-chat';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { chatApi } from '../../src/services/chatApi'; // Import the chatApi service

const CHAT_BOT_FACE = 'https://res.cloudinary.com/dknvsbuyy/image/upload/v1685678135/chat_1_c7eda483e3.png';

export default function ChatbotInterface() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initial message from the chatbot
    setMessages([
      {
        _id: 1,
        text: 'नमस्ते! म तपाईलाई कसरी सहयोग गर्न सक्छु?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Chatbot',
          avatar: CHAT_BOT_FACE,
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    if (messages[0].text) {
      getChatbotResp(messages[0].text);
    }
  }, []);

  const getChatbotResp = (msg) => {
    setLoading(true);
    chatApi.sendMessage(msg).then(resp => {
      const chatAIResp = {
        _id: Math.random() * (9999999 - 1),
        text: resp.data.resp[1]?.content || "Sorry, I cannot help with that.",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Chatbot',
          avatar: CHAT_BOT_FACE,
        },
      };
      setMessages(previousMessages => GiftedChat.append(previousMessages, chatAIResp));
      setLoading(false);
    }).catch(error => {
      console.error('Error fetching response:', error);
      setLoading(false);
    });
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: { backgroundColor: '#671ddf' },
          left: { backgroundColor: '#f0f0f0' },
        }}
      />
    );
  };

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar {...props} containerStyle={{ backgroundColor: '#671ddf' }} />
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={{ marginRight: 10, marginBottom: 5 }}>
          <FontAwesome name="send" size={24} color="white" />
        </View>
      </Send>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{ _id: 1 }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Add your styles here
});
