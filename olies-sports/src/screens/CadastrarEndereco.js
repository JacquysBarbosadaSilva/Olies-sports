import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PerfilScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#001f3f" />
        </TouchableOpacity>
        <Text style={styles.title}>Cadastrar Endereço</Text>
        <Image source={require("../assets/logotipo.png")} style={styles.logo} />
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        <View style={styles.addressBox}>
          <Text style={styles.addressTitle}>
            Rua Arthur Benedito de Oliveira Porto, 25
          </Text>
          <Text style={styles.addressDetails}>
            Jardim Rafael - CEP 12288-460 - Caçapava - SP
          </Text>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("EditarEndereco")}
          >
            <Ionicons name="pencil-outline" size={18} color="#001f3f" style={{ marginRight: 6 }} />
            <Text style={styles.editButtonText}>Editar Endereço</Text>
          </TouchableOpacity>
        </View>

       <TouchableOpacity
          style={styles.saveButton}
          onPress={() => navigation.navigate("CadastrarEndereco")}
        >
          <Text style={styles.saveButtonText}>Cadastrar Novo Endereço</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3ECE2",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F3ECE2",
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#001f3f",
    marginRight:100,
  },
  logo: {
    width: 70,
    height: 60,
    resizeMode: "contain",
  },
  content: {
    padding: 20,
  },
  addressBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#001f3f",
    marginBottom: 5,
  },
  addressDetails: {
    fontSize: 14,
    color: "#555",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 12,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  editButtonText: {
    color: "#001f3f",
    fontWeight: "bold",
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: "#001f3f",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    width: 250,
    alignSelf: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
