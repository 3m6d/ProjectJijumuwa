import { View, Text, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react';
import ChatFaceData from '../Services/ChatFaceData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
export default function HomeScreen() {

    const [chatFaceData,setChatFaceData]=useState([]);
    const [selectedChatFace,setSelectedChatFace]=useState([]);
    const navgitaion=useNavigation();
    useEffect(()=>{
        setChatFaceData(ChatFaceData)
        checkFaceId();
       
    },[]) 

    const checkFaceId=async()=>{
        const id= await AsyncStorage.getItem('chatFaceId');
        id?setSelectedChatFace(ChatFaceData[id]): setSelectedChatFace(ChatFaceData[0])
    }

  return (

    <View style={{alignItems:'center',paddingTop:80, marginTop:90}}>
      <Text style={[{color:selectedChatFace?.primary}, {fontSize:60,}]}>नमस्ते!</Text>
        <Image source={{uri:selectedChatFace.image}} 
        style={{height:150,width:150,marginTop:50}}/>

    <TouchableOpacity style={[{backgroundColor:selectedChatFace.primary}
        ,{marginTop:40,padding:17,width:Dimensions.get('screen').width*0.6,
         borderRadius:100,alignItems:'center'}]} 
         onPress={()=>navgitaion.navigate('chat')}>
        <Text style={{fontSize:30,color:'#fff'}}>आउनुस्, कुरा गरौँ ।</Text>
    </TouchableOpacity>
    </View>
  )
}