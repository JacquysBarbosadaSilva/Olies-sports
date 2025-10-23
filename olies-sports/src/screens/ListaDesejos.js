import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // ícones do coração, etc.

export default function ListaDesejosScreen({ navigation }) {
  const [favorito, setFavorito] = useState(true); // produto começa favoritado

  const removerItem = () => {
    Alert.alert(
      "Remover item",
      "Tem certeza de que deseja remover este produto da lista de desejos?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Remover",
          onPress: () => setFavorito(false),
          style: "destructive",
        },
      ]
    );
  };

  // Se o favorito for falso, não exibe o produto
  if (!favorito) {
    return (
      <View style={styles.containerVazio}>
        <Text style={styles.textoVazio}>Sua lista de desejos está vazia.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Lista de desejos</Text>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Texto de quantidade */}
      <Text style={styles.quantidade}>1 item</Text>

      {/* Card do produto */}
      <View style={styles.card}>
        <Image
          source={{
            uri: "https://olies-ports.s3.us-east-1.amazonaws.com/img/produto-categoria8.png",
          }}
          style={styles.imagemProduto}
        />

        <View style={styles.detalhes}>
          <View style={styles.topoDetalhes}>
            <Text style={styles.preco}>399,99</Text>

            {/* Ícones de coração e lixeira */}
            <View style={styles.icones}>
              <TouchableOpacity onPress={removerItem}>
                <Ionicons name="trash" size={20} color="#D22" />
              </TouchableOpacity>

              <TouchableOpacity onPress={removerItem}>
                <Ionicons
                  name={favorito ? "heart" : "heart-outline"}
                  size={22}
                  color={favorito ? "#D22" : "#555"}
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.nomeProduto}>Camisa | Arsenal 25/26</Text>
          <Text style={styles.descricao}>Tamanho: L • Quantidade: 1</Text>

          <TouchableOpacity style={styles.botaoCarrinho}>
            <Text style={styles.textoBotao}>Adicionar ao Carrinho</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3ECE2",
    padding: 10,
  },
  containerVazio: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3ECE2",
  },
  textoVazio: {
    fontSize: 16,
    color: "#555",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#052242",
  },
  logo: {
    width: 80,
    height: 40,
  },
  quantidade: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#052242",
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  imagemProduto: {
    width: 90,
    height: 100,
    resizeMode: "contain",
    marginRight: 10,
  },
  detalhes: {
    flex: 1,
    justifyContent: "space-between",
  },
  topoDetalhes: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  preco: {
    fontWeight: "bold",
    fontSize: 16,
  },
  icones: {
    flexDirection: "row",
    alignItems: "center",
  },
  nomeProduto: {
    fontWeight: "bold",
    marginTop: 5,
  },
  descricao: {
    color: "#777",
    marginVertical: 4,
  },
  botaoCarrinho: {
    borderWidth: 1,
    borderColor: "#052242",
    borderRadius: 5,
    paddingVertical: 6,
    alignItems: "center",
  },
  textoBotao: {
    color: "#052242",
    fontWeight: "bold",
  },
});
