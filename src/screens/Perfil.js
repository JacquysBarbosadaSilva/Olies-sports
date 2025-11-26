import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native"; // Adicionado
import dynamoDB from "../../awsConfig";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import AsyncStorage from "@react-native-async-storage/async-storage";
import bcrypt from "react-native-bcrypt";
import { v4 as uuid } from "uuid";

export default function PerfilScreen({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");

  // Estados para cadastro de novo usuário
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novoTelefone, setNovoTelefone] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [novoTipo, setNovoTipo] = useState("cliente");
  const [salvandoNovoUsuario, setSalvandoNovoUsuario] = useState(false);

  // 🔍 Verifica usuário logado + carrega dados do DynamoDB
  const verificarUsuario = useCallback(async () => {
    try {
      setCarregando(true); // Adicionado para resetar carregando
      const usuarioSalvo = await AsyncStorage.getItem("usuarioLogado");
      console.log("Valor bruto no AsyncStorage:", usuarioSalvo);

      if (!usuarioSalvo) {
        setUsuario(null);
        setCarregando(false);
        return;
      }

      const usuarioObj = JSON.parse(usuarioSalvo);

      console.log("Objeto após JSON.parse:", usuarioObj);
      console.log("ID recuperado:", usuarioObj.id);

      const result = await dynamoDB.send(
        new GetCommand({
          TableName: "users-olies-sports",
          Key: {
            id: String(usuarioObj.id),
          },
        })
      );

      console.log("RESPOSTA DO DYNAMODB:", result);

      if (result.Item) {
        setUsuario(result.Item);
        setTelefone(result.Item.telefone || "");
        setEndereco(result.Item.endereco || "");
        setCidade(result.Item.cidade || "");
        setUf(result.Item.uf || "");

        Alert.alert(
          "Bem-vindo(a)!",
          `Olá, ${result.Item.nome}! Aqui você pode editar suas informações.`,
          [{ text: "Ok", style: "default" }]
        );
      } else {
        console.log("Usuário NÃO encontrado no DynamoDB");
        setUsuario(null);
      }
    } catch (error) {
      console.log("Erro ao buscar usuário:", error);
      setUsuario(null);
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      verificarUsuario();
    }, [verificarUsuario])
  );

  // 📝 Função para cadastrar novo usuário
  const cadastrarNovoUsuario = async () => {
    try {
      // Validações
      if (!novoNome.trim()) {
        Alert.alert("Erro", "Digite o nome do usuário");
        return;
      }
      if (!novoEmail.trim() || !novoEmail.includes("@")) {
        Alert.alert("Erro", "Digite um email válido");
        return;
      }
      if (!novaSenha || novaSenha.length < 6) {
        Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres");
        return;
      }

      setSalvandoNovoUsuario(true);

      // Gerar hash da senha
      const senhaHash = bcrypt.hashSync(novaSenha, 10);
      const novoId = uuid();
      const agora = new Date().toISOString();

      // Criar objeto do novo usuário
      const novoUsuario = {
        id: novoId,
        nome: novoNome.trim(),
        email: novoEmail.toLowerCase().trim(),
        telefone: novoTelefone.trim() || "",
        senhaHash: senhaHash,
        tipo: novoTipo,
        criadoEm: agora,
        atualizadoEm: agora,
      };

      // Salvar no DynamoDB
      await dynamoDB.send(
        new PutCommand({
          TableName: "users-olies-sports",
          Item: novoUsuario,
        })
      );

      Alert.alert(
        "Sucesso!",
        `Usuário ${novoNome} cadastrado com sucesso como ${novoTipo}.`
      );

      // Limpar campos
      setNovoNome("");
      setNovoEmail("");
      setNovoTelefone("");
      setNovaSenha("");
      setNovoTipo("cliente");
      setMostrarCadastro(false);
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      Alert.alert("Erro", "Falha ao cadastrar usuário: " + error.message);
    } finally {
      setSalvandoNovoUsuario(false);
    }
  };

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#001f3f" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

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
          Você ainda não possui uma conta.{"\n"}Faça login ou crie uma conta.
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

  // ✔ Usuário encontrado → mostrar perfil
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
          <Text style={styles.tipoUsuario}>
            Tipo: <Text style={styles.tipoBold}>{usuario.tipo}</Text>
          </Text>

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

        {/* 👮 FORMULÁRIO DE CADASTRO - APENAS PARA ADMIN */}
        {usuario.tipo === "admin" && (
          <View style={styles.adminSection}>
            <TouchableOpacity
              style={styles.toggleCadastroButton}
              onPress={() => setMostrarCadastro(!mostrarCadastro)}
            >
              <Ionicons
                name={mostrarCadastro ? "chevron-up" : "chevron-down"}
                size={20}
                color="#001f3f"
              />
              <Text style={styles.toggleCadastroText}>
                {mostrarCadastro ? "Ocultar" : "Cadastrar Novo Usuário"}
              </Text>
            </TouchableOpacity>

            {mostrarCadastro && (
              <View style={styles.cadastroForm}>
                <Text style={styles.formTitle}>Novo Usuário</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Nome completo"
                  value={novoNome}
                  onChangeText={setNovoNome}
                  editable={!salvandoNovoUsuario}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={novoEmail}
                  onChangeText={setNovoEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!salvandoNovoUsuario}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Telefone (opcional)"
                  value={novoTelefone}
                  onChangeText={setNovoTelefone}
                  keyboardType="phone-pad"
                  editable={!salvandoNovoUsuario}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Senha (mínimo 6 caracteres)"
                  value={novaSenha}
                  onChangeText={setNovaSenha}
                  secureTextEntry
                  editable={!salvandoNovoUsuario}
                />

                <Text style={styles.label}>Tipo de usuário:</Text>
                <View style={styles.tipoContainer}>
                  <TouchableOpacity
                    style={[
                      styles.tipoButton,
                      novoTipo === "cliente" && styles.tipoButtonActive,
                    ]}
                    onPress={() => setNovoTipo("cliente")}
                    disabled={salvandoNovoUsuario}
                  >
                    <Text
                      style={[
                        styles.tipoButtonText,
                        novoTipo === "cliente" && styles.tipoButtonTextActive,
                      ]}
                    >
                      Cliente
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.tipoButton,
                      novoTipo === "admin" && styles.tipoButtonActive,
                    ]}
                    onPress={() => setNovoTipo("admin")}
                    disabled={salvandoNovoUsuario}
                  >
                    <Text
                      style={[
                        styles.tipoButtonText,
                        novoTipo === "admin" && styles.tipoButtonTextActive,
                      ]}
                    >
                      Admin
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: "#052242" },
                    salvandoNovoUsuario && { opacity: 0.6 },
                  ]}
                  onPress={cadastrarNovoUsuario}
                  disabled={salvandoNovoUsuario}
                >
                  {salvandoNovoUsuario ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.buttonText}>Cadastrar Usuário</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#B00020", marginTop: 20 }]}
          onPress={() => {
            Alert.alert("Sair da conta?", "Tem certeza que deseja sair?", [
              {
                text: "Cancelar",
                style: "cancel",
              },
              {
                text: "Sim",
                style: "destructive",
                onPress: async () => {
                  await AsyncStorage.clear(); // Limpa todo o AsyncStorage

                  Alert.alert("Desconectado", "Você saiu da sua conta.", [
                    {
                      text: "OK",
                      onPress: () => {
                        navigation.navigate("Tabs", { screen: "Home" });
                      },
                    },
                  ]);
                },
              },
            ]);
          }}
        >
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    marginBottom: 5,
  },
  tipoUsuario: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  tipoBold: {
    fontWeight: "700",
    color: "#001f3f",
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 15,
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
    fontSize: 15,
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

  // 🆕 Estilos do formulário de cadastro
  adminSection: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    elevation: 2,
  },
  toggleCadastroButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 10,
  },
  toggleCadastroText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#001f3f",
  },
  cadastroForm: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#001f3f",
    marginBottom: 15,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 5,
  },
  tipoContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  tipoButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#001f3f",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  tipoButtonActive: {
    backgroundColor: "#001f3f",
  },
  tipoButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#001f3f",
  },
  tipoButtonTextActive: {
    color: "#fff",
  },
});
