import React, { useEffect, useState, } from 'react'
import { Text, TouchableOpacity, View, StyleSheet, Linking, Image, StatusBar } from "react-native"

import LottieView from 'lottie-react-native';
import SosLottie from '../../assets/lottie/sos_btn.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';

//IMAGES
import contact from '../../assets/pngImages/contact.png'
import bookmark from '../../assets/pngImages/bookmark.png'
import mapImg from '../../assets/pngImages/map.png'
import whatsappImg from '../../assets/pngImages/whatsapp.png'

const Welcome = (props) => {

    const [state, setState] = useState({
        isDataReady: false,
        contactsToNotify: [],
        numbersToNotify: [],
        userPosition: {},
        message: '',
    })

    const checkStorageContacts = async () => {
        const userLoc = await Location.getCurrentPositionAsync();
        const value = await AsyncStorage.getItem('@myContacts');
        //parse value to array
        const allContacts = JSON.parse(value);

        if (allContacts === null) {
            props.navigation.navigate('AllContacts')
        }

        else {
            const myContacts = allContacts !== null ?
                allContacts.filter(contact => contact.isOnList === true)
                : [];
            const myContactsNumbers = myContacts.map(contact => contact.number);

            console.log(myContactsNumbers);

            let lat = state.userPosition.latitude;
            let lon = state.userPosition.longitude;
            let message = `I need HELP, i am here https://www.google.com/maps/search/?api=1&query=${lat}%2C-${lon}`
            setState({
                ...state,
                message: message,
                numbersToNotify: myContactsNumbers,
                userPosition: userLoc.coords,
                isDataReady: true,
                contactsToNotify: myContacts
            })
        }
    }



    useEffect(() => {
        checkAppFocus();
        //checkStorageContacts();
    }, [])


    const goAllContacts = () => {
        props.navigation.navigate('AllContacts');
    }
    const goMyContactsList = () => {
        props.navigation.navigate('MyContactList');
    }
    const goMapScreen = () => {
        props.navigation.navigate('MapScreen');
    }


    //write a function that check if sms is avaiable if permission granted then send message to my contacts numbers else notify that some error occurred
    const sendMessage = async () => {
        const hasPermission = await SMS.isAvailableAsync();
        console.log(hasPermission);
        if (hasPermission && state.numbersToNotify.length > 0) {
            const { result } = await SMS.sendSMSAsync(state.numbersToNotify, state.message);
        }
        else {
            alert(!hasPermission ? 'SMS not avaiable' : 'Add contacts first');
        }
    }

    const sendWhatsAppMessage = () => {
        if (state.numbersToNotify.length > 0) {
            let newNumber = 0
            if (state.numbersToNotify[0].slice(0, 3) === '+44') {
                newNumber = state.numbersToNotify[0].slice(3);
                const url = `https://api.whatsapp.com/send?phone=+44${newNumber}&text=${state.message}`;
                Linking.openURL(url);
            }
            else {
                const url = `https://api.whatsapp.com/send?phone=+39${state.numbersToNotify[0]}&text=${state.message}`;
                Linking.openURL(url);
            }
        }
        else {
            alert('No contacts to notify');
        }
    }

    //write a function to check when the app is on focus and when it is not on focus
    const checkAppFocus = () => {
        const appState = props.navigation.addListener('focus', () => {
            checkStorageContacts();
        });
    }


    return (
        <>
            <StatusBar style="auto" />

            {
                state.isDataReady &&
                <View style={styles.mainContainer}>
                    <View style={styles.imgContainer}>
                        <TouchableOpacity onPress={sendMessage}>
                            <LottieView
                                autoPlay
                                style={{
                                    width: 300
                                }}
                                source={SosLottie}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.btnContainer}>
                        {/* goto chosen */}
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={goMyContactsList}
                        >
                            <Image
                                source={bookmark}
                                style={styles.btnImg}
                            />
                        </TouchableOpacity>

                        {/* goto SEE ALL CONTACTS */}
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={goAllContacts}
                        >
                            <Image
                                source={contact}
                                style={styles.btnImg}
                            />

                        </TouchableOpacity>

                        {/* send whatsapp message */}
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={sendWhatsAppMessage}
                        >
                            <Image
                                source={whatsappImg}
                                style={styles.btnImg}
                            />

                        </TouchableOpacity>

                        {/* see your position in the map */}
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={goMapScreen}
                        >
                            <Image
                                source={mapImg}
                                style={styles.btnImg}
                            />

                        </TouchableOpacity>
                    </View>
                </View>
            }
        </>

    )
}




/* COMMONS STYLE */
const flexedRow = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
}
const flexedCenter = {
    display: "flex",
    alignItems: "center",
    justifyContent: 'center'
}

/* STYLE */
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: '#013646'
    },
    btnImg: {
        width: 50,
        height: 50,
    },
    imgContainer: {
        ...flexedCenter,
        alignSelf: 'center',
        marginTop: 50,
    },

    btnContainer: {
        ...flexedRow,
        marginBottom: 30,
    },

    btn: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,

        backgroundColor: 'black',
        borderRadius: 10
    },
    btnText: {
        color: 'white'
    }
})



export default Welcome;