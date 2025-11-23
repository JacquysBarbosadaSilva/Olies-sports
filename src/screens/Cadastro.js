// TelaCadastro.js
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
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import bcrypt from "bcryptjs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AWS from "../../awsConfig";

const logo = "https://olies-ports.s3.us-east-1.amazonaws.com/img/logotipo.png";

export default function TelaCadastro() {
  const navigation = useNavigation();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  const [dados, setDados] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
  });

  const handleChange = (campo, valor) => {
    setDados((prev) => ({ ...prev, [campo]: valor }));
  };

  // Validar email
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Validar telefone (apenas números)
  const validarTelefone = (telefone) => {
    const regex = /^[0-9]{10,11}$/;
    return regex.test(telefone.replace(/\D/g, ""));
  };

  // Cadastrar e salvar no AsyncStorage
  const handleCadastro = async () => {
    try {
      // Validações
      if (!dados.nome.trim()) {
        Alert.alert("Atenção", "Preencha o campo Nome.");
        return;
      }

      if (!dados.email.trim()) {
        Alert.alert("Atenção", "Preencha o campo Email.");
        return;
      }

      if (!validarEmail(dados.email)) {
        Alert.alert("Atenção", "Email inválido. Verifique o formato.");
        return;
      }

      if (!dados.telefone.trim()) {
        Alert.alert("Atenção", "Preencha o campo Telefone.");
        return;
      }

      if (!validarTelefone(dados.telefone)) {
        Alert.alert("Atenção", "Telefone inválido. Use 10 ou 11 dígitos.");
        return;
      }

      if (!dados.senha.trim()) {
        Alert.alert("Atenção", "Preencha o campo Senha.");
        return;
      }

      if (dados.senha.length < 6) {
        Alert.alert("Atenção", "Senha deve ter no mínimo 6 caracteres.");
        return;
      }

      setLoading(true);

      // Criar objeto do usuário
      // 1. Verificar se o e-mail já existe (Boa prática)
      // Usamos ScanCommand ou QueryCommand (melhor se email for GSI/Index)
      const emailCheckParams = {
        TableName: "users-olies-sports",
        FilterExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": { S: dados.email.toLowerCase().trim() },
        },
      };

      const existingUsers = await AWS.dynamoDB.send(
        new ScanCommand(emailCheckParams)
      );

      if (existingUsers.Count > 0) {
        setLoading(false);
        Alert.alert("Erro", "Este e-mail já está cadastrado.");
        return;
      }

      // 2. Criptografar a Senha (ESSENCIAL para segurança)
      // Assumimos que você tem o bcrypt ou uma forma segura de hash
      const hashedPassword = await bcrypt.hash(dados.senha, 10);


      // 3. Preparar o Item para o DynamoDB
      const novoUsuarioDB = {
        id: { S: Date.now().toString() }, // ID como número (N) - use o mesmo tipo do seu GerenciarUsuariosScreen
        nome: { S: dados.nome.trim() },
        email: { S: dados.email.toLowerCase().trim() },
        telefone: { S: dados.telefone.replace(/\D/g, "") },
        senhaHash: { S: hashedPassword }, 
        tipo: { S: "cliente" },
        atualizadoEm: { S: new Date().toISOString() },
        criadoEm: { S: new Date().toISOString() },
      };

      const putItemParams = {
        TableName: "users-olies-sports",
        Item: novoUsuarioDB,
      };

      // 4. ✅ SALVAR NO DYNAMODB
      await AWS.dynamoDB.send(new PutItemCommand(putItemParams));

      // 5. ✅ SALVAR NO ASYNCSTORAGE (após sucesso no DB)
      // Criar objeto do usuário para salvar a sessão (sem a senha, apenas dados de login)
      const usuarioLogado = {
        id: novoUsuarioDB.id.N,
        nome: novoUsuarioDB.nome.S,
        email: novoUsuarioDB.email.S,
        tipo: novoUsuarioDB.tipo.S,
      };

      await AsyncStorage.setItem(
        "usuarioLogado",
        JSON.stringify(usuarioLogado)
      );

      setLoading(false);

      Alert.alert("Sucesso!", "Cadastro realizado com sucesso!", [
        {
          text: "Ok",
          onPress: () => {
            navigation.navigate("Login");
          },
        },
      ]);

      // Limpar form
      setDados({ nome: "", email: "", telefone: "", senha: "" });
    } catch (error) {
      setLoading(false);
      console.error("Erro ao cadastrar no DynamoDB:", error);
      Alert.alert(
        "Erro",
        "Erro ao realizar cadastro. Verifique sua conexão e tente novamente!"
      );
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SafeAreaView style={{ backgroundColor: "#F3ECE2" }}>
        <View style={styles.header}>
          <Image
            source={{ uri: logo }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.criarConta}>Criar uma conta</Text>
        </View>

        {/* Seção: Informações da conta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações da conta</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            placeholderTextColor="#999"
            value={dados.nome}
            onChangeText={(v) => handleChange("nome", v)}
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            placeholderTextColor="#999"
            value={dados.email}
            onChangeText={(v) => handleChange("email", v)}
            autoCapitalize="none"
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Telefone (10 ou 11 dígitos)"
            keyboardType="phone-pad"
            placeholderTextColor="#999"
            value={dados.telefone}
            onChangeText={(v) => handleChange("telefone", v)}
            editable={!loading}
          />

          <View style={styles.senhaContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Senha"
              placeholderTextColor="#999"
              secureTextEntry={!mostrarSenha}
              value={dados.senha}
              onChangeText={(v) => handleChange("senha", v)}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setMostrarSenha(!mostrarSenha)}
              style={styles.olhoIcone}
              disabled={loading}
            >
              <Ionicons
                name={mostrarSenha ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#555"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Botão Cadastrar */}
        <TouchableOpacity
          style={[styles.botao, loading && styles.botaoDisabled]}
          onPress={handleCadastro}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Text style={styles.textoBotao}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        {/* Link para Login */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Já tem uma conta? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            disabled={loading}
          >
            <Text style={styles.loginLink}>Faça login</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 50 }} />
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3ECE2",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 35,
  },
  logo: {
    width: 150,
    height: 150,
  },
  criarConta: {
    fontSize: 32,
    fontWeight: "700",
    color: "#052242",
    textAlign: "center",
    marginTop: 15,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#052242",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#052242",
    marginBottom: 15,
  },
  senhaContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  olhoIcone: {
    position: "absolute",
    right: 15,
    padding: 10,
  },
  botao: {
    backgroundColor: "#052242",
    height: 55,
    width: "100%",
    justifyContent: "center",
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  botaoDisabled: {
    opacity: 0.6,
  },
  textoBotao: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 15,
    color: "#052242",
  },
  loginLink: {
    fontSize: 15,
    color: "#052242",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
