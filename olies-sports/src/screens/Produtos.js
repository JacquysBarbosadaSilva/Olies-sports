import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  TextInput,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const produtos = [
  // Masculino
  { id: "1", nome: "Jordan Zion 4", preco: 1199.9, desconto: "10% off", imagem: require("../assets/img/produto-categoria1.png"), categoria: "Masculino" },
  { id: "2", nome: "Tênis Nike Flex Experience Run 12", preco: 1079.9, desconto: "10% off", imagem: require("../assets/img/produto-categoria2.png"), categoria: "Masculino" },
  { id: "3", nome: "Tênis Nike Air Jordan 1 Low SE", preco: 1199.9, desconto: "10% off", imagem: require("../assets/img/produto-categoria3.png"), categoria: "Masculino" },
  { id: "4", nome: "Calça Jordan Essential Fleece", preco: 349.9, desconto: "25% off", imagem: require("../assets/img/produto-categoria4.png"), categoria: "Masculino" },

  // Feminino
  { id: "5", nome: "Tênis Nike Killshot 2", preco: 599.9, desconto: "10% off", imagem: require("../assets/img/produto-categoria5.png"), categoria: "Feminino" },
  { id: "6", nome: "Tênis Superstar XLG", preco: 599.99, desconto: "", imagem: require("../assets/img/produto-categoria7.png"), categoria: "Feminino" },
  { id: "7", nome: "Tênis Nike Air Force 1 '07", preco: 799.9, desconto: "", imagem: require("../assets/img/produto-categoria6.png"), categoria: "Feminino" },

  // Unissex
  { id: "8", nome: "Tênis Nike Air Force 1 '07", preco: 479.9, desconto: "10% off", imagem: require("../assets/img/produto-categoria8.png"), categoria: "Unissex" },
];

export default function Produtos() {
  const navigation = useNavigation();
  const route = useRoute();
  const { categoria } = route.params;

  const [filtroAberto, setFiltroAberto] = useState(false);
  const [filtroSelecionado, setFiltroSelecionado] = useState("Todos");
  const [precoMin, setPrecoMin] = useState("");
  const [precoMax, setPrecoMax] = useState("");

  // Filtragem base pela categoria (inclui Unissex para masculino e feminino)
  const filtrados = produtos.filter((p) => {
    if (categoria === "Masculino" || categoria === "Feminino") {
      return p.categoria === categoria || p.categoria === "Unissex";
    }
    return p.categoria === categoria;
  });

  // Aplicar filtros adicionais
  const filtradosComFiltro = filtrados.filter((p) => {
    const precoValido =
      (!precoMin || p.preco >= parseFloat(precoMin)) &&
      (!precoMax || p.preco <= parseFloat(precoMax));

    if (filtroSelecionado === "Todos") return precoValido;
    if (filtroSelecionado === "Promocao") return p.desconto !== "" && precoValido;
    return precoValido;
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={item.imagem} style={styles.imagem} resizeMode="contain" />
      <View style={styles.info}>
        <Text style={styles.preco}>R$ {item.preco.toFixed(2)}</Text>
        {item.desconto ? <Text style={styles.desconto}>{item.desconto}</Text> : null}
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.categoria}>{item.categoria}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header com botão de filtro */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setFiltroAberto(true)} style={styles.filtroBotao}>
          <Ionicons name="filter-outline" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtradosComFiltro}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.lista}
        columnWrapperStyle={styles.coluna}
      />

      {/* Modal de filtro */}
      <Modal visible={filtroAberto} transparent animationType="slide">
        <TouchableOpacity style={styles.overlay} onPress={() => setFiltroAberto(false)} activeOpacity={1}>
          <Animated.View style={styles.filtroContainer}>
            <Text style={styles.filtroTitulo}>Filtrar por:</Text>

            <TouchableOpacity
              style={[styles.opcao, filtroSelecionado === "Todos" && styles.opcaoAtiva]}
              onPress={() => setFiltroSelecionado("Todos")}
            >
              <Text style={styles.textoOpcao}>Todos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.opcao, filtroSelecionado === "Promocao" && styles.opcaoAtiva]}
              onPress={() => setFiltroSelecionado("Promocao")}
            >
              <Text style={styles.textoOpcao}>Em promoção</Text>
            </TouchableOpacity>

            {/* Filtro por preço */}
            <View style={{ marginTop: 20 }}>
              <Text style={styles.filtroSubtitulo}>Preço mínimo:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Ex: 100"
                value={precoMin}
                onChangeText={setPrecoMin}
              />
              <Text style={styles.filtroSubtitulo}>Preço máximo:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Ex: 1000"
                value={precoMax}
                onChangeText={setPrecoMax}
              />
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5efe5" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  titulo: { fontSize: 22, fontWeight: "bold", color: "#052242" },

  filtroBotao: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  lista: {
    paddingHorizontal: 10,
    paddingBottom: 40,
    paddingTop: 20,
  },

  coluna: {
    justifyContent: "space-between",
  },

  card: {
    backgroundColor: "#fff",
    flex: 0.47,
    marginBottom: 40,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  imagem: {
    width: "100%",
    height: 140,
    marginBottom: 8,
  },

  info: { paddingHorizontal: 4 },
  preco: { fontWeight: "bold", fontSize: 14, color: "#000" },
  desconto: { color: "#009900", fontWeight: "600", fontSize: 13 },
  nome: { color: "#333", fontSize: 13, marginTop: 4, fontWeight: "500" },
  categoria: { color: "#777", fontSize: 12, marginTop: 2 },

  // Modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  filtroContainer: {
    backgroundColor: "#fff",
    width: width * 0.7,
    height: "100%",
    position: "absolute",
    right: 0,
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  filtroTitulo: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  filtroSubtitulo: { fontSize: 14, fontWeight: "600", marginTop: 10, marginBottom: 5 },

  opcao: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  opcaoAtiva: { backgroundColor: "#e6f3ff" },

  textoOpcao: { fontSize: 16, color: "#052242" },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
  },
});
