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
  Platform
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";

const logoUrl = "https://olies-ports.s3.us-east-1.amazonaws.com/img/logotipo.png";

const sexosDisponiveis = ["Masculino", "Feminino", "Outro", "Prefiro não dizer"];

export default function PerfilScreen({ navigation }) {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [email] = useState("victorkoba08@gmail.com");

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [cpf] = useState("123.456.789-00");
  const [sexo, setSexo] = useState("Masculino");
  const [mostrarSexos, setMostrarSexos] = useState(false);

  const [nascimento, setNascimento] = useState(new Date("2000-01-01"));
  const [mostrarData, setMostrarData] = useState(false);
  const [telefone, setTelefone] = useState("");

  const salvarAlteracoes = () => {
    Alert.alert("Sucesso", "Alterações salvas com sucesso!");
  };

  const formatarData = (data) => {
    return data.toLocaleDateString("pt-BR");
  };

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F3ECE2" }}>
      {/* Cabeçalho */}
      <View style={styles.headerContainer}>
        <Text style={styles.titulo}>Perfil</Text>
        <Image source={{ uri: logoUrl }} style={styles.logo} />
      </View>
      <View style={styles.shadowLine}></View>

      {/* Conteúdo */}
      <View style={styles.content}>
        <Text style={styles.greeting}>Olá Victor!</Text>

        {/* Botões lado a lado */}
        <View style={styles.menuRow}>
          {/* Gerenciar Endereços */}
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate("Enderecos")}
          >
            <View style={styles.menuButtonContent}>
              <Image
                source={require("../assets/emoji-casa.png")}
                style={styles.menuIcon}
              />
              <Text style={styles.menuButtonText}>Gerenciar{"\n"}Endereços</Text>
            </View>
          </TouchableOpacity>

          {/* Visualizar Pedidos */}
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate("Pedidos")}
          >
            <View style={styles.menuButtonContent}>
              <Image
                source={require("../assets/icone-caixa.png")}
                style={styles.menuIcon}
              />
              <Text style={styles.menuButtonText}>Visualizar{"\n"}Pedidos</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Card de Informações Pessoais */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Informações Pessoais</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor="#888"
            value={nome}
            onChangeText={setNome}
          />
          <TextInput
            style={styles.input}
            placeholder="Sobrenome"
            placeholderTextColor="#888"
            value={sobrenome}
            onChangeText={setSobrenome}
          />
          <TextInput style={styles.inputDisabled} value={cpf} editable={false} />
          <Text style={styles.sectionDicaAviso}>
            Este campo não pode ser alterado
          </Text>

          {/* Seletor de Sexo */}
          <TouchableOpacity
            style={styles.input}
            onPress={() => setMostrarSexos(!mostrarSexos)}
          >
            <Text>{sexo}</Text>
          </TouchableOpacity>
          {mostrarSexos &&
            sexosDisponiveis.map((opcao) => (
              <TouchableOpacity
                key={opcao}
                style={styles.opcao}
                onPress={() => {
                  setSexo(opcao);
                  setMostrarSexos(false);
                }}
              >
                <Text style={styles.opcaoTexto}>{opcao}</Text>
              </TouchableOpacity>
            ))}

          {/* Seletor de Data */}
          <TouchableOpacity
            style={styles.input}
            onPress={() => setMostrarData(true)}
          >
            <Text style={styles.inputText}>{formatarData(nascimento)}</Text>
          </TouchableOpacity>

          {mostrarData && (
            <DateTimePicker
              value={nascimento}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                if (event.type === "set" && selectedDate) {
                  setNascimento(selectedDate);
                }
                setMostrarData(false);
              }}
              maximumDate={new Date()}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Telefone"
            placeholderTextColor="#888"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Card de Senha e E-mail */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Informações de Cadastro</Text>

          <Text style={styles.sectionTitle}>E-mail</Text>
          <TextInput style={styles.inputDisabled} value={email} editable={false} />
          <Text style={styles.sectionDicaAviso}>
            Este campo não pode ser alterado
          </Text>

          <Text style={styles.sectionTitle}>Alterar senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Senha atual"
            placeholderTextColor="#888"
            secureTextEntry
            autoCapitalize="none"
            value={senhaAtual}
            onChangeText={setSenhaAtual}
          />
          <TextInput
            style={styles.input}
            placeholder="Nova senha"
            placeholderTextColor="#888"
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
    </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3ECE2",
    paddingTop: 40,
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
  content: {
    padding: 20,
  },
  greeting: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "500",
  },

  /* --- Botões lado a lado --- */
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },
  menuButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuButtonContent: {
    alignItems: "center",
  },
  menuIcon: {
    width: 30,
    height: 30,
    marginBottom: 5,
    resizeMode: "contain",
  },
  menuButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#001f3f",
    textAlign: "center",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#052242",
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
    height: 60,
    justifyContent: "center",
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
  opcao: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 6,
    marginBottom: 5,
  },
  opcaoTexto: {
    fontSize: 15,
    color: "#333",
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
    alignSelf: "center",
    marginTop: 20,
    width: 100,
  },
  exitButtonText: {
    fontSize: 15,
    textAlign: "center",
    color: "#555",
  },
  sectionDicaAviso: {
    fontSize: 13,
    color: "#7a7a7aff",
    fontStyle: "italic",
    marginBottom: 10,
    marginLeft: 4,
  },
  inputText: {
    fontSize: 15,
    color: "#333",
  },
});
