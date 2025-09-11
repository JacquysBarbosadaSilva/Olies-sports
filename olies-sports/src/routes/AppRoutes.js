// src/routes/AppRoutes.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();

export default function AppRoutes() {
  return (
    <Stack.Navigator initialRouteName="Home">
      
    </Stack.Navigator>
  );
}
