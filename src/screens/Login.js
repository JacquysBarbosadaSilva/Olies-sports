import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import bcrypt from "react-native-bcrypt";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import * as AWS from "../../awsConfig";

const LOGO_URL =
  "https://olies-ports.s3.us-east-1.amazonaws.com/img/logotipo.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZYPPXAY4RCJUVETB%2F20251022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251022T213109Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEH4aCXVzLWVhc3QtMSJHMEUCIF5r9n3SlIlwrWIih6WGQBbM0tGPsmu0u7PQwsqhz%2BPlAiEAzLnLGZ5HWc0lLBpQCkn8Ylt59i%2BhXca%2BCmKpOjpOQeIqgwMINxAAGgw2NzEwNTQ0OTczMzciDDFO1pKJNryxXbCVoyrgAmMmOaS%2BflOGH6QAoaH6tzhwkvCfOw1wekhWdxd6GUAlmfhHfXztqglXHvi2%2FQTpdwpgBqVFOX54Jr9tA%2FG%2BhCyO9tJQWvEGsSpNrutHIdNSftmozjutyzZYH6KLii%2BZaAP%2BCN3lYeN%2FB%2FJLvosSMsCPw7pxl6xzcYL4d6GTtqsKlK6Kcv%2BDODZWmZe3jPJKj1%2FjO%2B203fQN9Dtx1ggorUTAuKfTXzaCnYvkpRPCJ2F6052rKZnjND%2FGmyvflyFr7JnTgKF3HVI164zMpxtFN%2BspzP5UBHMui0wtJR7XtVQbr8rytz4f6DYoDmL4RVxX0uGr2%2BCK1b6tGzOiEdLBsgZ21Z0e4%2Fl%2FjG%2FuxejOUZfQwhJpHnY5kbMu1oyYUKvuKTsyAgktsLbNkMG1WuopiJXaQKj%2Fcl%2BH0x0KXYz3q8mttq8QUpqOmh9rnkc6DxEMGmIWHzB9rLtRvhN7uc9PWXQwgNzkxwY6hwKiJY9COGoIhCXtEd48aip89g9td2xbtd54Ojr2N4wznAW2oK1ufZ9OTiMIo8tuOL%2BUhJigtU3KxkJugU2JVjLAnDctb6AImhjY4ULdlqxP35%2FI3LHaM1t5Wiw7ltZ3laOJ0FsSDiNt693oroD3pSBxs%2B4R01ye3Ra62%2B7w7wkJxGLcPLOHraDS36OLrSQh4jOAjiOey%2BrKt7t6QaiJgFu4qRVWLA23wQzhYTMRNpTzaTzU26pewVPuRhE5y7X82XqNiNdum8vVwd2KO6ZHlOWxKDqhiOV4PnOoNYGuDj99HpOK6hE8UIThBdCQAshDTd6VKPUYsMEc%2FQZQWUvQHDSYA31Mc7nikQ%3D%3D&X-Amz-Signature=11eb26d8eb399b6d2f91c9721a92839350d8a784acefe0d988a547de57c03b6f&X-Amz-SignedHeaders=host&response-content-disposition=inline";

const COLORS = {
  primaryDark: "#052242",
  appBg: "#F3ECE2",
  inputBg: "#EEEEEE",
  inputColor: "#9D9D9D",
};

const Login = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Erro", "Preencha todos os campos!");
        return;
      }

      setIsLoading(true);

      // 🔍 1. Procurar usuário pelo email no DynamoDB
      const command = new ScanCommand({
        TableName: "users-olies-sports", // <-- ALTERAR DEPOIS PARA O NOME CERTO
        FilterExpression: "#em = :email",
        ExpressionAttributeNames: { "#em": "email" },
        ExpressionAttributeValues: {
          ":email": { S: email.toLowerCase() },
        },
      });

      const result = await AWS.dynamoDB.send(command);

      if (!result.Items || result.Items.length === 0) {
        Alert.alert("Erro", "Usuário não encontrado!");
        setIsLoading(false);
        return;
      }

      // Converte o item para objeto normal
      const usuario = unmarshall(result.Items[0]);

      // ⚠ 2. Comparar senha digitada com o hash
      const senhaConfere = bcrypt.compareSync(password, usuario.senhaHash);

      if (!senhaConfere) {
        Alert.alert("Erro", "Senha incorreta!");
        setIsLoading(false);
        return;
      }

      // 💾 3. Salvar login localmente
      await AsyncStorage.setItem("usuarioLogado", JSON.stringify(usuario));

      Alert.alert("Sucesso", "Login efetuado com sucesso!");
      navigation.navigate("Tabs", { screen: "HomeScreen" });
    } catch (error) {
      console.log("Erro no login:", error);
      Alert.alert("Erro", "Falha ao tentar conectar.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.appBg }}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: COLORS.appBg }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.card}>
              <View style={styles.header}>
                <Image
                  source={{ uri: LOGO_URL }}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              <Text style={[styles.subtitle, styles.fontKantumruySemiBold]}>
                Entre na sua conta
              </Text>

              <View style={styles.form}>
                <View>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="seu@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    editable={!isLoading}
                    placeholderTextColor="#CCCCCC"
                  />
                </View>

                <View>
                  <Text style={styles.label}>Senha</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={[styles.input, { paddingRight: 50 }]}
                      placeholder="Sua senha"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                      editable={!isLoading}
                      placeholderTextColor="#CCCCCC"
                    />
                    <TouchableOpacity
                      onPress={togglePasswordVisibility}
                      style={styles.passwordToggle}
                      disabled={isLoading}
                    >
                      <Feather
                        name={showPassword ? "eye" : "eye-off"}
                        size={20}
                        color={COLORS.primaryDark}
                        style={{ opacity: 0.6 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.linksContainer}>
                  <Text style={styles.linkText}>
                    Não possui cadastro?{" "}
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Cadastro")}
                    >
                      <Text style={styles.link}>Clique aqui</Text>
                    </TouchableOpacity>
                  </Text>

                  <TouchableOpacity
                    onPress={() => navigation.navigate("RedefinirSenha")}
                  >
                    <Text style={[styles.linkText, styles.linkTextRedefinir]}>
                      Esqueceu sua senha?
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.button, isLoading && styles.buttonDisabled]}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.buttonText}>Entrar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.appBg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  fontKantumruySemiBold: {
    fontFamily: "Kantumruy Pro SemiBold",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 32,
    borderRadius: 24,
    backgroundColor: COLORS.appBg,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 200,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.primaryDark,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 34,
  },
  form: {
    gap: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 6,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  passwordToggle: {
    position: "absolute",
    right: 12,
    padding: 8,
  },
  input: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
  linksContainer: {
    paddingTop: 8,
    gap: 12,
  },
  linkText: {
    fontSize: 12,
    color: "#4B5563",
  },
  linkTextRedefinir: {
    textDecorationLine: "underline",
  },
  link: {
    color: "#4B5563",
    fontSize: 12,
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  button: {
    width: "100%",
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});

export default Login;
