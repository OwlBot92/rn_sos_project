import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import LottieView from 'lottie-react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import astronaut from '../../assets/lottie/astronaut-light-theme.json';

const MyContactList = () => {

    const [state, setState] = useState({
        isDataReady: false,
        myList: []
    });

    useEffect(() => {
        checkIfOnList();

        console.log(state.myList);
    }, []);

    //function to check if async storage has data and if it does, set the state to the data with isOnList to true
    const checkIfOnList = async () => {
        let myList = await AsyncStorage.getItem('@myContacts');
        //parse myList to JSON
        myList = JSON.parse(myList);
        //check type of myList and if it is an array filter out the contacts that are not on the list
        if (Array.isArray(myList)) {
            myList = myList.filter(contact => contact.isOnList === true);
            console.log(myList);
        }
        //set state to the filtered list
        setState({
            isDataReady: true,
            myList: myList
        });
    }

    const renderItem = ({ item }) => {
        return (
            <View
                style={
                    {
                        ...styles.singleContact,
                        backgroundColor: state.myList.indexOf(item) % 2 == 0 ? '#013646' : '#013646'
                    }
                }
            >
                <Text style={{
                    ...styles.textStyle,
                    color: state.myList.indexOf(item) % 2 == 0 ? '#fff' : '#fff'
                }}
                >{item.firstName}</Text>
                <Text style={{
                    ...styles.textStyle,
                    color: state.myList.indexOf(item) % 2 == 0 ? '#fff' : '#fff'
                }}
                >{item.number}</Text>
            </View>
        )
    }


    return (
        <>
            {
                state.isDataReady &&
                <SafeAreaView style={{ flex: 1, backgroundColor: '#013646' }}>
                    {
                        state.myList.length > 0 ?
                            <></>
                            :
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#fff', fontSize: 20 }}>You have no contacts on your list</Text>
                                <LottieView
                                    autoPlay
                                    style={{
                                        width: '100%',
                                        marginTop: 20,
                                       
                                    }}
                                    source={astronaut}
                                />
                            </View>

                    }
                    <FlatList data={state.myList} renderItem={renderItem} keyExtractor={item => item.id} />
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
        justifyContent: "space-between",
        padding: 16,
        borderBottomWidth: 2,
        borderBottomColor: 'teal',
    },
    textStyle: {
        padding: 2,
        fontSize: 18,
    }
})

export default MyContactList;