import React from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons"; // Importa os ícones
import { FavoritesProvider } from "../context/FavoritesContext";
import { useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

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
import RedefinirSenha from "../screens/RedefinirSenha";
import ListaDesejos from "../screens/ListaDesejos";

const logo =
  "https://olies-ports.s3.us-east-1.amazonaws.com/img/logotipo.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZYPPXAY4734NIBZV%2F20251022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251022T235611Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEID%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIGvmmEbnoo8A5Fdf8W2j18XJW5qtr3gOl6OBDNDfiwpWAiEAwC%2BzlALsTuK3suf8HIFQMeLVuRQ5RktuUvqmb5DYzOYqgwMIORAAGgw2NzEwNTQ0OTczMzciDD4fTZLRXeWJOM%2FkqSrgAoN1eRCYZ77Yng%2BFeCSKuuMSSrydPsdD6njlM0bRekayD4NA4U9tVPhK4oILw%2BIcF7JisLgQWEVNgO99q2j4XmG9wr7Hb%2BS44bDY95g6vVp8%2BYrtcEW64TFeeMAGLRvZS7o86JODie5Ny44hjLc6BwQipHrNthk8acbmXXbcJhAMSeyESGVO3kPXoRVm%2BD%2F2PpQStUZ%2B3NtoqzhpB2QodSFvDFPf04jX%2FNglb71k0Tm4ONuI4MMPER5VIM0T8rLWvXu45TP57adERC5s6mrNdLZS17stW6jL871ztuR0RKKlFXb1bYidZn6UD93CjESnTWFhOZ5CO9b3RXmvd0gA458byssMpWkLv6VTpiihTNqBPsH5Pa7bjNAazLxh10XL8zJaBpEpsb%2Btz68U4WoLva9VIsXrAMjOpxtKT%2FXiTJTt57%2BAMm5ZZfz%2FZuOoQkq2DqdzB3OCoZdUaH3twl95oA0wztzlxwY6hwKAY%2Bh%2FeqjRDrz%2FV9WrYRZ7M6wxVtxV6OcMYiREbFWxNASvDMH5G%2BHSKn%2FpOS3rLsf41BNaEb%2B%2Ft%2Bhs3wPo3JM%2FhwpFB4iqqtk19DxYd0QV5yF90%2Fsbtmf%2BuvL8U562tjiIi3ksIl%2BYPdnQWHe2Dn0SLtiGwZKz9koREiBi0fH%2BTidrBx5ODF49xQjkv%2Fu1tSueUCwJpZnHPP6QZO2N1Nld9ryupVyE0jMzwUMNyRqHTv5%2BI8R17rddobFkjLsQWTdU9UByaHQKVCcUgKand5sBpWa9ZbCPVxG65VKaS2RngWz%2FJLl%2FyKRDgwSnDO5kBw8moUe5GDC1vxFWFceyL8lJoJHFnu6SvQ%3D%3D&X-Amz-Signature=c99b628c851bdc3a16c6821edb1ef5bca6c456f85c6e57f8060a30b8f1f4740f&X-Amz-SignedHeaders=host&response-content-disposition=inline";
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
          } else if (route.name === "Lista de Desejos") {
            iconName = focused ? "heart" : "heart-outline";
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

      <Tab.Screen name="Lista de Desejos" component={ListaDesejos} />

      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
}

function AppNavigation() {
  return (
    <FavoritesProvider>
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
                <Image
                  source={{ uri: logo }}
                  style={{
                    width: 75,
                    height: 75,
                    marginRight: 15,
                  }}
                  resizeMode="contain"
                />
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
                    style={{
                      fontSize: 18,
                      fontWeight: "500",
                      color: "#000000",
                    }}
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
                    style={{
                      fontSize: 18,
                      fontWeight: "500",
                      color: "#000000",
                    }}
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

          <Stack.Screen
            name="RedefinirSenha"
            component={RedefinirSenha}
            options={{
              headerShown: false,
              title: "RedefinirSenha",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}

export default AppNavigation;
