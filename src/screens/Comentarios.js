import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { dynamoDB } from "../../awsConfig";

const Comentarios = ({ route }) => {
  const { productId } = route.params;  // ✔️ agora correto

  const [comentarios, setComentarios] = useState([]);
  const [media, setMedia] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [rating, setRating] = useState(5);

  // ---------------------------------------------------------
  // BUSCAR COMENTÁRIOS DO PRODUTO
  // ---------------------------------------------------------
  const pegarComentarios = async () => {
    try {
      // Para eficiência, use Query em vez de Scan se productId for a chave de partição
      // Assumindo que a tabela tem productId como chave de partição e id como chave de classificação
      // Se não, ajuste conforme o esquema da tabela
      const cmd = new ScanCommand({
        TableName: "comentarios",
        FilterExpression: "productId = :pid",
        ExpressionAttributeValues: {
          ":pid": { S: productId },
        },
      });

      const data = await dynamoDB.send(cmd);

      const lista =
        data.Items?.map((item) => ({
          id: item.id.S,
          productId: item.productId.S,
          title: item.title?.S || "",  // Adicione fallback para evitar undefined
          content: item.content?.S || "",
          rating: Number(item.rating?.N || 0),
          date: item.date?.S || "",
        })) || [];

      setComentarios(lista);
      calcularMedia(lista);
    } catch (e) {
      console.log("ERRO AO BUSCAR:", e);
    }
  };

  useEffect(() => {
    if (productId) {  // Adicione verificação para evitar chamadas desnecessárias
      pegarComentarios();
    }
  }, [productId]);

  // ---------------------------------------------------------
  // CALCULAR MÉDIA
  // ---------------------------------------------------------
  const calcularMedia = (lista) => {
    if (lista.length === 0) {
      setMedia(0);
      return;
    }
    const soma = lista.reduce((acc, c) => acc + c.rating, 0);
    const m = soma / lista.length;
    setMedia(Number(m.toFixed(1)));
  };

  // ---------------------------------------------------------
  // SALVAR COMENTÁRIO
  // ---------------------------------------------------------
  const enviarComentario = async () => {
    if (!productId) {
      Alert.alert("Erro", "ID do produto não encontrado.");
      return;
    }
    if (!titulo.trim() || !conteudo.trim()) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    const novo = {
      id: uuidv4(),
      productId: productId,
      title: titulo.trim(),  // Trim para remover espaços extras
      content: conteudo.trim(),
      rating: rating.toString(),
      date: new Date().toISOString().split("T")[0],
    };

    try {
      const cmd = new PutItemCommand({
        TableName: "comentarios",
        Item: {
          id: { S: novo.id },
          productId: { S: novo.productId },
          title: { S: novo.title },
          content: { S: novo.content },
          rating: { N: novo.rating },
          date: { S: novo.date },
        },
      });

      await dynamoDB.send(cmd);

      // atualizar
      const atualizada = [novo, ...comentarios];
      setComentarios(atualizada);
      calcularMedia(atualizada);

      // limpar
      setTitulo("");
      setConteudo("");
      setRating(5);

      setModalVisible(false);
    } catch (e) {
      console.log("ERRO AO ENVIAR:", e);
      Alert.alert("Erro", "Não foi possível enviar o comentário. Verifique os dados.");
    }
  };

  const renderRatingStars = () => (
    <View style={{ flexDirection: "row", marginBottom: 10 }}>
      {[1, 2, 3, 4, 5].map((num) => (
        <TouchableOpacity key={num} onPress={() => setRating(num)}>
          <Ionicons
            name={num <= rating ? "star" : "star-outline"}
            size={28}
            color="#f1c40f"
            style={{ marginRight: 4 }}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const ReviewCard = ({ review }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewDate}>{review.date}</Text>
        <View style={{ flexDirection: "row" }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Ionicons
              key={n}
              name={n <= review.rating ? "star" : "star-outline"}
              size={18}
              color="#052242"
            />
          ))}
        </View>
      </View>

      <Text style={styles.reviewTitle}>{review.title}</Text>
      <Text style={styles.reviewContent}>{review.content}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* MÉDIA FINAL DO PRODUTO */}
      <View style={styles.mediaContainer}>
        <Text style={styles.mediaTitulo}>Avaliação geral</Text>
        <Text style={styles.mediaValor}>{media} ★</Text>
      </View>

      {/* LISTA */}
      <View style={styles.reviewsList}>
        {comentarios.map((c) => (
          <ReviewCard key={c.id} review={c} />
        ))}
      </View>

      {/* BOTÃO MODAL */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Adicionar comentário</Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Novo comentário</Text>

            {renderRatingStars()}

            <TextInput
              placeholder="Título"
              style={styles.input}
              value={titulo}
              onChangeText={setTitulo}
            />

            <TextInput
              placeholder="Comentário..."
              style={[styles.input, { height: 100 }]}
              value={conteudo}
              multiline
              onChangeText={setConteudo}
            />

            <TouchableOpacity
              style={styles.sendButton}
              onPress={enviarComentario}
            >
              <Text style={styles.sendButtonText}>Enviar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

// ESTILOS
const PRIMARY_COLOR = "#052242";
const BACKGROUND_COLOR = "#f3ece2";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  mediaContainer: {
    padding: 20,
    alignItems: "center",
  },
  mediaTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
  },
  mediaValor: {
    fontSize: 26,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginTop: 5,
  },

  reviewsList: {
    paddingHorizontal: 20,
  },
  reviewCard: {
    backgroundColor: "#ded7cd",
    borderRadius: 10,
    padding: 15,
    marginBottom: 18,
  },

  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reviewDate: {
    color: "#555",
    fontSize: 12,
  },

  reviewTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
    color: PRIMARY_COLOR,
  },
  reviewContent: {
    fontSize: 14,
    color: "#333",
  },

  addButton: {
    backgroundColor: PRIMARY_COLOR,
    padding: 15,
    margin: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },

  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: PRIMARY_COLOR,
  },

  input: {
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  sendButton: {
    backgroundColor: PRIMARY_COLOR,
    padding: 12,
    borderRadius: 8,
  },
  sendButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  cancelButton: {
    marginTop: 10,
  },
  cancelButtonText: {
    textAlign: "center",
    color: "#d00",
    fontWeight: "bold",
  },
});

export default Comentarios;
