import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FavoritesContext } from "../context/FavoritesContext";

const logo =
  "https://olies-ports.s3.us-east-1.amazonaws.com/img/logotipo.png";

export default function ListaDesejosScreen({ navigation }) {
  const { favorites, removeFavorite } = useContext(FavoritesContext);

  const removerItem = (itemId) => {
    Alert.alert(
      "Remover favorito",
      "Tem certeza de que deseja remover este produto da lista de desejos?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => removeFavorite(itemId),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header sempre visível */}
      <View style={styles.headerContainer}>
        <Text style={styles.titulo}>Lista de Desejos</Text>
        <Image source={{ uri: logo }} style={styles.logo} />
      </View>

      <View style={styles.shadowLine}></View>

      {favorites.length === 0 ? (
        <View style={styles.containerVazio}>
          <Text style={styles.textoVazio}>Sua lista de desejos está vazia.</Text>
        </View>
      ) : (
        <>
          <Text style={styles.quantidade}>{favorites.length} item(s)</Text>

          {favorites.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={item.imagemSource} style={styles.imagemProduto} />
              <View style={styles.detalhes}>
                <View style={styles.topoDetalhes}>
                  <Text style={styles.preco}>R$ {item.preco}</Text>
                  <View style={styles.icones}>
                    <TouchableOpacity onPress={() => removerItem(item.id)}>
                      <Ionicons name="heart" size={20} color="#052242" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.nomeProduto}>{item.nome}</Text>
                <Text style={styles.descricao}>
                  Cor: {item.cor}
                </Text>

                <TouchableOpacity
                  style={styles.botaoCarrinho}
                  onPress={() => navigation.navigate("Carrinho", { newItem: item })}
                >
                  <Text style={styles.textoBotao}>Adicionar ao Carrinho</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3ECE2", paddingTop: 40 },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 92,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#052242",
    marginBottom: 12,
  },
  logo: { width: 77, height: 40, marginLeft: 10 },
  shadowLine: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    borderBottomWidth: 0.8,
    marginBottom: 20,
    borderBottomColor: "#00000025",
  },
  containerVazio: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3ECE2",
    paddingVertical: 50,
  },
  textoVazio: {
    fontSize: 16,
    color: "#555",
  },
  quantidade: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#052242",
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    elevation: 3,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  imagemProduto: { width: 90, height: 100, resizeMode: "contain", marginRight: 10 },
  detalhes: { flex: 1, justifyContent: "space-between" },
  topoDetalhes: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  preco: { fontWeight: "bold", fontSize: 16 },
  icones: { flexDirection: "row", alignItems: "center" },
  nomeProduto: { fontWeight: "bold", marginTop: 5 },
  descricao: { color: "#777", marginVertical: 4 },
  botaoCarrinho: {
    borderWidth: 1,
    borderColor: "#052242",
    borderRadius: 5,
    paddingVertical: 6,
    alignItems: "center",
    marginTop: 8,
  },
  textoBotao: { color: "#052242", fontWeight: "bold" },
});
