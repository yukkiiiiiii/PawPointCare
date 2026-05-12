import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Standard for Expo projects

// Import your screens
import Intro from './screens/intro';
import Login from './screens/login';
import SignUp from './screens/signup';
import Home from './screens/home';
import Vets from './screens/vets';
import Book from './screens/book';
import RegPet from './screens/regPet';
import PetQrProf from './screens/petQrProf';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// --- 1. Bottom Tab Navigator Configuration ---
function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        // Fixes the "gray box" issue by defining a clean white background and height
        tabBarStyle: { 
          position: 'absolute',
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 10, // Adds shadow for Android
          shadowColor: '#000', // Adds shadow for iOS
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          height: 90,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: '#2f95dc',
        tabBarInactiveTintColor: 'gray',
        // Fixes the "missing logo/icons" seen in image_80c680.jpg
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Vets') {
            iconName = focused ? 'medical' : 'medical-outline';
          } else if (route.name === 'Book') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'RegPet') {
            iconName = focused ? 'paw' : 'paw-outline';
          } else if (route.name === 'PetQrProf') {
            iconName = focused ? 'qr-code' : 'qr-code-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Vets" component={Vets} />
      <Tab.Screen name="Book" component={Book} />
      <Tab.Screen name="RegPet" component={RegPet} />
      <Tab.Screen name="PetQrProf" component={PetQrProf} />
    </Tab.Navigator>
  );
}

// --- 2. Main App Entry Point ---
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Auth Flow: No Navbar visible here */}
        <Stack.Screen name="Intro" component={Intro} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        
        {/* 
           Main App Flow: The "Home" stack screen now loads the Tab Navigator.
           This fixes the 'REPLACE' error in image_812479.jpg when navigating from Login.
        */}
        <Stack.Screen name="Home" component={MyTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}