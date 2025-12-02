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
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRoute } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const produtoCategoria8Url =
  "https://olies-ports.s3.us-east-1.amazonaws.com/img/produto-categoria8.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZYPPXAY4ZABIJU4J%2F20251022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251022T220048Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEH4aCXVzLWVhc3QtMSJHMEUCIQDLdOlfWlDhnQa9X2AX%2FcfZhlc7zaX3PEBAgSvdcnqm9gIgTRas7lelKw3W%2FsyqkQTCuXJPodviC1v3o5KR5qN%2FQm8qgwMINxAAGgw2NzEwNTQ0OTczMzciDOgewKMYZkLt0PmQ0SrgAr%2FdkRkNXDWlJc43G7u%2FrKgyc068Iya8egWK7ZPXCoSOXtGv%2FzPoNZcchf36trcMmijmBmwx8s2m6nlIzs0mYw07Wse%2B1ckU6HPRy%2BOi4VrDRww4RExUFdFO1QfTHs0MCX8BIKxsi%2BtlKbRP2u8sftnGsSrqo2T5toblGfYuDwrHWVvjiM9WA8U4vu%2FagdyfKm6VEq3NuIXpR9EZk4xvYaeXSgMbiR5vZ2hEuCJkg%2FrkgaAqSkcRDf0QL4CdotpRRv%2BAv%2BV8IojNkz65XgyA3lxXzrHaiFjOZU7dA6voSK9clDtBUh%2Bs%2FbE63jYiKKtx7j6qbLpCHI5B6sXSoqh8%2FlhceIF0su%2Bf5ChFAl5wl2zBoZ%2FAKtwpFY3je%2BNxsiO4qLdO9XLeuNSMPnMA5aPdJfctNhJ6Ppc1WHF5SH3s4vgybq8Nm%2Fvst4Zf%2F07co8VuIz%2FDgU6Mwb45QaDszd6PM0owgNzkxwY6hwLH522OlUh5V5KdRkx0Nw46kQWu2H7CyyYCZCeeWYSD0N4bGNqae%2By9vwyE3WKMy1yo54Xo07Iveb5Ox1xR1HDiPPOidafWsXMLUD3RtW%2F70SIrQghpm5v%2BaNYrpt7ztwsXL%2B%2FxmWrVBKbPOf8NOkngAmoTtkxuBcWsmu2%2B%2B%2FSDEQMTIWoF3PG2jY%2F9sqOuJEzsQfsqVeoHcDRBLxR1OG%2BylQXxgMikc4Evdjj3tLHZ%2FIe%2BdoMDDZYLOqoxOxfHaUEwHXKGtsjhoTp3A2gVbaRknQy4licY1uEXJICtp6RX1VAB6r%2F6A%2BesY8VzCi7yo2p5EPDwmpsr6EGegiTMpxP1ey9tYi2CQ%3D%3D&X-Amz-Signature=010973e59019be94250baef00640efd7f27a0ca8f90ba9f402f0713d7eb634ea&X-Amz-SignedHeaders=host&response-content-disposition=inline";

export default function PagamentoScreen() {
  const [cartaoNumero, setCartaoNumero] = useState("");
  const [nomeTitular, setNomeTitular] = useState("");
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [cvv, setCvv] = useState("");
  const [parcelas, setParcelas] = useState("");
  const route = useRoute();
  const cartItems = route.params?.cartItems ?? [];
  const [showPixModal, setShowPixModal] = useState(false);

  const chavePix =
    "00020126580014BR.GOV.BCB.PIX0136612345678905204000053039865406100.005802BR5925OLIES SPORTS LTDA6009SAO PAULO62140510ABCD12345678";
  // Função básica para validar e processar pagamento com cartão
  const handlePagamentoCartao = async () => {
  if (!cartaoNumero || !nomeTitular || !mes || !ano || !cvv || !parcelas) {
    Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  Alert.alert("Sucesso", "Pagamento com cartão processado com sucesso!");

  await salvarPedido("Cartão");
};

  // Função básica para processar pagamento com PIX
const handlePagamentoPix = async () => {
  setShowPixModal(true);
  await salvarPedido("Pix");
};

  console.log("Itens recebidos no pagamento:", cartItems);
  const copiarChavePix = () => {
    Clipboard.setStringAsync(chavePix);
    Alert.alert("Copiado!", "A chave PIX foi copiada.");
  };

  const salvarPedido = async (tipoPagamento) => {
  try {
    const novoPedido = {
      id: Date.now(), // ID único
      itens: cartItems,
      data: new Date().toLocaleString("pt-BR"),
      tipoPagamento: tipoPagamento,
    };

    // Busca pedidos já existentes
    const pedidosSalvos = JSON.parse(await AsyncStorage.getItem("pedidos")) || [];

    // Adiciona o novo pedido
    pedidosSalvos.push(novoPedido);

    // Salva novamente
    await AsyncStorage.setItem("pedidos", JSON.stringify(pedidosSalvos));
    
  } catch (error) {
    console.log(error);
  }
};

  return (
    <SafeAreaView showsHorizontalScrollIndicator={false}
 style={{ flex: 1, backgroundColor: "#F3ECE2" }}>
    <ScrollView style={styles.container}>
      <Modal visible={showPixModal} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pagamento via PIX</Text>

            <QRCode value={chavePix} size={180} />

            <Text style={styles.modalSubtitle}>
              Chave Pix (copiar e colar):
            </Text>
            <Text selectable style={styles.chavePix}>
              {chavePix}
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={copiarChavePix}
            >
              <Text style={styles.modalButtonText}>Copiar chave</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#777" }]}
              onPress={() => setShowPixModal(false)}
            >
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {cartItems.map((item, index) => (
        <View key={index} style={styles.resumo}>
          {/* IMAGEM */}
          <Image source={{ uri: item.image?.uri }} style={styles.produto} />

          <View style={styles.detalhes}>
            {/* PREÇO */}
            <Text style={styles.total}>
              Total: R$ {(item.price * item.quantity).toFixed(2)}
            </Text>

            {/* NOME DO PRODUTO */}
            <Text style={styles.tituloProduto}>{item.name}</Text>

            {/* QUANTIDADE + COR */}
            <Text style={styles.quantidadeProduto}>
              Cor: {item.cor || "Padrão"} | Quantidade: {item.quantity}
            </Text>

            {/* Tipo de entrega */}
            <Text style={styles.entregaProduto}>
              Entrega: Normal - <Text style={{ color: "green" }}>Grátis</Text>
            </Text>
          </View>
        </View>
      ))}
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
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={mes}
              onValueChange={(itemValue) => setMes(itemValue)}
              style={styles.pickerInner}
            >
              <Picker.Item label="Mês" value="" />
              {[...Array(12)].map((_, i) => (
                <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={ano}
              onValueChange={(itemValue) => setAno(itemValue)}
              style={styles.pickerInner}
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
        </View>

        <TextInput
          placeholder="CVV"
          style={styles.input}
          keyboardType="numeric"
          value={cvv}
          onChangeText={setCvv}
          maxLength={4} // CVV geralmente tem 3-4 dígitos
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

        <TouchableOpacity style={styles.button} onPress={handlePagamentoCartao}>
          <Text style={styles.buttonText}>
            Finalizar pedido com cartão de crédito
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.section, styles.sectionPix]}>
        <View style={styles.pixPagamento}>
          <Image
            source={require("../assets/pix-icone.png")}
            style={styles.iconPix}
          />
          <Text style={styles.sectionTitle}>Pagar com PIX</Text>
        </View>
        <Text style={styles.pixBeneficios}>
          Benefícios do Pix: Aprovação imediata{"\n\n"}
        </Text>

        <Text style={styles.pixInfo}>
          Após a finalização do pedido, abra o app ou banco de sua preferência.
          Escolha a opção pagar com código Pix "copiar e colar", ou código QR. O
          código tem validade de 2 horas.
        </Text>

        <TouchableOpacity
          style={[styles.button, styles.buttonPix]}
          onPress={handlePagamentoPix}
        >
          <Text style={styles.buttonText}>Finalizar pedido com pix</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
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
  quantidadeProduto: {
    color: "#9D9D9D",
  },
  entregaProduto: {
    color: "#9D9D9D",
  },
  tituloProduto: {
    fontWeight: "bold",
  },
  detalhes: {
    flex: 1,
    justifyContent: "space-between",
  },
  tituloCartao: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
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
    marginBottom: 12,
    color: "#1e2d3b",
    marginLeft: -170,
  },
  sectionPix: {
    marginBottom: 50,
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
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    marginRight: 5,
    overflow: "hidden",
    backgroundColor: "#fefefe",
    height: 50,
    justifyContent: "center",
  },
  pickerInner: {
    width: "100%",
    height: "120%",
  },
  pixPagamento: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  iconPix: {
    height: 20,
    width: 20,
    marginTop: -12,
  },
  button: {
    backgroundColor: "#1e2d3b",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonPix: {
    backgroundColor: "#1e2d3b",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pixBeneficios: {
    textAlign: "center",
    fontSize: 16,
    color: "#052242",
    marginTop: 5,
    fontWeight: "bold",
  },
  pixInfo: {
    textAlign: "justify",
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
    marginBottom: 10,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalSubtitle: {
    marginTop: 15,
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  chavePix: {
    marginVertical: 10,
    fontSize: 13,
    color: "#444",
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#1e2d3b",
    width: "100%",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
