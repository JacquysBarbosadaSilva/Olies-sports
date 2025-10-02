import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Importa os ícones
import HomeScreen from '../screens/HomeScreen';
import Perfil from '../screens/Perfil';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Perfil') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#052242', // Cor quando ativo
          tabBarInactiveTintColor: '#A3A3A3', // Cor quando inativo
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
        />
        <Tab.Screen 
          name="Perfil" 
          component={Perfil}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default TabNavigator;