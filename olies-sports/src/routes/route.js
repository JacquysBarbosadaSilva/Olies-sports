import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons"; // Importa os ícones

import HomeScreen from "../screens/HomeScreen";
import Perfil from "../screens/Perfil";
import Categorias from "../screens/Categorias";
import Produtos from "../screens/Produtos";
import InfoProduto from "../screens/InfoProduto";
import SplashScreen from "../screens/SplashScreen"; 
import Enderecos from "../screens/Enderecos";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "Home") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "Perfil") {
                        iconName = focused ? "person" : "person-outline";
                    } else if (route.name === "Categorias") {
                        iconName = focused ? "list" : "list-outline";
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#052242", // Cor quando ativo
                tabBarInactiveTintColor: "#A3A3A3", // Cor quando inativo
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />

            <Tab.Screen name="Categorias" component={Categorias} />

            <Tab.Screen name="Perfil" component={PerfilStackNavigator} />

        </Tab.Navigator>
    );
}

function AppNavigation({navigation}) {
    return (

        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
                <Stack.Screen
                    name="Produtos"
                    component={Produtos}
                    options={({ navigation }) => ({
                        headerShown: true,
                        title: "Produtos",
                        headerLeft: () => (
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                style={{ marginLeft: 15 }}
                                onPress={() => navigation.goBack()}
                            />
                        ),
                    })}l
                />

                <Stack.Screen
                    name="InfoProduto"
                    component={InfoProduto}
                    options={({navigation}) => ({
                        headerShown: true,
                        title: "",
                        headerLeft: () => (
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color="#052242"
                                style={{ marginLeft: 15 }}
                                onPress={() => navigation.goBack()}
                            />
                        ),
                        headerRight: () => (
                            <Ionicons
                                name="heart-outline"
                                size={24}
                                color="#052242"
                                style={{ marginRight: 15 }}
                                onPress={() => console.log("Favorito clicado")}
                            />
                        ),
                    })}
                />
                <Stack.Screen
                    name="Enderecos"
                    component={Enderecos}
                    options={{
                        headerShown: false,
                        title: "Endereços",
                    }}
                    />

            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigation;
