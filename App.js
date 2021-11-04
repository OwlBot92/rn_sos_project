import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ActivityIndicator } from 'react-native';

import * as Contacts from 'expo-contacts';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

import EntryApp from './EntryApp';

const App = (props) => {

  const [state, setState] = useState({
    contactsPermissions: false,
    locationPermissions: false,
    root: 'Welcome',
  });

  const checkPermissions = async () => {
    const contactsPermission = await Contacts.requestPermissionsAsync();
    const locationPermissions = await Location.requestForegroundPermissionsAsync();

    
    

    setState({
      ...state,
      contactsPermissions: contactsPermission.status === 'granted',
      locationPermissions: locationPermissions.status === 'granted',
    });
  }
 
  useEffect(() => {
    checkPermissions();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {
        !state.contactsPermissions && !state.locationPermissions &&
        <ActivityIndicator />
      }
      {
        state.contactsPermissions && state.locationPermissions && 
        <EntryApp
          root={state.root}
        />
      }
      
    </SafeAreaView>
  );
}


export default App;