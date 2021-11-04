import React, { useEffect, useState } from "react";
import { View, Dimensions, StyleSheet, ActivityIndicator, Text } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import pin from '../../assets/pngImages/pin_sos.png'
import * as Location from 'expo-location';


const MapScreen = () => {

    const [state, setState] = useState({
        region: {
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        },
        marker: pin,
        isDataReady: false,
    });

    useEffect(() => {
        (async () => {
            const areLocationServicesEnable = await Location.getProviderStatusAsync();
            if (!areLocationServicesEnable){
                alert('Please enable location services');
                return;
            } 
            else {
                let location = await Location.getCurrentPositionAsync({});
                setState({
                    ...state,
                    region: {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    },
                    isDataReady: true,
                });
            }
        })();
    }, []);

    return (
        <View>
            {
                state.isDataReady &&
                <MapView
                    initialRegion={state.region}
                    style={styles.map}
                >
                    <Marker
                        coordinate={{
                            latitude: state.region.latitude,
                            longitude: state.region.longitude,
                        }}
                        title="SOS"
                        description="SOS"
                        
                        style={{
                            width: 50,
                            height: 50,
                        }}
                    />
                </MapView>
            }
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});


export default MapScreen;
