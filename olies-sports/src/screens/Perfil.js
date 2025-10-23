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
import { CommonActions } from "@react-navigation/native";

const logoUrl =
  "https://olies-ports.s3.us-east-1.amazonaws.com/img/logotipo.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZYPPXAY4RCJUVETB%2F20251022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251022T213109Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEH4aCXVzLWVhc3QtMSJHMEUCIF5r9n3SlIlwrWIih6WGQBbM0tGPsmu0u7PQwsqhz%2BPlAiEAzLnLGZ5HWc0lLBpQCkn8Ylt59i%2BhXca%2BCmKpOjpOQeIqgwMINxAAGgw2NzEwNTQ0OTczMzciDDFO1pKJNryxXbCVoyrgAmMmOaS%2BflOGH6QAoaH6tzhwkvCfOw1wekhWdxd6GUAlmfhHfXztqglXHvi2%2FQTpdwpgBqVFOX54Jr9tA%2FG%2BhCyO9tJQWvEGsSpNrutHIdNSftmozjutyzZYH6KLii%2BZaAP%2BCN3lYeN%2FB%2FJLvosSMsCPw7pxl6xzcYL4d6GTtqsKlK6Kcv%2BDODZWmZe3jPJKj1%2FjO%2B203fQN9Dtx1ggorUTAuKfTXzaCnYvkpRPCJ2F6052rKZnjND%2FGmyvflyFr7JnTgKF3HVI164zMpxtFN%2BspzP5UBHMui0wtJR7XtVQbr8rytz4f6DYoDmL4RVxX0uGr2%2BCK1b6tGzOiEdLBsgZ21Z0e4%2Fl%2FjG%2FuxejOUZfQwhJpHnY5kbMu1oyYUKvuKTsyAgktsLbNkMG1WuopiJXaQKj%2Fcl%2BH0x0KXYz3q8mttq8QUpqOmh9rnkc6DxEMGmIWHzB9rLtRvhN7uc9PWXQwgNzkxwY6hwKiJY9COGoIhCXtEd48aip89g9td2xbtd54Ojr2N4wznAW2oK1ufZ9OTiMIo8tuOL%2BUhJigtU3KxkJugU2JVjLAnDctb6AImhjY4ULdlqxP35%2FI3LHaM1t5Wiw7ltZ3laOJ0FsSDiNt693oroD3pSBxs%2B4R01ye3Ra62%2B7w7wkJxGLcPLOHraDS36OLrSQh4jOAjiOey%2BrKt7t6QaiJgFu4qRVWLA23wQzhYTMRNpTzaTzU26pewVPuRhE5y7X82XqNiNdum8vVwd2KO6ZHlOWxKDqhiOV4PnOoNYGuDj99HpOK6hE8UIThBdCQAshDTd6VKPUYsMEc%2FQZQWUvQHDSYA31Mc7nikQ%3D%3D&X-Amz-Signature=11eb26d8eb399b6d2f91c9721a92839350d8a784acefe0d988a547de57c03b6f&X-Amz-SignedHeaders=host&response-content-disposition=inline";

export default function PerfilScreen({ navigation }) {
  const [novoEmail, setNovoEmail] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  const salvarAlteracoes = () => {
    Alert.alert("Sucesso", "Alterações salvas com sucesso!");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Cabeçalho */}
      <View style={[styles.headerContainer]}>
        <Text style={styles.titulo}>Perfil</Text>
        <Image source={{ uri: logoUrl }} style={styles.logo} />
      </View>
      <View style={styles.shadowLine}></View>

      {/* Conteúdo */}
      <View style={styles.content}>
        <Text style={styles.greeting}>Olá Victor!</Text>

        {/* Menu */}
        <View style={styles.menu}>
          <View style={styles.menuItem}>
            <Image
              source={require("../assets/icone-caixa.png")}
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Pedidos</Text>
          </View>

          <View style={styles.menuItem}>
            <Image
              source={require("../assets/icone-user.png")}
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Alterar dados pessoais</Text>
          </View>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("Enderecos")}
          >
            <Image
              source={require("../assets/emoji-casa.png")}
              style={styles.menuIcon}
            />
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

        <TouchableOpacity
          style={styles.exitButton}
          onPress={() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "Login" }],
              })
            );
          }}
        >
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
    paddingTop: 40,
  },
  scrollContent: {
    paddingBottom: 40,
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

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#052242",
    marginBottom: 12,
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
    width: 100,
  },
  exitButtonText: {
    fontSize: 15,
    width: "100%",
    textAlign: "center",
    color: "#555",
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
});
