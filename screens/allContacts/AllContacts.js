import React, { useEffect, useState } from "react";
import { Text, View, FlatList, SafeAreaView, StyleSheet, StatusBar, Image } from "react-native";
import * as Contacts from 'expo-contacts';

import circle from '../../assets/pngImages/circle-button-red.png'
import checkColoured from '../../assets/pngImages/checkColoured.png'
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';


const AllContacts = () => {

    const [state, setState] = useState({
        isDataReady: false,
        contactsData: [],
        immutableContactsData: [],
    })

    useEffect(() => {
        myGetContactsAsync();
    }, [])

    const myGetContactsAsync = async () => {
        let myData = []

        //get content from async storage
        //if content is empty or null, then get contacts from device
        //else get contacts from async storage
        const asyncData = await AsyncStorage.getItem('@myContacts');
        //parse async data
        const parsedAsyncData = JSON.parse(asyncData);
        if (parsedAsyncData == null || parsedAsyncData.length == 0) {
            const { data } = await Contacts.getContactsAsync();
            for (const object of data) {
                if (object.phoneNumbers !== undefined && object.phoneNumbers.length > 0) {
                    myData.push({
                        firstName: object.firstName,
                        isOnList: false,
                        number: `${object.phoneNumbers[0].number.replace(/ /g, '').trim()}`,
                        id: object.id,
                    })
                }
            }
        }
        else {
            myData = parsedAsyncData;
        }


        setState({
            ...state,
            isDataReady: true,
            contactsData: myData,
            immutableContactsData: myData,
        })
    }


    const addContactToFavouriteList = (index) => () => {
        //create a new obj from contactsData[index] and change isOnList to the opposite
        let newObj = state.contactsData[index]
        newObj.isOnList = !newObj.isOnList
        //create a new array with the new obj
        let newData = state.contactsData;
        newData[index] = newObj

        //save array in async storage
        AsyncStorage.setItem('@myContacts', JSON.stringify(newData))
            .then(() => {
                setState({
                    ...state,
                    contactsData: newData,
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }



    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={addContactToFavouriteList(state.contactsData.indexOf(item))}>
                <View style={
                    {
                        ...styles.singleContact,
                        backgroundColor: state.contactsData.indexOf(item) % 2 == 0 ? '#013646' : '#013646'
                    }
                }>
                    <View style={{
                        width: '70%'
                    }}>
                        <Text style={{
                            ...styles.textStyle,
                            color: state.contactsData.indexOf(item) % 2 == 0 ? '#fff' : 'white'
                        }}>
                            {item.firstName}
                        </Text>

                        <Text style={{
                            ...styles.textStyle,
                            color: state.contactsData.indexOf(item) % 2 == 0 ? '#fff' : 'white'
                        }}>
                            {item.number}
                        </Text>

                    </View>

                    <View>
                        <Image
                            style={{ width: 30, height: 30 }}
                            source={item.isOnList ? checkColoured : circle}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }


    const filterContacts = (e) => {
        let newData = state.immutableContactsData;
        let filteredData = newData.filter(item => {
            if (item.firstName !== undefined && item.firstName.length > 0) {
                return item.firstName.toLowerCase().includes(e.toLowerCase())
            }
        })
        //set state
        setState({
            ...state,
            contactsData: filteredData,
        })
    }

    return (
        <>
            {
                state.isDataReady &&
                <SafeAreaView style={{
                    ...styles.container,
                    backgroundColor: '#013646'
                }}>
                    <TextInput style={{
                        ...styles.textInput,
                        backgroundColor: 'white',
                    
                    }} placeholder="Search" onChangeText={filterContacts} />
                    <FlatList data={state.contactsData} renderItem={renderItem} keyExtractor={item => item.id} />
                </SafeAreaView>
            }
        </>
    )
}


/* STYLE */
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    singleContact: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        padding: 8,
        borderBottomWidth: 2,
        borderBottomColor: 'teal',
    },
    textStyle: {
        padding: 2,
        fontSize: 18,
        
    },
    textInput: {
        height: 50,
        borderColor: 'teal',
        borderRadius: 25,
        borderWidth: 3,
        margin: 10,
        padding: 15,
    }
})

export default AllContacts;



