import React from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // ícones do Expo (ou react-native-vector-icons)
import { useNavigation } from "@react-navigation/native";

const categorias = [
  { id: "1", nome: "Masculino", imagem: require("../assets/masculino.png") },
  { id: "2", nome: "Feminino", imagem: require("../assets/feminino.png") },
  { id: "3", nome: "Infantil", imagem: require("../assets/infantil.png") },
  { id: "4", nome: "Esportes", imagem: require("../assets/esportes.png") },
  { id: "5", nome: "Calçados", imagem: require("../assets/calcados.png") },
  { id: "6", nome: "Roupas", imagem: require("../assets/roupas.png") },
  { id: "7", nome: "Acessórios", imagem: require("../assets/acessorios.png") },
];

const logoUrl = "https://olies-ports.s3.us-east-1.amazonaws.com/img/logotipo.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZYPPXAY4RCJUVETB%2F20251022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251022T213109Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEH4aCXVzLWVhc3QtMSJHMEUCIF5r9n3SlIlwrWIih6WGQBbM0tGPsmu0u7PQwsqhz%2BPlAiEAzLnLGZ5HWc0lLBpQCkn8Ylt59i%2BhXca%2BCmKpOjpOQeIqgwMINxAAGgw2NzEwNTQ0OTczMzciDDFO1pKJNryxXbCVoyrgAmMmOaS%2BflOGH6QAoaH6tzhwkvCfOw1wekhWdxd6GUAlmfhHfXztqglXHvi2%2FQTpdwpgBqVFOX54Jr9tA%2FG%2BhCyO9tJQWvEGsSpNrutHIdNSftmozjutyzZYH6KLii%2BZaAP%2BCN3lYeN%2FB%2FJLvosSMsCPw7pxl6xzcYL4d6GTtqsKlK6Kcv%2BDODZWmZe3jPJKj1%2FjO%2B203fQN9Dtx1ggorUTAuKfTXzaCnYvkpRPCJ2F6052rKZnjND%2FGmyvflyFr7JnTgKF3HVI164zMpxtFN%2BspzP5UBHMui0wtJR7XtVQbr8rytz4f6DYoDmL4RVxX0uGr2%2BCK1b6tGzOiEdLBsgZ21Z0e4%2Fl%2FjG%2FuxejOUZfQwhJpHnY5kbMu1oyYUKvuKTsyAgktsLbNkMG1WuopiJXaQKj%2Fcl%2BH0x0KXYz3q8mttq8QUpqOmh9rnkc6DxEMGmIWHzB9rLtRvhN7uc9PWXQwgNzkxwY6hwKiJY9COGoIhCXtEd48aip89g9td2xbtd54Ojr2N4wznAW2oK1ufZ9OTiMIo8tuOL%2BUhJigtU3KxkJugU2JVjLAnDctb6AImhjY4ULdlqxP35%2FI3LHaM1t5Wiw7ltZ3laOJ0FsSDiNt693oroD3pSBxs%2B4R01ye3Ra62%2B7w7wkJxGLcPLOHraDS36OLrSQh4jOAjiOey%2BrKt7t6QaiJgFu4qRVWLA23wQzhYTMRNpTzaTzU26pewVPuRhE5y7X82XqNiNdum8vVwd2KO6ZHlOWxKDqhiOV4PnOoNYGuDj99HpOK6hE8UIThBdCQAshDTd6VKPUYsMEc%2FQZQWUvQHDSYA31Mc7nikQ%3D%3D&X-Amz-Signature=11eb26d8eb399b6d2f91c9721a92839350d8a784acefe0d988a547de57c03b6f&X-Amz-SignedHeaders=host&response-content-disposition=inline";

export default function Categorias() {
    const navigation = useNavigation();
  const renderItem = ({ item }) => (
    <View style={{ paddingHorizontal: 20 }}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Produtos", { categoria: item.nome })}>
        <Image source={item.imagem} style={styles.imagem} resizeMode="contain" />
        <Text style={styles.texto}>{item.nome}</Text>
        <Ionicons name="chevron-forward" size={20} color="#052242" />
        </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
        <View style={[styles.headerContainer]}>
            <Text style={styles.titulo}>Categorias</Text>
            <Image source={{uri: logoUrl}} style={styles.logo} />
        </View>

        <View style = {[styles.shadowLine]}></View>
      
      <FlatList
        data={categorias}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5efe5",
        paddingTop: 40,

    },
    titulo: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#052242",
        marginBottom: 12,
    },
    lista: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    imagem: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    texto: {
        flex: 1,
        fontSize: 16,
        color: "#052242",
        fontWeight: "600",
    },

    logo: {
        width: 77,
        height: 40,
        marginLeft: 10,
    },

    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",    
        alignItems: "center",
        height: 92,
        paddingHorizontal: 20,
    },
    
    shadowLine:{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
        borderBottomWidth: 0.8,
        marginBottom: 20,
        borderBottomColor: "#00000025",
    }

});
