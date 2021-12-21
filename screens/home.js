import React, {useCallback, useState, useEffect, useLayoutEffect} from 'react';
import { Alert, SafeAreaView, Settings, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { auth, db, storage } from '../firebase';

import {doc, addDoc, collection, orderBy, query, onSnapshot, Timestamp} from "firebase/firestore";
import { uploadBytes, ref, getDownloadURL } from "@firebase/storage";

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import * as ImagePicker from 'expo-image-picker';

import { GiftedChat, IMassage } from 'react-native-gifted-chat';
import CustomInputToolbar from "./CostomInputToolbar"


import { NavigationContainer } from '@react-navigation/native';



export default function Home({navigation}){

    const [messages, setMessages] = useState([]);
    const [images, setImage] = useState("");


    useLayoutEffect(() => {
       const chatref = collection(db, "chats")
       const q = query(collection(db, "chats"), orderBy("createdAt", "desc"));
       const unsubscribe = onSnapshot(q ,(snapshot)=>{ setMessages(
           snapshot.docs.map(doc=>({
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
            image: doc.data().image
           }))
           ) } );
       return unsubscribe;
    }, [])

   

  
    const onSend = useCallback((messages = [],  ) => {
      setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
      const {
        _id,
        createdAt,
        text,
        user,
   
    } = messages[0]

    addDoc(collection(db, "chats"), {
        _id,
        createdAt,
        text,
        user,
    
      });
    }, [])

  
  function  messageIdGenerator() {
      // generates uuid.
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
          let r = (Math.random() * 16) | 0,
              v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
      });
  }
   

    return (
    <>
      <View style={styles.hi}>

      <TouchableOpacity onPress={()=>{
        navigation.navigate("Settings")
      }}>
      <Icon name="account-cog" size={30} color="#fff" />
      </TouchableOpacity>

      <Text style={{
        color: "#fff",
        fontFamily: "monospace",
        fontWeight: "bold",
        fontSize: 20,
      }}>Anonyters!</Text>

      <TouchableOpacity onPress={()=>{
         Alert.alert(
          'Log Out',
          ' Are You Sure??',
          [
            
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'OK', onPress: () =>{
              signOut(auth).then(() => {
                  navigation.replace("Auth")
                }).catch((error) => {
                  Alert.alert("Try later")
                });
            }},
          ],
          {cancelable: false},
        );
      }}>

      <Icon name="logout" size={30} color="#fff" />
      </TouchableOpacity>

      </View>


      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        //onSend={messages => this.onSend(messages, image)}
        showAvatarForEveryMessage={true}
        user={{
          _id: auth?.currentUser?.email,
          avatar: auth?.currentUser?.photoURL,
          name: auth?.currentUser?.displayName,
        }}
        listViewProps={{ style: styles.contentContainer , placeholderTextColor: "white",}}
        renderInputToolbar={props => <CustomInputToolbar {...props} />}
        textInputStyle={{color: "white"}}
        renderUsernameOnMessage={true}
        style={styles.hello}

        renderActions={() => {
          
            return (
              <Icon
                name="camera"
                size={35}
                hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
                
                style={{
                  bottom: 5,
                  left: -27,                  
                  color: "white",
                  position: "absolute", 
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.5,
                  zIndex: 2,
                  backgroundColor: "transparent"
                }}
                onPress={ async ()=>{
                  
                  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                  let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    quality: 0.3,
                    base64: true,
                  });
              
                  
                  if (!result.cancelled) {
                      setImage(result.uri);

                      const response = await fetch(result.uri);
                      const blob = await response.blob();
                     
                      
                      const random = Math.random() * Date.now();
                    const storageRef = ref(storage, `images${random}`);
                      
                      uploadBytes(storageRef, blob).then((snapshot) => {
                       
                         getDownloadURL(ref(storage,`images${random}` ))
                            .then((url) => {
                            

                              addDoc(collection(db, "chats"), {
                                _id:  Math.random(),
                                createdAt:  Timestamp.fromDate(new Date()),
                                text: "",
                                user: {
                                  _id: auth?.currentUser?.email,
                                  avatar: auth?.currentUser?.photoURL,
                                  name: auth?.currentUser?.displayName,
                                },
                                image: url,
                              });
                             
                            })
                           
                            .catch((error) => {
                                Alert.alert("try again later")
                            });

                      });
                      
                  }
                
            }}
                
              />);
            
          }}
       />
    </>
  )
}

const styles = StyleSheet.create({
  hi:{
    flex: 0.1,
    marginTop: 20,
   justifyContent: "space-around",
   alignItems: "center",
   flexDirection: "row",
   backgroundColor: "#1F1B24",
   borderBottomColor: '#fff',
    borderBottomWidth: 1,
   
  },
  hello: {
    flex: 1,
    
  },
    container: {
      flex: 1,
      backgroundColor: '#fff',
      
    },
    contentContainer:{
        backgroundColor: "#1F1B24",
        
    }
    
  });
  