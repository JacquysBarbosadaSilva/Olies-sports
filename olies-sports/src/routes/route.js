import React from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";
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
import Pagamento from "../screens/Pagamento";
import DetalhesProduto from "../screens/DetalhesProduto";
import EditarEndereco from "../screens/EditarEndereco";
import CadastrarEndereco from "../screens/CadastrarEndereco";
import Comentarios from "../screens/Comentarios";
import Carrinho from "../screens/Carrinho";
import Login from "../screens/Login";
import Cadastro from "../screens/Cadastro";

const logoUrl = "https://olies-ports.s3.us-east-1.amazonaws.com/img/logotipo.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZYPPXAY4RCJUVETB%2F20251022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251022T213109Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEH4aCXVzLWVhc3QtMSJHMEUCIF5r9n3SlIlwrWIih6WGQBbM0tGPsmu0u7PQwsqhz%2BPlAiEAzLnLGZ5HWc0lLBpQCkn8Ylt59i%2BhXca%2BCmKpOjpOQeIqgwMINxAAGgw2NzEwNTQ0OTczMzciDDFO1pKJNryxXbCVoyrgAmMmOaS%2BflOGH6QAoaH6tzhwkvCfOw1wekhWdxd6GUAlmfhHfXztqglXHvi2%2FQTpdwpgBqVFOX54Jr9tA%2FG%2BhCyO9tJQWvEGsSpNrutHIdNSftmozjutyzZYH6KLii%2BZaAP%2BCN3lYeN%2FB%2FJLvosSMsCPw7pxl6xzcYL4d6GTtqsKlK6Kcv%2BDODZWmZe3jPJKj1%2FjO%2B203fQN9Dtx1ggorUTAuKfTXzaCnYvkpRPCJ2F6052rKZnjND%2FGmyvflyFr7JnTgKF3HVI164zMpxtFN%2BspzP5UBHMui0wtJR7XtVQbr8rytz4f6DYoDmL4RVxX0uGr2%2BCK1b6tGzOiEdLBsgZ21Z0e4%2Fl%2FjG%2FuxejOUZfQwhJpHnY5kbMu1oyYUKvuKTsyAgktsLbNkMG1WuopiJXaQKj%2Fcl%2BH0x0KXYz3q8mttq8QUpqOmh9rnkc6DxEMGmIWHzB9rLtRvhN7uc9PWXQwgNzkxwY6hwKiJY9COGoIhCXtEd48aip89g9td2xbtd54Ojr2N4wznAW2oK1ufZ9OTiMIo8tuOL%2BUhJigtU3KxkJugU2JVjLAnDctb6AImhjY4ULdlqxP35%2FI3LHaM1t5Wiw7ltZ3laOJ0FsSDiNt693oroD3pSBxs%2B4R01ye3Ra62%2B7w7wkJxGLcPLOHraDS36OLrSQh4jOAjiOey%2BrKt7t6QaiJgFu4qRVWLA23wQzhYTMRNpTzaTzU26pewVPuRhE5y7X82XqNiNdum8vVwd2KO6ZHlOWxKDqhiOV4PnOoNYGuDj99HpOK6hE8UIThBdCQAshDTd6VKPUYsMEc%2FQZQWUvQHDSYA31Mc7nikQ%3D%3D&X-Amz-Signature=11eb26d8eb399b6d2f91c9721a92839350d8a784acefe0d988a547de57c03b6f&X-Amz-SignedHeaders=host&response-content-disposition=inline";
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
          } else if (route.name === "Carrinho") {
            iconName = focused ? "cart" : "cart-outline";
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

      <Tab.Screen name="Carrinho" component={Carrinho} />

      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
}

function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* SplashScreen como primeira tela */}
        <Stack.Screen name="Splash" component={SplashScreen} />

        {/* Navegação principal */}
        <Stack.Screen name="Tabs" component={TabNavigator} />
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
          })}
        />
        <Stack.Screen
          name="Pagamento"
          component={Pagamento}
          options={({ navigation }) => ({
            headerShown: true,
            title: "",
            headerStyle: {
              backgroundColor: "#F3ECE2",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
              elevation: 4,
            },
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 15,
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={24} color="#052242" />
                <Text
                  style={{
                    color: "#052242",
                    fontSize: 20,
                    fontWeight: "bold",
                    marginLeft: 5,
                  }}
                >
                  Pagamento
                </Text>
              </TouchableOpacity>
            ),
            headerRight: () => (
              <Image source={{ uri: logoUrl }} />

            ),
          })}
        />

        <Stack.Screen
          name="InfoProduto"
          component={InfoProduto}
          options={({ navigation }) => ({
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
          name="DetalhesProduto"
          component={DetalhesProduto}
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: "",
            headerStyle: {
              backgroundColor: "#ded7cd",
              elevation: 0,
              shadowOpacity: 0,
            },
            headerLeft: () => (
              <Ionicons
                name="arrow-back"
                size={24}
                color="#052242"
                style={{ marginLeft: 15 }}
                onPress={() => navigation.goBack()}
              />
            ),
            headerTitle: () => (
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{ fontSize: 18, fontWeight: "500", color: "#000000" }}
                >
                  Jordan Zion 4
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#555555",
                    marginTop: 2,
                    width: 63,
                    textAlign: "center",
                  }}
                >
                  R$ 1199,99
                </Text>
              </View>
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => console.log("Adicionar aos favoritos")}
              >
                <Ionicons
                  name="heart-outline"
                  size={24}
                  color="#555555"
                  style={{ marginRight: 15 }}
                />
              </TouchableOpacity>
            ),
          })}
        />

        <Stack.Screen
          name="Comentarios"
          component={Comentarios}
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: "",
            headerStyle: {
              backgroundColor: "#f3ece2",
              elevation: 0,
              shadowOpacity: 0,
            },
            headerLeft: () => (
              <Ionicons
                name="close"
                size={24}
                color="#052242"
                style={{ marginLeft: 15 }}
                onPress={() => navigation.goBack()}
              />
            ),
            headerTitle: () => (
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{ fontSize: 18, fontWeight: "500", color: "#000000" }}
                >
                  Comentários
                </Text>

                <View style={{ flexDirection: "row", marginTop: 2 }}>
                  <Ionicons name="star" size={16} color="#052242" />
                  <Ionicons name="star" size={16} color="#052242" />
                  <Ionicons name="star" size={16} color="#052242" />
                  <Ionicons name="star" size={16} color="#052242" />
                  <Ionicons name="star" size={16} color="#052242" />
                </View>
              </View>
            ),

            headerRight: () => <View style={{ marginRight: 15 }} />,
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

        <Stack.Screen
          name="EditarEndereco"
          component={EditarEndereco}
          options={{
            headerShown: false,
            title: "EditarEnderecos",
          }}
        />
        <Stack.Screen
          name="CadastrarEndereco"
          component={CadastrarEndereco}
          options={{
            headerShown: false,
            title: "CadastrarEndereco",
          }}
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
            title: "Login",
          }}
        />

        <Stack.Screen
          name="Cadastro"
          component={Cadastro}
          options={{
            headerShown: false,
            title: "Cadastro",
          }}
        />
      </Stack.Navigator>

    </NavigationContainer>
  );
}

export default AppNavigation;
