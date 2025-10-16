import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";

export default function PerfilScreen({navigation}) {
  const [novoEmail, setNovoEmail] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  const salvarAlteracoes = () => {
    Alert.alert("Sucesso", "Alterações salvas com sucesso!");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Cabeçalho */}
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
            <Image source={require("../assets/icone-caixa.png")} style={styles.menuIcon} />
            <Text style={styles.menuText}>Pedidos</Text>
          </View>

          <View style={styles.menuItem}>
            <Image source={require("../assets/icone-user.png")} style={styles.menuIcon} />
            <Text style={styles.menuText}>Alterar dados pessoais</Text>
          </View>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Enderecos")}>
            <Image source={require("../assets/emoji-casa.png")} style={styles.menuIcon} />
            <Text style={styles.menuText}>Endereços</Text>
          </TouchableOpacity>

        </View>

        {/* Alterar email */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>E-mail</Text>
          <TextInput
            style={styles.inputDisabled}
            value="victorkoba08@gmail.com"
            editable={false}
          />
          <Text style={styles.sectionDica}>O e-mail não pode ser alterado</Text>
          
        </View>

        {/* Alterar senha */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alterar senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Senha atual"
            secureTextEntry
            autoCapitalize="none"
            value={senhaAtual}
            onChangeText={setSenhaAtual}
          />
          <TextInput
            style={styles.input}
            placeholder="Nova senha"
            secureTextEntry
            autoCapitalize="none"
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
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
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
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  menuIcon: {
    width: 20,
    height: 30,
    marginRight: 10,
    resizeMode: "contain",
  },
  menuText: {
    fontSize: 16,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
    sectionDica: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
},
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    fontSize: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    height: 60,
  },
  inputDisabled: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    fontSize: 15,
    marginBottom: 10,
    backgroundColor: "#f2f2f2",
    color: "#999",
    height: 60,

  },
  saveButton: {
  backgroundColor: "#001f3f",
  padding: 12,
  borderRadius: 6,
  alignItems: "center",
  marginTop: 10,
  width: 250,
  alignSelf: "center", 
},

  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  exitButton: {
    backgroundColor: "#F3ECE2",
    borderWidth: 1,
    borderColor: "#999",
    padding: 7,
    borderRadius: 6,
    alignItems: "center",
    width: "50%",
    alignSelf: "center",
    marginTop: 20,
    width:100,
  },
  exitButtonText: {
    fontSize: 15,
    color: "#555",
  },
});
