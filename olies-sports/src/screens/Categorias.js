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
            <Image source={require("../assets/logotipo.png")} style={styles.logo} />
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
