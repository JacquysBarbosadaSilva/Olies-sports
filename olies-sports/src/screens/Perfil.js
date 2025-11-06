import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import dynamoDB from "../../awsConfig";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SweetAlert from "react-native-sweet-alert";

export default function PerfilScreen({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");

  // Verifica se o usuário já possui conta
  useEffect(() => {
    const verificarUsuario = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");

        if (!userId) {
          setCarregando(false);
          setUsuario(null);
          return;
        }

        const result = await dynamoDB.send(
          new GetCommand({
            TableName: "usuarios_olies",
            Key: { userId: userId },
          })
        );

        if (result.Item) {
          setUsuario(result.Item);
          setTelefone(result.Item.telefone || "");
          setEndereco(result.Item.endereco || "");
          setCidade(result.Item.cidade || "");
          setUf(result.Item.uf || "");

          // ✅ Exibe o SweetAlert de boas-vindas
          SweetAlert.showAlertWithOptions({
            title: "Bem-vindo(a)!",
            subTitle: `Olá, ${result.Item.nome}! Aqui você pode editar suas informações.`,
            confirmButtonTitle: "Ok",
            confirmButtonColor: "#001f3f",
            style: "success",
          });
        } else {
          setUsuario(null);
        }
      } catch (error) {
        console.error("Erro ao verificar usuário:", error);
        setUsuario(null);
      } finally {
        setCarregando(false);
      }
    };

    verificarUsuario();
  }, []);

  // Tela de carregamento
  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#001f3f" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  // Se o usuário NÃO existir
  if (!usuario) {
    return (
      <SafeAreaView style={styles.noUserContainer}>
        <Image
          source={{
            uri: "https://olies-ports.s3.us-east-1.amazonaws.com/img/logotipo.png",
          }}
          style={styles.logo}
        />
        <Text style={styles.noUserText}>
          Você ainda não possui uma conta.{"\n"}Faça login ou crie uma nova conta.
        </Text>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginText}>Fazer Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("Cadastro")}
        >
          <Text style={styles.registerText}>Criar Conta</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Se o usuário EXISTIR
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Ionicons
            name="arrow-back"
            size={28}
            color="#001f3f"
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.title}>Meu Perfil</Text>
          <Ionicons name="person-circle-outline" size={34} color="#001f3f" />
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.greeting}>Olá, {usuario.nome}!</Text>

          <TextInput
            style={styles.input}
            placeholder="Telefone"
            value={telefone}
            onChangeText={setTelefone}
          />
          <TextInput
            style={styles.input}
            placeholder="Endereço"
            value={endereco}
            onChangeText={setEndereco}
          />
          <TextInput
            style={styles.input}
            placeholder="Cidade"
            value={cidade}
            onChangeText={setCidade}
          />
          <TextInput
            style={styles.input}
            placeholder="UF"
            value={uf}
            onChangeText={setUf}
          />

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 🧱 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3ECE2",
  },
  scroll: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#001f3f",
  },
  profileInfo: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#001f3f",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3ECE2",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#001f3f",
  },
  noUserContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3ECE2",
  },
  logo: {
    width: 120,
    height: 70,
    marginBottom: 20,
  },
  noUserText: {
    fontSize: 17,
    marginBottom: 20,
    textAlign: "center",
    color: "#001f3f",
  },
  loginButton: {
    backgroundColor: "#001f3f",
    padding: 12,
    borderRadius: 8,
    width: 200,
    alignItems: "center",
    marginBottom: 10,
  },
  loginText: {
    color: "#fff",
    fontWeight: "bold",
  },
  registerButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#001f3f",
    padding: 12,
    borderRadius: 8,
    width: 200,
    alignItems: "center",
  },
  registerText: {
    color: "#001f3f",
    fontWeight: "bold",
  },
});
