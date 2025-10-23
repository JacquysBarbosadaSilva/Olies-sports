import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons"; // Para o ícone de seta

const COLORS = {
  background: "#f3ece2",
  inputBackground: "#fff",
  inputBorder: "#ccc",
  text: "#052242",
  placeholder: "#999",
  buttonBackground: "#052242",
  buttonText: "#fff",
  helperText: "#666",
};

const Stack = createNativeStackNavigator();
const LOGO =
  "https://olies-ports.s3.us-east-1.amazonaws.com/img/logotipo.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZYPPXAY45PJVYVC4%2F20251023%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251023T001515Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQDLIo6J7Eeus3ItRQVtSHo8%2Fm4s9Eg2fyqERkqddtSBdgIhAJcVZr%2BL6Yv7cfu8ZsYCrark0Gk0fFWRQlAy%2Fpxk3ThaKoMDCDkQABoMNjcxMDU0NDk3MzM3IgyAp8nZJD7P1gjnYoYq4AJehEwcYHjmbQ5UpaS3gLhUTrXW3bWp8fG1riByp0y6VLBaf8Qgs0gh3Kgj%2FR%2BgkMVCAJeWnjn5lIhoO5mPaoo3%2Biy%2Bbnwzah8aVPHLgsw4H5Hgf88rZ9J9yf7reWrRvgTN52PQvtH18wClfr1E%2FkG8AcLJ6vOnRISDaPHAAQ4J2BjlGQGXbPaD9b5Reur9rIWh3U%2FgnRsNCy8zUQml2IwEITcgJjDKuke2GfH3PE10EaHiCaMrM6TlIsCz5x9T6vFl8JCxN83%2FOPodDd7p5Kdxbe39PesfopXU6Ie4KXB4AmGc%2FBwwOxC%2BrYyGaU5oCPwrBKf2WxdhML9iZ%2BUXYsQjcmWu96GzjTro3qexsrxg2AHDlSadRhz2zj1uXRXOR8bdxNB%2FLzUSDR20Gt4tMRqr4BrfdFmBUB9AS0OdRZRSzXFvUnZh7NkuJTp0RyL5MwFLXiaKidssIv6m80oOzxCJMM7c5ccGOoYCs19unx433aLhrTcUtztai70I%2Bkl48BcjoLXICfDvfPhcJWZIbQEKoufPhIUBi8V%2B5t7i5V08Xm0CCCeK2hJhS36%2Fh57vYMkdeoQH71bLr3tht4CaDqcChuKIvHVZCG3qei4UvifrfSYMJmNS1Kxp%2FwoTgc%2BvK9NWFyZBr2SxCpJYxIpSC6XVcCReenJSIPYhKZvhSyUcgIHHhOPrcOBjrHzn9dnz4oZFxCGVXV4VmkkrhVTQEvJmeL5NnaTGJK1NqjHjoTvzkES%2BqJcP409RjiDYlXrjEjEtQSsCVmkwJNAXqO%2FFAasEqqHv9llJlxpTy5VVLG3H8gvOnGRoX0%2FQ2mSM28Lh4Q%3D%3D&X-Amz-Signature=49a058a009f641699d535841a9cad3b6846d4c85771eba7142b6efeca21383cd&X-Amz-SignedHeaders=host&response-content-disposition=inline"; // Caminho do logo

// --- COMPONENTE CABEÇALHO COM VOLTAR ---
const Header = ({ navigation }) => (
  <TouchableOpacity
    style={styles.backButton}
    onPress={() => navigation.goBack()}
  >
    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
  </TouchableOpacity>
);

// --- 1. TELA: Redefinir Senha ---
const RedefinirSenhaScreen = ({ navigation }) => {
  const [email, setEmail] = useState("victorkoba08@gmail.com");

  const handleSendCode = () => {
    if (email.trim() === "") {
      Alert.alert("Erro", "Por favor, insira seu e-mail.");
      return;
    }
    console.log(`[RedefinirSenha] Enviando código para: ${email}`);
    navigation.navigate("InserirCodigo", { email });
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <Image source={{ uri: LOGO }} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Redefinir senha</Text>

      <Text style={styles.inputLabel}>Email</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="seu@email.com"
        placeholderTextColor={COLORS.placeholder}
      />

      <Text style={styles.helperText}>
        Insira seu e-mail para receber um código para redefinir sua senha.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleSendCode}>
        <Text style={styles.buttonText}>Enviar código</Text>
      </TouchableOpacity>
    </View>
  );
};

// --- 2. TELA: Inserir Código ---
const InserirCodigoScreen = ({ navigation, route }) => {
  const { email } = route.params || {};
  const [code, setCode] = useState("");

  const handleConfirmCode = () => {
    if (code.length !== 6) {
      Alert.alert("Erro", "O código deve ter 6 dígitos.");
      return;
    }
    console.log(`[InserirCodigo] Validando código ${code} para ${email}`);
    navigation.navigate("CriarNovaSenha");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <Header navigation={navigation} />
      <Image source={{ uri: LOGO }} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Inserir código</Text>

      <Text style={styles.inputLabel}>Código</Text>
      <TextInput
        style={styles.input}
        onChangeText={setCode}
        value={code}
        keyboardType="numeric"
        secureTextEntry={true}
        maxLength={6}
        placeholder=""
        placeholderTextColor={COLORS.placeholder}
      />

      <Text style={styles.helperText}>
        Insira o código recebido no seu e-mail.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleConfirmCode}>
        <Text style={styles.buttonText}>Confirmar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

// --- 3. TELA: Criar Nova Senha ---
const CriarNovaSenhaScreen = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleConfirmNewPassword = () => {
    if (newPassword.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }
    console.log("Nova senha confirmada. Atualizando no sistema.");
    Alert.alert("Sucesso", "Sua senha foi redefinida com sucesso!", [
      { text: "OK", onPress: () => navigation.navigate('Login') },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 20,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Header navigation={navigation} />
        <Image
          source={{ uri: LOGO }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Criar nova senha</Text>

        <Text style={styles.inputLabel}>Senha nova</Text>
        <TextInput
          style={styles.input}
          onChangeText={setNewPassword}
          value={newPassword}
          secureTextEntry={true}
          placeholder="Insira a nova senha"
          placeholderTextColor={COLORS.placeholder}
        />

        <Text style={styles.inputLabel}>Confirmar senha nova</Text>
        <TextInput
          style={styles.input}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          secureTextEntry={true}
          placeholder="Confirme a nova senha"
          placeholderTextColor={COLORS.placeholder}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleConfirmNewPassword}
        >
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// --- COMPONENTE PRINCIPAL ---
const RedefinirSenhaFlow = () => {
  return (
    <Stack.Navigator
      initialRouteName="RedefinirSenha"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="RedefinirSenha" component={RedefinirSenhaScreen} />
      <Stack.Screen name="InserirCodigo" component={InserirCodigoScreen} />
      <Stack.Screen name="CriarNovaSenha" component={CriarNovaSenhaScreen} />
    </Stack.Navigator>
  );
};

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
    justifyContent: "center",
  },
  logo: {
    width: 290,
    height: 290,
    alignSelf: "center",
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    height: 50,
    borderColor: COLORS.inputBorder,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: COLORS.inputBackground,
    color: COLORS.text,
  },
  helperText: {
    fontSize: 14,
    color: COLORS.helperText,
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.buttonBackground,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.buttonText,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RedefinirSenhaFlow;
