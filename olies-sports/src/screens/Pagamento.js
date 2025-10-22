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

const logoUrl = "https://olies-ports.s3.us-east-1.amazonaws.com/img/logotipo.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZYPPXAY4RCJUVETB%2F20251022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251022T213109Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEH4aCXVzLWVhc3QtMSJHMEUCIF5r9n3SlIlwrWIih6WGQBbM0tGPsmu0u7PQwsqhz%2BPlAiEAzLnLGZ5HWc0lLBpQCkn8Ylt59i%2BhXca%2BCmKpOjpOQeIqgwMINxAAGgw2NzEwNTQ0OTczMzciDDFO1pKJNryxXbCVoyrgAmMmOaS%2BflOGH6QAoaH6tzhwkvCfOw1wekhWdxd6GUAlmfhHfXztqglXHvi2%2FQTpdwpgBqVFOX54Jr9tA%2FG%2BhCyO9tJQWvEGsSpNrutHIdNSftmozjutyzZYH6KLii%2BZaAP%2BCN3lYeN%2FB%2FJLvosSMsCPw7pxl6xzcYL4d6GTtqsKlK6Kcv%2BDODZWmZe3jPJKj1%2FjO%2B203fQN9Dtx1ggorUTAuKfTXzaCnYvkpRPCJ2F6052rKZnjND%2FGmyvflyFr7JnTgKF3HVI164zMpxtFN%2BspzP5UBHMui0wtJR7XtVQbr8rytz4f6DYoDmL4RVxX0uGr2%2BCK1b6tGzOiEdLBsgZ21Z0e4%2Fl%2FjG%2FuxejOUZfQwhJpHnY5kbMu1oyYUKvuKTsyAgktsLbNkMG1WuopiJXaQKj%2Fcl%2BH0x0KXYz3q8mttq8QUpqOmh9rnkc6DxEMGmIWHzB9rLtRvhN7uc9PWXQwgNzkxwY6hwKiJY9COGoIhCXtEd48aip89g9td2xbtd54Ojr2N4wznAW2oK1ufZ9OTiMIo8tuOL%2BUhJigtU3KxkJugU2JVjLAnDctb6AImhjY4ULdlqxP35%2FI3LHaM1t5Wiw7ltZ3laOJ0FsSDiNt693oroD3pSBxs%2B4R01ye3Ra62%2B7w7wkJxGLcPLOHraDS36OLrSQh4jOAjiOey%2BrKt7t6QaiJgFu4qRVWLA23wQzhYTMRNpTzaTzU26pewVPuRhE5y7X82XqNiNdum8vVwd2KO6ZHlOWxKDqhiOV4PnOoNYGuDj99HpOK6hE8UIThBdCQAshDTd6VKPUYsMEc%2FQZQWUvQHDSYA31Mc7nikQ%3D%3D&X-Amz-Signature=11eb26d8eb399b6d2f91c9721a92839350d8a784acefe0d988a547de57c03b6f&X-Amz-SignedHeaders=host&response-content-disposition=inline";
const produtoCategoria8Url = "https://olies-ports.s3.us-east-1.amazonaws.com/img/produto-categoria8.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZYPPXAY4ZABIJU4J%2F20251022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251022T220048Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEH4aCXVzLWVhc3QtMSJHMEUCIQDLdOlfWlDhnQa9X2AX%2FcfZhlc7zaX3PEBAgSvdcnqm9gIgTRas7lelKw3W%2FsyqkQTCuXJPodviC1v3o5KR5qN%2FQm8qgwMINxAAGgw2NzEwNTQ0OTczMzciDOgewKMYZkLt0PmQ0SrgAr%2FdkRkNXDWlJc43G7u%2FrKgyc068Iya8egWK7ZPXCoSOXtGv%2FzPoNZcchf36trcMmijmBmwx8s2m6nlIzs0mYw07Wse%2B1ckU6HPRy%2BOi4VrDRww4RExUFdFO1QfTHs0MCX8BIKxsi%2BtlKbRP2u8sftnGsSrqo2T5toblGfYuDwrHWVvjiM9WA8U4vu%2FagdyfKm6VEq3NuIXpR9EZk4xvYaeXSgMbiR5vZ2hEuCJkg%2FrkgaAqSkcRDf0QL4CdotpRRv%2BAv%2BV8IojNkz65XgyA3lxXzrHaiFjOZU7dA6voSK9clDtBUh%2Bs%2FbE63jYiKKtx7j6qbLpCHI5B6sXSoqh8%2FlhceIF0su%2Bf5ChFAl5wl2zBoZ%2FAKtwpFY3je%2BNxsiO4qLdO9XLeuNSMPnMA5aPdJfctNhJ6Ppc1WHF5SH3s4vgybq8Nm%2Fvst4Zf%2F07co8VuIz%2FDgU6Mwb45QaDszd6PM0owgNzkxwY6hwLH522OlUh5V5KdRkx0Nw46kQWu2H7CyyYCZCeeWYSD0N4bGNqae%2By9vwyE3WKMy1yo54Xo07Iveb5Ox1xR1HDiPPOidafWsXMLUD3RtW%2F70SIrQghpm5v%2BaNYrpt7ztwsXL%2B%2FxmWrVBKbPOf8NOkngAmoTtkxuBcWsmu2%2B%2B%2B%2FSDEQMTIWoF3PG2jY%2F9sqOuJEzsQfsqVeoHcDRBLxR1OG%2BylQXxgMikc4Evdjj3tLHZ%2FIe%2BdoMDDZYLOqoxOxfHaUEwHXKGtsjhoTp3A2gVbaRknQy4licY1uEXJICtp6RX1VAB6r%2F6A%2BesY8VzCi7yo2p5EPDwmpsr6EGegiTMpxP1ey9tYi2CQ%3D%3D&X-Amz-Signature=010973e59019be94250baef00640efd7f27a0ca8f90ba9f402f0713d7eb634ea&X-Amz-SignedHeaders=host&response-content-disposition=inline"

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
          source={{uri: produtoCategoria8Url}}
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