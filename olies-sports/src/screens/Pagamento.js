import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Picker,
} from "react-native";

export default function PagamentoScreen() {
  const [cartaoNumero, setCartaoNumero] = useState("");
  const [nomeTitular, setNomeTitular] = useState("");
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [cvv, setCvv] = useState("");
  const [parcelas, setParcelas] = useState("");

  return (
    <ScrollView style={styles.container}>

      <View style={styles.resumo}>
        <Image
          source={require("../assets/img/produto-categoria8.png")}
          style={styles.produto}
        />
        <View style={styles.detalhes}>
          <Text style={styles.total}>Total: R$ 479,90</Text>
          <Text style={styles.tituloProduto}>Tênis QIX Missy Feat Urban Hiking Series Branco e Cinza</Text>
          <Text style={styles.quantidadeProduto}>Tamanho: 42 | Quantidade: 1</Text>
          <Text style={styles.entregaProduto}>Entrega: Normal - <Text style={{ color: "green" }}>Grátis</Text></Text>
        </View>
      </View>

      {/* Pagamento com Cartão de Crédito */}
      <View style={styles.section}>
        <View style={styles.tituloCartao}>
          <Image
            source={require("../assets/icon-cartao.png")}
            style={styles.iconCartao}
          />
          <Text style={styles.textCartao}>Pagar com cartão de crédito</Text>
        </View>

        <TextInput
          placeholder="Número do cartão"
          style={styles.input}
          keyboardType="numeric"
          value={cartaoNumero}
          onChangeText={setCartaoNumero}
        />
        <TextInput
          placeholder="Nome do titular"
          style={styles.input}
          value={nomeTitular}
          onChangeText={setNomeTitular}
        />
        <View style={styles.row}>
          <Picker
            selectedValue={mes}
            style={styles.picker}
            onValueChange={(itemValue) => setMes(itemValue)}
          >
            <Picker.Item label="Mês" value="" style={styles.input}/>
            {[...Array(12)].map((_, i) => (
              <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
            ))}
          </Picker>
          <Picker
            selectedValue={ano}
            style={styles.picker}
            onValueChange={(itemValue) => setAno(itemValue)}
          >
            <Picker.Item label="Ano" value="" />
            {[...Array(10)].map((_, i) => {
              const anoAtual = new Date().getFullYear();
              return (
                <Picker.Item
                  key={i}
                  label={`${anoAtual + i}`}
                  value={`${anoAtual + i}`}
                />
              );
            })}
          </Picker>
        </View>
        <TextInput
          placeholder="Código de segurança (CVV)"
          style={styles.input}
          keyboardType="numeric"
          value={cvv}
          onChangeText={setCvv}
        />
        <Picker
          selectedValue={parcelas}
          style={styles.input}
          onValueChange={(itemValue) => setParcelas(itemValue)}
        >
          <Picker.Item label="Opções de parcelamento" value="" />
          <Picker.Item label="1x sem juros" value="1" />
          <Picker.Item label="2x sem juros" value="2" />
          <Picker.Item label="3x sem juros" value="3" />
        </Picker>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Finalizar pedido com cartão de crédito</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.pixPagamento}>
        <Image
            source={require("../assets/pix-icone.png")}
            style={styles.iconPix}
          />
        <Text style={styles.sectionTitle}>Pagar com PIX</Text>
        </View>
        <Text style={styles.pixInfo}>
          Benefícios do Pix: Aprovação imediata{'\n\n'}
          Após a finalização do pedido, abra o app ou banco de sua preferência.
          Escolha a opção pagar com código Pix "copiar e colar", ou código QR.
          O código tem validade de 2 horas.
        </Text>

        <TouchableOpacity style={[styles.button, styles.buttonPix]}>
          <Text style={styles.buttonText}>Finalizar pedido com pix</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F3ECE2",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e2d3b",
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  resumo: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  produto: {
    width: 80,
    height: 80,
    marginRight: 10,
    resizeMode: "contain",
  },
  detalhes: {
    flex: 1,
    justifyContent: "space-between",
  },
  tituloCartao: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: 'center',
  },
  textCartao: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 15,
    color: "#1e2d3b",
    marginLeft: -40,
  },
  iconCartao: {
    height: 30,
    width: 30,
    marginBottom: 15,
  },
  total: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  section: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 15,
    color: "#1e2d3b",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fefefe",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  picker: {
    flex: 1,
    height: 50,
    marginBottom: 10,
    marginRight: 5,
  },
  pixPagamento: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: 'center',
  },
  button: {
    backgroundColor: "#1e2d3b",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonPix: {
    backgroundColor: "#00bfa5",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pixInfo: {
    color: "#333",
    marginBottom: 10,
  },
});