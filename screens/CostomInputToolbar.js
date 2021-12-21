import React from 'react';
import { StyleSheet } from 'react-native';
import { InputToolbar } from 'react-native-gifted-chat';

const styles = StyleSheet.create({
  inputToolbarBackground: {
    backgroundColor: '#121212',
    paddingLeft: 30,
    
  },
});

export default function CustomInputToolbar  (props)  {
  return <InputToolbar containerStyle={styles.inputToolbarBackground} {...props} />
}
