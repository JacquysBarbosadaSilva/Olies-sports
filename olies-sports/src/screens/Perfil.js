import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";

export default function PerfilScreen() {
  const [novoEmail, setNovoEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  const salvarAlteracoes = () => {
    alert("Alterações salvas!");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
        <Image source={require("../assets/logotipo.png")} style={styles.logo} />
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        <Text style={styles.greeting}>Olá Victor!</Text>

        {/* Menu */}
        <View style={styles.menu}>
          <View style={styles.menuItem}>
            <Image source={require("../assets/emoji-casa.png")} style={styles.menuIcon} />
            <Text style={styles.menuText}>Pedidos</Text>
          </View>

          <View style={styles.menuItem}>
            <Image source={require("../assets/emoji-casa.png")} style={styles.menuIcon} />
            <Text style={styles.menuText}>Alterar dados pessoais</Text>
          </View>

          <View style={styles.menuItem}>
            <Image source={require("../assets/emoji-casa.png")} style={styles.menuIcon} />
            <Text style={styles.menuText}>Endereços</Text>
          </View>
        </View>

        {/* Alterar email */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alterar email</Text>
          <TextInput
            style={[styles.input, { backgroundColor: "#f2f2f2" }]}
            value="victorkoba08@gmail.com"
            editable={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Novo email"
            value={novoEmail}
            onChangeText={setNovoEmail}
          />
        </View>

        {/* Alterar senha */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alterar senha</Text>
          <TextInput
            style={[styles.input, { backgroundColor: "#f2f2f2" }]}
            secureTextEntry
            value="********"
            editable={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Nova senha"
            secureTextEntry
            value={novaSenha}
            onChangeText={setNovaSenha}
          />
        </View>

        {/* Botões */}
        <TouchableOpacity style={styles.saveButton} onPress={salvarAlteracoes}>
          <Text style={styles.saveButtonText}>Salvar alterações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.exitButton}>
          <Text style={styles.exitButtonText}>Sair</Text>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
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
  greeting: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "500",
  },
  menu: {
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row", 
    alignItems: "center",
    marginBottom: 15,
  },
  menuIcon: {
    width: 40,
    height: 30,
    marginRight: 10,
    resizeMode: "contain",
  },
  menuText: {
    fontSize: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    fontSize: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#001f3f",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 15,
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  exitButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    width: 150,
    alignSelf: "center",
    marginTop: 20,
  },
  exitButtonText: {
    fontSize: 16,
    color: "#333",
  },
});
