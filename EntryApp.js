import React, { useEffect, useState, } from 'react'
import { SafeAreaView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import Welcome from './screens/welcome/Welcome';
import MyContactList from './screens/myContactList/MyContactList';
import AllContacts from './screens/allContacts/AllContacts';
import MapScreen from './screens/mapScreen/MapScreen';

const EntryApp = (props) => {


    const Stack = createStackNavigator();



    return (
        <SafeAreaView style={{ flex: 1 }}>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName={props.root}
                    screenOptions={{
                        /* headerMode: 'none', */
                        gestureEnabled: false,
                    }}>

                    <Stack.Screen
                        options={
                            {
                                title: 'SOS App',
                                headerStyle: {
                                    backgroundColor: '#000'
                                },
                                headerTintColor: '#fff',
                            }
                        }
                        name='Welcome'
                        component={Welcome}
                    />

                    <Stack.Screen
                        options={
                            {
                                title: 'My List',
                                headerStyle: {
                                    backgroundColor: '#000'
                                },
                                headerTintColor: '#fff',
                            }
                        }
                        name='MyContactList'
                        component={MyContactList}
                    />

                    <Stack.Screen
                        options={
                            {
                                title: 'ALL',
                                headerStyle: {
                                    backgroundColor: '#000'
                                },
                                headerTintColor: '#fff',
                            }
                        }
                        name='AllContacts'
                        component={AllContacts}
                    />

                    <Stack.Screen
                        options={
                            {
                                title: 'Map',
                                headerStyle: {
                                    backgroundColor: '#000'
                                },
                                headerTintColor: '#fff',
                            }
                        }
                        name='MapScreen'
                        component={MapScreen}
                    /> 
                    
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    )
}

export default EntryApp;
