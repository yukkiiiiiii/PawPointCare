import React, {forwardRef} from 'react';
import { View, 
        Text, 
        StyleSheet } from 'react-native';

// We export a dummy Marker and provider so the Web doesn't error out
export const Marker = ({ children }) => <>{children}</>;
export const UrlTile = () => null;

const MapViewWrapper = forwardRef(({ style, children, ...props }, ref) => {
    return (
        <View style={[style, styles.webPlaceholder]}>
            <Text style={styles.text}>Map View is not supported on Web</Text>
            <Text style={styles.subtext}>Please use a mobile device to see the interactive map.</Text>
        </View>
    );
});

const styles = StyleSheet.create({
    webPlaceholder: {
        backgroundColor: '#E0F2F1',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderWidth: 1,
        borderColor: '#5ECDC5',
        borderRadius: 10,
        height: 250,
    },
    text: {
        color: '#1F395F',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtext: {
        color: '#8a8787',
        fontSize: 12,
        marginTop: 5,
        textAlign: 'center',
    },
});

export default MapViewWrapper;