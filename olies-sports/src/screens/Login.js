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
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

const LOGO_URL =
  "https://olies-ports.s3.us-east-1.amazonaws.com/img/logotipo.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZYPPXAY4RCJUVETB%2F20251022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251022T213109Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEH4aCXVzLWVhc3QtMSJHMEUCIF5r9n3SlIlwrWIih6WGQBbM0tGPsmu0u7PQwsqhz%2BPlAiEAzLnLGZ5HWc0lLBpQCkn8Ylt59i%2BhXca%2BCmKpOjpOQeIqgwMINxAAGgw2NzEwNTQ0OTczMzciDDFO1pKJNryxXbCVoyrgAmMmOaS%2BflOGH6QAoaH6tzhwkvCfOw1wekhWdxd6GUAlmfhHfXztqglXHvi2%2FQTpdwpgBqVFOX54Jr9tA%2FG%2BhCyO9tJQWvEGsSpNrutHIdNSftmozjutyzZYH6KLii%2BZaAP%2BCN3lYeN%2FB%2FJLvosSMsCPw7pxl6xzcYL4d6GTtqsKlK6Kcv%2BDODZWmZe3jPJKj1%2FjO%2B203fQN9Dtx1ggorUTAuKfTXzaCnYvkpRPCJ2F6052rKZnjND%2FGmyvflyFr7JnTgKF3HVI164zMpxtFN%2BspzP5UBHMui0wtJR7XtVQbr8rytz4f6DYoDmL4RVxX0uGr2%2BCK1b6tGzOiEdLBsgZ21Z0e4%2Fl%2FjG%2FuxejOUZfQwhJpHnY5kbMu1oyYUKvuKTsyAgktsLbNkMG1WuopiJXaQKj%2Fcl%2BH0x0KXYz3q8mttq8QUpqOmh9rnkc6DxEMGmIWHzB9rLtRvhN7uc9PWXQwgNzkxwY6hwKiJY9COGoIhCXtEd48aip89g9td2xbtd54Ojr2N4wznAW2oK1ufZ9OTiMIo8tuOL%2BUhJigtU3KxkJugU2JVjLAnDctb6AImhjY4ULdlqxP35%2FI3LHaM1t5Wiw7ltZ3laOJ0FsSDiNt693oroD3pSBxs%2B4R01ye3Ra62%2B7w7wkJxGLcPLOHraDS36OLrSQh4jOAjiOey%2BrKt7t6QaiJgFu4qRVWLA23wQzhYTMRNpTzaTzU26pewVPuRhE5y7X82XqNiNdum8vVwd2KO6ZHlOWxKDqhiOV4PnOoNYGuDj99HpOK6hE8UIThBdCQAshDTd6VKPUYsMEc%2FQZQWUvQHDSYA31Mc7nikQ%3D%3D&X-Amz-Signature=11eb26d8eb399b6d2f91c9721a92839350d8a784acefe0d988a547de57c03b6f&X-Amz-SignedHeaders=host&response-content-disposition=inline";

const COLORS = {
  primaryDark: "#052242",
  appBg: "#F3ECE2",
  inputBg: "#EEEEEE",
  inputColor: "#9D9D9D",
};

// Componente principal de Login
const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("victorkoba08@gmail.com");
  const [password, setPassword] = useState("***********");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // No React Native, não há 'e.preventDefault()'
  const handleLogin = () => {
    setIsLoading(true);
    setMessage(null);

    // Simulação de delay/chamada de API
    setTimeout(() => {
      // Usamos Alert para mostrar a mensagem, que é o padrão em RN para feedback rápido.
      Alert.alert("Sucesso", "Login efetuado com sucesso!");
      setMessage({ type: "success", text: "Login efetuado com sucesso!" });
      setTimeout(() => {
        setIsLoading(false);
        setMessage(null);
        // Aqui você faria a navegação para a tela principal
      }, 2000);
    }, 2000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    // View principal para centralizar o conteúdo
    <View style={styles.container}>
      {/* Card de Login */}
      <View style={styles.card}>
        {/* Logo e Título */}
        <View style={styles.header}>
          <Image
            source={{ uri: LOGO_URL }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Subtítulo */}
        <Text style={[styles.subtitle, styles.fontKantumruySemiBold]}>
          Entre na{"\n"}sua conta
        </Text>

        {/* Formulário (representado por uma View) */}
        <View style={styles.form}>
          {/* Campo Email */}
          <View>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="seuemail@exemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          {/* Campo Senha */}
          <View>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="***********"
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              {/* Botão de Toggle de Senha (TouchableOpacity) */}
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

          {/* Links de Auxílio */}
          <View style={styles.linksContainer}>
            <Text style={styles.linkText}>
              Não possue cadastro? {/* Link de Cadastro */}
              <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
                <Text style={styles.link}>Clique aqui</Text>
              </TouchableOpacity>
            </Text>

            {/* Link de Esqueci a Senha */}
            <TouchableOpacity
              onPress={() => navigation.navigate("RedefinirSenha")}
            >
              <Text style={[styles.linkText, styles.linkTextRedefinir]}>Esqueceu sua senha?</Text>
            </TouchableOpacity>
          </View>

          {/* Botão de Entrar */}
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

      {/* Mensagem de Feedback (Exemplo de um Toast ou Modal simples) */}
      {message && (
        <View
          style={[
            styles.messageBox,
            message.type === "success" ? styles.successBg : styles.errorBg,
          ]}
        >
          <Text style={styles.messageText}>{message.text}</Text>
        </View>
      )}
    </View>
  );
};

// Estilos convertidos de Tailwind para StyleSheet do React Native
const styles = StyleSheet.create({
  // Root view
  container: {
    flex: 1,
    backgroundColor: COLORS.appBg,
    alignItems: "center",
    justifyContent: "center",
  },

  fontKantumruySemiBold: {
    fontFamily: "Kantumruy Pro SemiBold",
  },
  fontKantumruyMedium: {
    fontFamily: "Kantumruy Pro Medium",
  },
  // Card
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 32,
    borderRadius: 24,
    backgroundColor: COLORS.appBg,
  },
  // Header (Logo e Título)
  header: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 290,
    height: 290,
  },
  // Subtítulo
  subtitle: {
    fontSize: 40, // text-3xl
    fontWeight: "700", // font-bold
    color: COLORS.primaryDark,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 38, // Adiciona line height para melhor leitura do <br/>
  },
  // Formulário
  form: {
    gap: 24, // space-y-6 (convertido para gap no View)
  },
  label: {
    fontSize: 12, // text-sm
    fontWeight: "600", // font-semibold
    color: "#4B5563", // text-gray-700
    marginBottom: 4, // mb-1
  },
  // Campo de Senha e Toggle
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  passwordToggle: {
    position: "absolute",
    right: 16,
    padding: 8,
  },
  // Inputs
  input: {
    width: "100%",
    paddingVertical: 12, // p-3 (vertical)
    paddingHorizontal: 16, // p-3 (horizontal)
    borderRadius: 12, // rounded-xl
    backgroundColor: COLORS.inputBg,
    color: COLORS.inputColor,
    fontSize: 16, // text-base
    fontWeight: "500", // font-medium
  },
  // Links
  linksContainer: {
    paddingTop: 4, // pt-1
    gap: 8, // space-y-2
  },
  linkText: {
    fontSize: 12, // text-xs
    color: "#4B5563", // text-gray-600
    flexDirection: "row",
    flexWrap: "wrap",

  },

  linkTextRedefinir: {
    textDecorationLine:"underline",
  },

  link: {
    color: "#4B5563",
    fontSize: 12,
    textDecorationLine: "underline",
  },
  // Botão
  button: {
    width: "100%",
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 14, // py-3
    borderRadius: 12, // rounded-xl
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,

    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700", // font-bold
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  // Message Toast
  messageBox: {
    position: "absolute",
    bottom: 32,
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  successBg: {
    backgroundColor: "#10B981", // bg-green-500
  },
  errorBg: {
    backgroundColor: "#EF4444", // bg-red-500 (Não usado, mas bom para ter)
  },
  messageText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

export default Login;
