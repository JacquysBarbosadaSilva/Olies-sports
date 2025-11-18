// TelaCadastro.js
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
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

const logo = "https://olies-ports.s3.us-east-1.amazonaws.com/img/logotipo.png";

export default function TelaCadastro() {
  const navigation = useNavigation();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarData, setMostrarData] = useState(false);
  const [mostrarEstados, setMostrarEstados] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setDados((prev) => ({ ...prev, [campo]: valor }));
  };

  // Gera id simples sem crypto
  const gerarIdSimples = () => `${Date.now()}${Math.floor(Math.random() * 10000)}`;

  // Hash "simulada" (não segura) apenas para não salvar texto cru
  const gerarHashSimples = (senha) => "HASH_" + String(senha).split("").reverse().join("");

  // ---------- SALVAR LOCAL (AsyncStorage) - funciona no RN sem dependências nativas ----------
  const handleCadastro = async () => {
    try {
      if (!dados.email || !dados.senha || !dados.nome) {
        Alert.alert("Atenção", "Preencha os campos: Nome, Email e Senha.");
        return;
      }
      setLoading(true);

      // cria objeto simplificado do usuário
      const usuario = {
        id: gerarIdSimples(),
        nome: dados.nome,
        sobrenome: dados.sobrenome || "",
        email: dados.email,
        senhaHash: gerarHashSimples(dados.senha),
        cpf: dados.cpf || "",
        dataNascimento: dados.dataNascimento || "",
        telefone: dados.telefone || "",
        genero: dados.genero || "",
        cep: dados.cep || "",
        endereco: dados.endereco || "",
        numero: dados.numero || "",
        complemento: dados.complemento || "",
        bairro: dados.bairro || "",
        cidade: dados.cidade || "",
        estado: dados.estado || "",
        referencia: dados.referencia || "",
        criadoEm: new Date().toISOString(),
      };

      // lê lista existente
      const raw = await AsyncStorage.getItem("usuarios_local");
      const lista = raw ? JSON.parse(raw) : [];

      // adiciona e salva
      lista.push(usuario);
      await AsyncStorage.setItem("usuarios_local", JSON.stringify(lista));

      setLoading(false);
      Alert.alert("Sucesso", "Cadastro local realizado com sucesso!", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (err) {
      setLoading(false);
      console.error("Erro ao cadastrar (local):", err);
      Alert.alert("Erro ao cadastrar", err?.message || String(err));
    }
  };

  const estadosBrasil = [
    "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
    "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
    "RS","RO","RR","SC","SP","SE","TO",
  ];

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F3ECE2" }}>
        <View style={styles.header}>
          <Image source={{ uri: logo }} style={styles.logo} resizeMode="contain" />
          <Text style={styles.criarConta}>Criar uma conta</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações da conta</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={dados.email}
            onChangeText={(v) => handleChange("email", v)}
            autoCapitalize="none"
          />

          <View style={styles.senhaContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Senha"
              secureTextEntry={!mostrarSenha}
              value={dados.senha}
              onChangeText={(v) => handleChange("senha", v)}
            />
            <TouchableOpacity
              onPress={() => setMostrarSenha(!mostrarSenha)}
              style={styles.olhoIcone}
            >
              <Ionicons name={mostrarSenha ? "eye-off-outline" : "eye-outline"} size={22} color="#555" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados pessoais</Text>
          <TextInput style={styles.input} placeholder="Nome" value={dados.nome} onChangeText={(v) => handleChange("nome", v)} />
          <TextInput style={styles.input} placeholder="Sobrenome" value={dados.sobrenome} onChangeText={(v) => handleChange("sobrenome", v)} />
          <TextInput style={styles.input} placeholder="CPF" keyboardType="numeric" value={dados.cpf} onChangeText={(v) => handleChange("cpf", v)} />

          <TouchableOpacity onPress={() => setMostrarData(true)}>
            <TextInput style={styles.input} placeholder="Data de nascimento" editable={false} value={dados.dataNascimento} />
          </TouchableOpacity>

          {mostrarData && (
            <DateTimePicker
              mode="date"
              value={new Date()}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, date) => {
                setMostrarData(false);
                if (date) handleChange("dataNascimento", date.toLocaleDateString("pt-BR"));
              }}
            />
          )}

          <TextInput style={styles.input} placeholder="Telefone de contato" keyboardType="phone-pad" value={dados.telefone} onChangeText={(v) => handleChange("telefone", v)} />

          <Text style={styles.label}>Gênero</Text>
          <View style={styles.generoContainer}>
            <Pressable style={styles.optionContainer} onPress={() => handleChange("genero", "Masculino")}>
              <View style={[styles.outerCircle, dados.genero === "Masculino" && styles.outerCircleSelecionado]}>
                {dados.genero === "Masculino" && <View style={styles.innerCircle} />}
              </View>
              <Text style={styles.generoTexto}>Masculino</Text>
            </Pressable>

            <Pressable style={styles.optionContainer} onPress={() => handleChange("genero", "Feminino")}>
              <View style={[styles.outerCircle, dados.genero === "Feminino" && styles.outerCircleSelecionado]}>
                {dados.genero === "Feminino" && <View style={styles.innerCircle} />}
              </View>
              <Text style={styles.generoTexto}>Feminino</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço</Text>
          <TextInput style={styles.input} placeholder="CEP" keyboardType="numeric" value={dados.cep} onChangeText={(v) => handleChange("cep", v)} />
          <TextInput style={styles.input} placeholder="Endereço" value={dados.endereco} onChangeText={(v) => handleChange("endereco", v)} />
          <TextInput style={styles.input} placeholder="Número" keyboardType="numeric" value={dados.numero} onChangeText={(v) => handleChange("numero", v)} />
          <TextInput style={styles.input} placeholder="Complemento (opcional)" value={dados.complemento} onChangeText={(v) => handleChange("complemento", v)} />
          <TextInput style={styles.input} placeholder="Bairro" value={dados.bairro} onChangeText={(v) => handleChange("bairro", v)} />
          <TextInput style={styles.input} placeholder="Cidade" value={dados.cidade} onChangeText={(v) => handleChange("cidade", v)} />

          <TouchableOpacity onPress={() => setMostrarEstados(true)}>
            <TextInput style={styles.input} placeholder="Estado" editable={false} value={dados.estado} />
          </TouchableOpacity>

          <Modal visible={mostrarEstados} transparent animationType="slide">
            <TouchableWithoutFeedback onPress={() => setMostrarEstados(false)}>
              <View style={styles.modalFundo}>
                <View style={styles.modalContainer}>
                  <FlatList data={estadosBrasil} keyExtractor={(item) => item} renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => { handleChange("estado", item); setMostrarEstados(false); }}>
                      <Text style={styles.estadoItem}>{item}</Text>
                    </TouchableOpacity>
                  )} />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          <TextInput style={styles.input} placeholder="Ponto de referência (opcional)" value={dados.referencia} onChangeText={(v) => handleChange("referencia", v)} />
        </View>

        <TouchableOpacity style={styles.botao} onPress={handleCadastro} disabled={loading}>
          <Text style={styles.textoBotao}>{loading ? "Cadastrando..." : "Cadastrar"}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#F3ECE2", padding: 20 },
  header: { alignItems: "center", marginTop: 20, marginBottom: 35 },
  logo: { width: 290, height: 290 },
  criarConta: { fontSize: 40, fontWeight: "700", color: "#052242", textAlign: "center", marginBottom: 20 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#052242", marginBottom: 10 },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#ccc", borderRadius: 6, height: 60, paddingHorizontal: 12, fontSize: 15, color: "#052242", marginBottom: 15 },
  senhaContainer: { flexDirection: "row", alignItems: "center" },
  olhoIcone: { position: "absolute", right: 15 },
  label: { fontSize: 16, fontWeight: "bold", color: "#052242", marginBottom: 8 },
  generoContainer: { flexDirection: "row", alignItems: "center", gap: 40, marginTop: 6 },
  optionContainer: { flexDirection: "row", alignItems: "center", gap: 6 },
  outerCircle: { borderWidth: 2, borderColor: "#555", borderRadius: 15, width: 22, height: 22, alignItems: "center", justifyContent: "center" },
  outerCircleSelecionado: { borderColor: "#555", backgroundColor: "#fff" },
  innerCircle: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#B1B1B1" },
  generoTexto: { fontSize: 15, color: "#052242", fontWeight: "bold" },
  botao: { backgroundColor: "#052242", height: 60, width: 250, alignSelf: "center", justifyContent: "center", borderRadius: 8, marginBottom: 100 },
  textoBotao: { color: "#FFF", textAlign: "center", fontSize: 24, fontWeight: "bold" },
  modalFundo: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContainer: { backgroundColor: "#fff", borderRadius: 10, width: "80%", maxHeight: "60%", padding: 20 },
  estadoItem: { fontSize: 18, paddingVertical: 10, borderBottomWidth: 1, borderColor: "#ddd", textAlign: "center" },
});

const estadosBrasil = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];
