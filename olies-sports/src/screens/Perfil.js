import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

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
        
      </View>

      {/* Saudação */}
      <Text style={styles.greeting}>Olá Victor!</Text>

      <View style={styles.menu}>
        <Text style={styles.menuItem}> Pedidos</Text>
        <Text style={styles.menuItem}> Alterar dados pessoais</Text>
        <Text style={styles.menuItem}> Endereços</Text>
      </View>

      
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

      <TouchableOpacity style={styles.saveButton} onPress={salvarAlteracoes}>
        <Text style={styles.saveButtonText}>Salvar alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.exitButton}>
        <Text style={styles.exitButtonText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3ECE2", 
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 15,
  paddingBottom: 10, 
},

  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  logo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#001f3f",
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
    fontSize: 16,
    marginBottom: 12,
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
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 15,
    marginTop:30,
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
  marginTop: 40,
},
  exitButtonText: {
    fontSize: 16,
    color: "#333",
  },
});
