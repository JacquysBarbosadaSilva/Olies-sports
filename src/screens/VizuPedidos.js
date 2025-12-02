import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const logo = "https://olies-ports.s3.us-east-1.amazonaws.com/img/logotipo.png?..."; 

export default function VerPedidosScreen({navigation}) {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    try {
      const data = await AsyncStorage.getItem("pedidos");
      if (data) {
        setPedidos(JSON.parse(data));
      } else {
        setPedidos([]);
      }
    } catch (error) {
      console.log("Erro ao carregar pedidos:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>

      <Text style={styles.titulo2}>Pedido #{item.id}</Text>
      <Text style={styles.info}>Data: {item.data}</Text>
      <Text style={styles.info}>Pagamento: {item.tipoPagamento}</Text>

      <Text style={styles.subtitulo}>Itens:</Text>

      {item.itens.map((produto, index) => (
        <View key={index} style={styles.itemLinha}>
          <Text style={styles.itemTexto}>
            {produto.name}
          </Text>
          <Text style={styles.quantidade}>Qtd: {produto.quantity}</Text>
        </View>
      ))}

    </View>
  );

  return (
    <SafeAreaView showsHorizontalScrollIndicator={false}
     style={{ flex: 1, backgroundColor: "#F3ECE2" }}>

      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#001f3f" />
        </TouchableOpacity>


        <Text style={styles.titulo}>Meus pedidos</Text>
        <Image source={{ uri: logo }} style={styles.logo} />
      </View>

        <View style={styles.shadowLine}></View>

    <View style={styles.container}>
      {pedidos.length === 0 ? (
        <View style={styles.semPedidos}>
          <Text style={styles.semPedidosTexto}>Você ainda não tem pedidos.</Text>
        </View>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 92,
    paddingHorizontal: 20,
  },
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
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#052242",
    marginLeft: -60,
  },
    titulo2: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#052242",
  },
    logo: { width: 77, height: 40, marginLeft: 10 },
  container: { flex: 1, backgroundColor: '#F3ECE2', padding: 20 },
  header: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    elevation: 2,
  },
  info: { fontSize: 14, color: "#555" },
  subtitulo: {
    fontSize: 16,
    marginTop: 12,
    fontWeight: "bold",
  },
  itemLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  itemTexto: { fontSize: 14 },
  quantidade: { fontSize: 14, color: "#444" },
  semPedidos: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  semPedidosTexto: {
    fontSize: 16,
    color: "#777",
  },
});