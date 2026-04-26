import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Intro from './screens/intro';
import Login from './screens/login';
import SignUp from './screens/signup';
import Home from './screens/home';
import Vets from './screens/vets';
import Book from './screens/book';
import {User} from 'firebase/auth';
import RegPet from './screens/regPet';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Intro" component={Intro} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />   
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Vets" component={Vets} />
        <Stack.Screen name="Book" component={Book} />
        <Stack.Screen name="RegPet" component={RegPet} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}