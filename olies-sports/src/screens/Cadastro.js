import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // ícone de olho
import { useNavigation } from "@react-navigation/native";

const logo =
  "https://olies-ports.s3.us-east-1.amazonaws.com/img/logotipo.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZYPPXAY4RCJUVETB%2F20251022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251022T213109Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEH4aCXVzLWVhc3QtMSJHMEUCIF5r9n3SlIlwrWIih6WGQBbM0tGPsmu0u7PQwsqhz%2BPlAiEAzLnLGZ5HWc0lLBpQCkn8Ylt59i%2BhXca%2BCmKpOjpOQeIqgwMINxAAGgw2NzEwNTQ0OTczMzciDDFO1pKJNryxXbCVoyrgAmMmOaS%2BflOGH6QAoaH6tzhwkvCfOw1wekhWdxd6GUAlmfhHfXztqglXHvi2%2FQTpdwpgBqVFOX54Jr9tA%2FG%2BhCyO9tJQWvEGsSpNrutHIdNSftmozjutyzZYH6KLii%2BZaAP%2BCN3lYeN%2FB%2FJLvosSMsCPw7pxl6xzcYL4d6GTtqsKlK6Kcv%2BDODZWmZe3jPJKj1%2FjO%2B203fQN9Dtx1ggorUTAuKfTXzaCnYvkpRPCJ2F6052rKZnjND%2FGmyvflyFr7JnTgKF3HVI164zMpxtFN%2BspzP5UBHMui0wtJR7XtVQbr8rytz4f6DYoDmL4RVxX0uGr2%2BCK1b6tGzOiEdLBsgZ21Z0e4%2Fl%2FjG%2FuxejOUZfQwhJpHnY5kbMu1oyYUKvuKTsyAgktsLbNkMG1WuopiJXaQKj%2Fcl%2BH0x0KXYz3q8mttq8QUpqOmh9rnkc6DxEMGmIWHzB9rLtRvhN7uc9PWXQwgNzkxwY6hwKiJY9COGoIhCXtEd48aip89g9td2xbtd54Ojr2N4wznAW2oK1ufZ9OTiMIo8tuOL%2BUhJigtU3KxkJugU2JVjLAnDctb6AImhjY4ULdlqxP35%2FI3LHaM1t5Wiw7ltZ3laOJ0FsSDiNt693oroD3pSBxs%2B4R01ye3Ra62%2B7w7wkJxGLcPLOHraDS36OLrSQh4jOAjiOey%2BrKt7t6QaiJgFu4qRVWLA23wQzhYTMRNpTzaTzU26pewVPuRhE5y7X82XqNiNdum8vVwd2KO6ZHlOWxKDqhiOV4PnOoNYGuDj99HpOK6hE8UIThBdCQAshDTd6VKPUYsMEc%2FQZQWUvQHDSYA31Mc7nikQ%3D%3D&X-Amz-Signature=11eb26d8eb399b6d2f91c9721a92839350d8a784acefe0d988a547de57c03b6f&X-Amz-SignedHeaders=host&response-content-disposition=inline";

export default function TelaCadastro() {
  const navigation = useNavigation();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [dados, setDados] = useState({
    email: "",
    senha: "",
    nome: "",
    sobrenome: "",
    cpf: "",
    dataNascimento: "",
    telefone: "",
    genero: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    referencia: "",
  });

  const handleChange = (campo, valor) => {
    setDados({ ...dados, [campo]: valor });
  };

  const handleCadastro = () => {
    alert("Cadastro enviado com sucesso!");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: logo }} // Coloque seu logo em assets/logo.png
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.criarConta}>Criar uma conta</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações da conta</Text>

        <TextInput
          style={[styles.input, styles.fontKantumruySemiBold]}
          placeholder="Email"
          keyboardType="email-address"
          value={dados.email}
          onChangeText={(v) => handleChange("email", v)}
        />

        <View style={styles.senhaContainer}>
          <TextInput
            style={[styles.input, styles.fontKantumruySemiBold, { flex: 1 }]}
            placeholder="Senha"
            secureTextEntry={!mostrarSenha}
            value={dados.senha}
            onChangeText={(v) => handleChange("senha", v)}
          />
          <TouchableOpacity
            onPress={() => setMostrarSenha(!mostrarSenha)}
            style={styles.olhoIcone}
          >
            <Ionicons
              name={mostrarSenha ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#555"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados pessoais</Text>

        <TextInput
          style={[styles.input, styles.fontKantumruySemiBold]}
          placeholder="Nome"
          value={dados.nome}
          onChangeText={(v) => handleChange("nome", v)}
        />
        <TextInput
          style={[styles.input, styles.fontKantumruySemiBold]}
          placeholder="Sobrenome"
          value={dados.sobrenome}
          onChangeText={(v) => handleChange("sobrenome", v)}
        />
        <TextInput
          style={[styles.input, styles.fontKantumruySemiBold]}
          placeholder="CPF"
          keyboardType="numeric"
          value={dados.cpf}
          onChangeText={(v) => handleChange("cpf", v)}
        />
        <TextInput
          style={[styles.input, styles.fontKantumruySemiBold]}
          placeholder="Data de nascimento"
          value={dados.dataNascimento}
          onChangeText={(v) => handleChange("dataNascimento", v)}
        />
        <TextInput
          style={[styles.input, styles.fontKantumruySemiBold]}
          placeholder="Telefone de contato"
          keyboardType="phone-pad"
          value={dados.telefone}
          onChangeText={(v) => handleChange("telefone", v)}
        />

        <Text style={styles.label}>Gênero</Text>
        <View style={styles.generoContainer}>
          <Pressable
            style={styles.optionContainer}
            onPress={() => handleChange("genero", "Masculino")}
          >
            <View
              style={[
                styles.outerCircle,
                dados.genero === "Masculino" && styles.outerCircleSelecionado,
              ]}
            >
              {dados.genero === "Masculino" && (
                <View style={styles.innerCircle} />
              )}
            </View>
            <Text style={styles.generoTexto}>Masculino</Text>
          </Pressable>

          <Pressable
            style={styles.optionContainer}
            onPress={() => handleChange("genero", "Feminino")}
          >
            <View
              style={[
                styles.outerCircle,
                dados.genero === "Feminino" && styles.outerCircleSelecionado,
              ]}
            >
              {dados.genero === "Feminino" && (
                <View style={styles.innerCircle} />
              )}
            </View>
            <Text style={styles.generoTexto}>Feminino</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Endereço</Text>

        <TextInput
          style={[styles.input, styles.fontKantumruySemiBold]}
          placeholder="CEP"
          keyboardType="numeric"
          value={dados.cep}
          onChangeText={(v) => handleChange("cep", v)}
        />
        <TextInput
          style={[styles.input, styles.fontKantumruySemiBold]}
          placeholder="Endereço"
          value={dados.endereco}
          onChangeText={(v) => handleChange("endereco", v)}
        />
        <TextInput
          style={[styles.input, styles.fontKantumruySemiBold]}
          placeholder="Número"
          keyboardType="numeric"
          value={dados.numero}
          onChangeText={(v) => handleChange("numero", v)}
        />
        <TextInput
          style={[styles.input, styles.fontKantumruySemiBold]}
          placeholder="Complemento (opcional)"
          value={dados.complemento}
          onChangeText={(v) => handleChange("complemento", v)}
        />
        <TextInput
          style={[styles.input, styles.fontKantumruySemiBold]}
          placeholder="Bairro"
          value={dados.bairro}
          onChangeText={(v) => handleChange("bairro", v)}
        />
        <TextInput
          style={[styles.input, styles.fontKantumruySemiBold]}
          placeholder="Cidade"
          value={dados.cidade}
          onChangeText={(v) => handleChange("cidade", v)}
        />
        <TextInput
          style={[styles.input, styles.fontKantumruySemiBold]}
          placeholder="Estado"
          value={dados.estado}
          onChangeText={(v) => handleChange("estado", v)}
        />
        <TextInput
          style={[styles.input, styles.fontKantumruySemiBold]}
          placeholder="Ponto de referência (opcional)"
          value={dados.referencia}
          onChangeText={(v) => handleChange("referencia", v)}
        />
      </View>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate("Tabs", {screen: "HomeScreen"})}
      >
        <Text style={styles.textoBotao}>Cadastrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fdf6ee",
    padding: 20,
  },

  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 35,
  },
  logo: {
    width: 290,
    height: 290,
  },

  criarConta: {
    fontSize: 40, // text-3xl
    fontWeight: "700", // font-bold
    color: "#052242",
    textAlign: "center",
    marginBottom: 20,
    width: "40%",
    lineHeight: 38,
  },

  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "30%",
    gap: 6,
  },

  fontKantumruySemiBold: {
    fontFamily: "Kantumruy Pro SemiBold",
  },
  fontKantumruyMedium: {
    fontFamily: "Kantumruy Pro Medium",
  },

  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#052242",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    height: 60,
    paddingHorizontal: 12,
    fontSize: 15,
    color: "#052242",
    marginBottom: 15,
  },
  senhaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  outerCircleSelecionado: {
    borderColor: "#555",
    backgroundColor: "#fff",
    padding: 3,
    borderRadius: 12,
  },

  innerCircle: {
    width: 15,
    height: 15,
    borderRadius: 30,
    backgroundColor: "#B1B1B1",
  },

  generoTexto: {
    fontSize: 15,
    color: "#052242",
    fontWeight: "bold",
  },
  olhoIcone: {
    position: "absolute",
    right: 15,
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#052242",
    marginBottom: 8,
  },

  generoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 40,
    marginTop: 6,
  },
  radio: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  radioSelecionado: {
    backgroundColor: "#dfeade",
    borderColor: "#052242",
  },
  botao: {
    backgroundColor: "#052242",
    height: 60,
    width: 250,
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginBottom: 100,
  },
  textoBotao: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
});
