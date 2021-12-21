import React, {useEffect, useState} from "react";
import { Alert, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { storage } from "../firebase";



import { auth } from "../firebase";
import { uploadBytes, ref, getDownloadURL } from "@firebase/storage";
import { updateProfile, onAuthStateChanged ,signOut } from "@firebase/auth";

import * as ImagePicker from 'expo-image-picker';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export default function Settings({navigation}){

    useEffect(() => {
        (async () => {
          
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }

            
            onAuthStateChanged(auth, (user) => {
            if (user) {
             
                setuid(user.uid)
       
            } else {
               navigation.replace("Auth")
            }
            });
          
        })();
      }, []);

      const [image, setImage] = useState(null);
      const [uid, setuid] = useState(null);

      return(
        <>
            <View style={styles.head}>
                <TouchableOpacity onPress={()=>{
                  navigation.navigate("Home")
                }}>
                     <Icon name="arrow-left-bold" size={30} color="#fff" />
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

            <View style={styles.main}>
                <TouchableOpacity onPress={ async ()=>{
                      let result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        aspect: [1, 1],
                        quality: 0.3,
                        base64: true,
                      });
                  
                      
                      if (!result.cancelled) {
                          setImage(result.uri);

                          const response = await fetch(result.uri);
                          const blob = await response.blob();
                          
                          
                          const storageRef = ref(storage, auth.currentUser.displayName);
                          
                          uploadBytes(storageRef, blob).then((snapshot) => {
                             
                            getDownloadURL(ref(storage, auth.currentUser.displayName))
                            .then((url) => {
                                updateProfile(auth.currentUser, {
                                    photoURL: url
                                    }).then(() => {
                                        setuid("dpne")
                                        setuid("dpne")
                                        setuid("dpne")
                                        Alert.alert("Done")
                                        setuid("dpne")
                                    }).catch((error) => {
                                        Alert.alert("try again later")
                                    });
                            })
                            .catch((error) => {
                                Alert.alert("try again later")
                            });

                          });
                          
                      }
                    
                }}>
                <Image
                    style={styles.Logo}
                    source={{
                    uri: auth?.currentUser?.photoURL,
                    }}
                />
                 <Icon name="lead-pencil" size={30} color="#fff"  style={{
                   position: "relative",
                   paddingLeft: 5,
                   paddingTop: 4,
                   bottom: 40,
                   left: 110,
                   height: 40,
                   width: 40,
                   backgroundColor: "green",
                   borderRadius: 100,
                 }}/>
                </TouchableOpacity>
                <Text style={{
                    color: "#fff",
                    fontFamily: "monospace",
                    fontWeight: "bold",
                    fontSize: 40,
                    paddingTop: 10,
                }}>{auth.currentUser.displayName}</Text>
                <Text style={{
                  color: "#808080",
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                }}>©TalhaIqbal</Text>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    Logo:{
        borderRadius: 100,
        width: 150,
        height: 150,
        borderColor: "green",
        borderWidth: 3,
    },
   head: {
    flex: 0.1,
    marginTop: 20,
   justifyContent: "space-around",
   alignItems: "center",
   flexDirection: "row",
   backgroundColor: "#1F1B24",
   borderBottomColor: '#fff',
    borderBottomWidth: 1,
   },
   main:{
    flex: 1,
    backgroundColor: "#1F1B24",
    justifyContent: "center",
    alignItems: "center",
   },
    });
    