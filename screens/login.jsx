import React, { useRef, useState } from "react";
import { StyleSheet, 
    Text, 
    View, 
    Image, 
    TouchableOpacity, 
    StatusBar,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    TextInput} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {LinearGradient} from 'expo-linear-gradient';
import Logo from '../assets/img/ppcLogo.png';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_APP } from "../firebaseConfig";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { signInWithEmailAndPassword, 
    sendEmailVerification, 
    getMultiFactorResolver, 
    PhoneAuthProvider, 
    PhoneMultiFactorGenerator} from "firebase/auth";

const Login = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
    const navigation = useNavigation();
    const [loading, setIsLoading] = React.useState(false);
    const auth = FIREBASE_AUTH;
    const [cooldown, setCooldown] = React.useState(0);
    const [isLocked, setIsLocked] = React.useState(false);

    console.log("NAV:", navigation);

    React.useEffect(() => {
        let timer;
        if(cooldown > 0){
            setIsLocked(true);
            timer = setTimeout(()=>{
                setCooldown(cooldown - 1);
            }, 1000);
        }else{
            setIsLocked(false);
            clearInterval(timer);
        }

        return() => clearInterval(timer);
    }, [cooldown]);

   
    const signIn = async () => {
        
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if(!emailRegex.test(email)) {
                alert("Please enter a valid email address.");
                return;
            }

        setIsLoading(true);
        {/*Verification*/}
        try{
            const response = await signInWithEmailAndPassword(auth, email, password);
            const user = response.user;

            if (!user.emailVerified) {
                await sendEmailVerification(user);
                alert("Please verify your email first.");
                await auth.signOut();
                return;
            } 
            
            navigation.replace("Home");
          
        }catch(error)
        {
            if (error.code === 'auth/multi-factor-auth-required') {
                const resolver = getMultiFactorResolver(auth, error);
                
                // This is the correct way to pass the data
                navigation.navigate("MFAVerify", { 
                    resolver: resolver, 
                    phoneHint: resolver.hints[0]?.phoneNumber || '' 
                });
            } else {
                alert("Login failed: " + error.message);
            }
        }finally
        {
            setIsLoading(false);
        }
    }

    return (

   <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" 
      backgroundColor="#000000"/>


      <LinearGradient
        colors={['#5ECDC5', '#3e5974']}
        style={styles.background}
      >
        <View style={styles.centerChild}>
            <View style={styles.loginBox}> 
                <Image source={Logo} style={styles.logo} />
                <Text style={styles.Title}>Paw Point Care</Text>
                <Text style={styles.subtitle}>Your pet's health companion</Text>

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                     style={{ flex: 1, width: '100%' }}>
                    {/*EMAIL*/}
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput style={styles.textInput} 
                                placeholder="Enter your email"
                                onChangeText={(text) => setEmail(text)} 
                                value={email}/> 
                    
                    {/*PASSWORD*/}
                    <Text style={styles.inputLabel}>Password</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput style={styles.textInput} 
                                placeholder="Enter your password"
                                onChangeText={(text) => setPassword(text)} 
                                value={password}
                                secureTextEntry={!isPasswordVisible}
                                autoCapitalize="none"
                                autoCorrect={false}/>
                    
                        {/*PASSWORD VISIBILITY TOGGLE*/}
                        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                                style={styles.iconPosition}>
                        <MaterialCommunityIcons 
                                name={isPasswordVisible ? "eye-off" : "eye"} 
                                size={24} 
                                color="#ccc"/>
                        </TouchableOpacity>
                    </View>

                    {/*//LOGIN BUTTON AND SIGNUP LINK*/}
                    {loading ? <ActivityIndicator size="large" color="#5ECDC5"/>
                    : <>
                        <TouchableOpacity style={styles.loginBtn}
                                        activeOpacity={0.8}
                                        onPress={signIn}>
                        <Text style={styles.loginText}>Login</Text>
                        </TouchableOpacity>
                    </>}
                </KeyboardAvoidingView>
                 
                <Text style={styles.signUpReference}
                      onPress={() => navigation.navigate("SignUp")}>
                    Don't have an account? Sign up
                </Text>
            </View>            
        </View>
      </LinearGradient>
    </SafeAreaView>
       
    );
};

export default Login;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    background: {
        flex: 1,
    },

    centerChild:{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    loginBox: 
    {
        width: '85%',
        minHeight: 500,
        margin: 20,
        borderRadius: 20,
        padding: 20,
        maxHeight: 500,
        backgroundColor: 'white',
        alignItems: 'center',
        position: 'relative'
    },

    logo:{
        resizeMode: 'contain',
        width: 125,
        height: 125,
    },

    Title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#1F395F',
        fontFamily: 'montserrat-regular',
    },

    subtitle: {
        fontSize: 13,
        color: '#8a8787',
        fontFamily: 'montserrat-regular',
    },

    inputLabel: {
        marginTop: 20,
        alignSelf: 'flex-start',
        fontFamily: 'montserrat-regular',
        color: '#1F395F',
    },

    textInput: {
        fontFamily: 'montserrat-regular',
        width: '100%',
        height: 45,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginTop: 10,
        color: '#000',
        paddingRight: 50,

    },

    iconPosition: {
        position: 'absolute',
        right: 15,
        top: 20,    
    },

    passwordContainer: {
        width: '100%',
        flexDirection: 'row', 
        alignItems: 'center', 
        position: 'relative', 
    },

    loginBtn: {
        marginTop: 20,
        backgroundColor: '#5ECDC5',
        paddingVertical: 12,
        paddingHorizontal: 100,
        borderRadius: 20,  
    },

    loginText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },

    signUpReference: {
        color: '#5ECDC5',
        marginTop: 15,
        fontFamily: 'montserrat-regular',
    }

});