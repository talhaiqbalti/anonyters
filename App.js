import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import Auth from "./screens/auth"
import Home from './screens/home';
import Settings from './screens/settings';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

export default function App() {
  const Stack = createNativeStackNavigator();
  const Drawer = createDrawerNavigator();

  return(
    <NavigationContainer>
      <Stack.Navigator 
      initialRouteName="Auth"
      screenOptions={{
        headerShown: false
      }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>

      {/* <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Settings" component={Settings} />
      </Drawer.Navigator> */}

    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
});
