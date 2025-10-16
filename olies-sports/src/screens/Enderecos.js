import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";

export default function PerfilScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
        <Image source={require("../assets/logotipo.png")} style={styles.logo} />
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Endereços</Text>

        <View style={styles.addressBox}>
          <Text style={styles.addressText}>
            Rua Arthur Benedito de Oliveira Porto, 25
          </Text>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => navigation.navigate("Enderecos")}
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
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F3ECE2",
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  logo: {
    width: 70,
    height: 60,
    resizeMode: "contain",
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  addressBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 15,
    marginBottom: 20,
  },
  addressText: {
    fontSize: 15,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#001f3f",
    padding: 12,
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
