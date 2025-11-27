// InfoProdutos.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  UpdateItemCommand,
  GetItemCommand,
  DeleteItemCommand,
  QueryCommand,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import * as ImagePicker from "expo-image-picker";
import * as AWS from "../../awsConfig";
import { Picker } from "@react-native-picker/picker";
import { useLayoutEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height } = Dimensions.get("window");
const CAROUSEL_HEIGHT_RATIO = 0.5;
const ITEM_HEIGHT = height * CAROUSEL_HEIGHT_RATIO;

export default function InfoProduto() {
  const navigation = useNavigation();
  const route = useRoute();
  const { produto: produtoParam } = route.params || {};
  // clone the product into local state so we can edit
  const [produto, setProduto] = useState(produtoParam || {});

  // states for UI
  const [selectedColors, setSelectedColors] = useState([]); // cores selecionadas para exibir
  console.log("CORES:", selectedColors);

  const [availableColors, setAvailableColors] = useState(
    produtoParam?.cores || []
  );
  const [displayImages, setDisplayImages] = useState([]); // urls do carrossel
  const [imagemAtual, setImagemAtual] = useState(0);
  const [selectedColorPicker, setSelectedColorPicker] = useState(null); // id da cor selecionada pra editar imagens
  const [modalVisible, setModalVisible] = useState(false);
  const [isFavorito, setIsFavorito] = useState(false);

  // fields editáveis
  const [editNome, setEditNome] = useState(produtoParam?.nome || "");
  const [editPreco, setEditPreco] = useState(String(produtoParam?.preco || ""));
  const [editDescricao, setEditDescricao] = useState(
    produtoParam?.descricao || ""
  );
  // tamanhos: separado em tipo, inicio e fim
  const [editTamanhoTipo, setEditTamanhoTipo] = useState(
    produtoParam?.tamanhos?.tipo || ""
  );
  const [editTamanhoInicio, setEditTamanhoInicio] = useState(
    String(produtoParam?.tamanhos?.intervalo?.inicio || "")
  );
  const [editTamanhoFim, setEditTamanhoFim] = useState(
    String(produtoParam?.tamanhos?.intervalo?.fim || "")
  );
  const [indisponiveisSelecionados, setIndisponiveisSelecionados] = useState(
    produtoParam?.tamanhos?.indisponiveis || []
  );

  const [selectedTamanho, setSelectedTamanho] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Ionicons
          name="heart-outline"
          size={24}
          color="#052242"
          style={{ marginRight: 15 }}
          onPress={handleFavoritar}
        />
      ),
    });
  }, [navigation, selectedColors, selectedTamanho, produto]);

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const tipo = await AsyncStorage.getItem("usuarioLogado");
        if (tipo === "admin") {
          setIsAdmin(true);
        }
      } catch (e) {
        console.log("Erro ao ler tipoUsuario:", e);
      }
    };
    carregarUsuario();
  }, []);

  useEffect(() => {
    const checkFavorito = async () => {
      try {
        const usuarioId = await AsyncStorage.getItem("usuarioLogado");
        if (!usuarioId || !produto?.id) return;
        const queryParams = {
          TableName: "favoritos",
          KeyConditionExpression: "usuarioId = :uid AND produtoId = :pid",
          ExpressionAttributeValues: {
            ":uid": { S: usuarioId },
            ":pid": { S: String(produto.id) },
          },
        };
        const queryCommand = new QueryCommand(queryParams);
        const result = await dynamoDB.send(queryCommand);
        setIsFavorito(result.Items && result.Items.length > 0);
      } catch (error) {
        console.log("Erro ao verificar favorito:", error);
      }
    };
    checkFavorito();
  }, [produto?.id]);

  // clients / constantes (do seu awsConfig)
  const dynamoDB = AWS.dynamoDB;
  const s3 = AWS.s3;
  const BUCKET_NAME = AWS.BUCKET_NAME;
  const REGION = AWS.REGION;

  // inicializa states a partir do produto recebido
  useEffect(() => {
    setProduto(produtoParam || {});
    const cores = produtoParam?.cores || [];
    setAvailableColors(cores);
    // default display: primeira cor
    const first = cores && cores.length ? cores[0] : null;
    if (first) {
      setSelectedColors([first]);
      setDisplayImages(first.imagens || []);
      setSelectedColorPicker(first.id || first.cor);
    } else {
      setSelectedColors([]);
      setDisplayImages([]);
      setSelectedColorPicker(null);
    }
    setEditNome(produtoParam?.nome || "");
    setEditPreco(String(produtoParam?.preco || ""));
    setEditDescricao(produtoParam?.descricao || "");
    setEditTamanhoTipo(produtoParam?.tamanhos?.tipo || "");
    setEditTamanhoInicio(
      String(produtoParam?.tamanhos?.intervalo?.inicio || "")
    );
    setEditTamanhoFim(String(produtoParam?.tamanhos?.intervalo?.fim || ""));
    setIndisponiveisSelecionados(produtoParam?.tamanhos?.indisponiveis || []);
  }, [produtoParam]);

  // quando selectedColors muda, atualiza displayImages
  useEffect(() => {
    if (!selectedColors || selectedColors.length === 0) {
      const first =
        availableColors && availableColors.length ? availableColors[0] : null;
      setDisplayImages(first ? first.imagens || [] : []);
      return;
    }
    const urls = [];
    selectedColors.forEach((c) => {
      if (c.imagens && c.imagens.length) urls.push(...c.imagens);
    });
    setDisplayImages(urls);
  }, [selectedColors, availableColors]);

  const handlePickerSelect = (value) => {
    if (!value) return;

    const colorObj = availableColors.find(
      (c) => c.id === value || c.cor === value
    );
    if (!colorObj) return;

    // Seleciona APENAS essa cor
    setSelectedColors([colorObj]);
    setSelectedColorPicker(value);
  };

  // SCROLL (carrossel)
  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    setImagemAtual(index);
  };

  // -------------------------
  // Funções de upload / delete S3
  // -------------------------
  const uploadFileToS3 = async (localUri, productId) => {
    try {
      // busca arquivo local
      const response = await fetch(localUri);
      const arrayBuffer = await response.arrayBuffer();
      // tenta extrair extensão
      const extMatch = localUri.match(/\.(\w+)(\?.*)?$/);
      const ext = extMatch ? extMatch[1] : "jpg";
      const key = `produtos/${productId}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
          Body: arrayBuffer,
          ContentType: "image/jpeg",
        })
      );

      return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;
    } catch (err) {
      console.error("Erro upload S3:", err);
      return null;
    }
  };

  const deleteFileFromS3 = async (url) => {
    try {
      if (!url || !url.includes(`${BUCKET_NAME}.s3.`)) {
        // se não pertence ao nosso bucket, não deletamos
        return;
      }
      // transforma URL em key
      // ex: https://bucket.s3.us-east-1.amazonaws.com/produtos/...
      const prefix = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/`;
      if (!url.startsWith(prefix)) return;
      const key = url.replace(prefix, "");
      await s3.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
    } catch (err) {
      console.warn("Erro ao deletar objeto S3 (talvez permissões):", err);
    }
  };

  // -------------------------
  // Imagens: adicionar, substituir, excluir (apenas na cor selecionada)
  // -------------------------
  const pickImagesAndAdd = async (colorId) => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.7,
      });
      if (res.canceled) return;
      const assets = res.assets || [];
      if (!assets.length) return;

      const productId = produto.id || Date.now().toString();
      const uploadedUrls = [];
      for (const asset of assets) {
        const url = await uploadFileToS3(asset.uri, productId);
        if (url) uploadedUrls.push(url);
      }

      if (!uploadedUrls.length) {
        Alert.alert("Erro", "Falha ao fazer upload das imagens.");
        return;
      }

      // atualiza availableColors localmente
      const newColors = availableColors.map((c) => {
        if ((c.id || c.cor) === colorId) {
          return { ...c, imagens: [...(c.imagens || []), ...uploadedUrls] };
        }
        return c;
      });

      setAvailableColors(newColors);
      // atualiza produto local
      setProduto((p) => ({ ...p, cores: newColors }));
      // atualiza display se for a cor atualmente selecionada
      if (selectedColorPicker === colorId || selectedColors.length === 0) {
        const selected = newColors.find((c) => (c.id || c.cor) === colorId);
        if (selected) setSelectedColors([selected]);
      }
    } catch (err) {
      console.error("Erro ao adicionar imagens:", err);
      Alert.alert("Erro ao selecionar/adicionar imagens.");
    }
  };

  const replaceImage = async (colorId, imageIndex) => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 0.7,
      });
      if (res.canceled) return;
      const asset = res.assets && res.assets[0];
      if (!asset) return;
      const productId = produto.id || Date.now().toString();
      const url = await uploadFileToS3(asset.uri, productId);
      if (!url) {
        Alert.alert("Erro", "Falha ao fazer upload da nova imagem.");
        return;
      }

      // substitui a URL no array local
      const newColors = availableColors.map((c) => {
        if ((c.id || c.cor) === colorId) {
          const imagens = [...(c.imagens || [])];
          // opcional: deletar a antiga do s3
          const oldUrl = imagens[imageIndex];
          if (oldUrl) deleteFileFromS3(oldUrl).catch(() => {});
          imagens[imageIndex] = url;
          return { ...c, imagens };
        }
        return c;
      });

      setAvailableColors(newColors);
      setProduto((p) => ({ ...p, cores: newColors }));
      // atualiza selectedColors
      const sel = newColors.find(
        (c) => (c.id || c.cor) === selectedColorPicker
      );
      if (sel) setSelectedColors([sel]);
    } catch (err) {
      console.error("Erro ao substituir imagem:", err);
      Alert.alert("Erro ao substituir imagem.");
    }
  };

  const deleteImage = async (colorId, imageIndex) => {
    try {
      const color = availableColors.find((c) => (c.id || c.cor) === colorId);
      if (!color) return;
      const urlToDelete = color.imagens && color.imagens[imageIndex];
      if (!urlToDelete) return;

      // remover localmente
      const newColors = availableColors.map((c) => {
        if ((c.id || c.cor) === colorId) {
          const imagens = (c.imagens || []).filter((_, i) => i !== imageIndex);
          return { ...c, imagens };
        }
        return c;
      });

      setAvailableColors(newColors);
      setProduto((p) => ({ ...p, cores: newColors }));

      // atualizar selectedColors
      const sel = newColors.find(
        (c) => (c.id || c.cor) === selectedColorPicker
      );
      if (sel) setSelectedColors([sel]);

      // tentar deletar do S3 (opcional)
      await deleteFileFromS3(urlToDelete);
    } catch (err) {
      console.error("Erro ao deletar imagem:", err);
      Alert.alert("Erro ao excluir imagem.");
    }
  };

  // -------------------------
  // Toggle tamanho indisponível
  // -------------------------
  const toggleIndisponivel = (tamanho) => {
    setIndisponiveisSelecionados((prev) => {
      if (prev.includes(tamanho)) {
        return prev.filter((t) => t !== tamanho);
      }
      return [...prev, tamanho];
    });
  };

  // -------------------------
  // Gerar array de tamanhos
  // -------------------------
  const gerarArrayTamanhos = () => {
    const inicio = parseInt(editTamanhoInicio, 10);
    const fim = parseInt(editTamanhoFim, 10);
    if (isNaN(inicio) || isNaN(fim) || inicio > fim) return [];
    const arr = [];
    for (let i = inicio; i <= fim; i++) {
      arr.push(i);
    }
    return arr;
  };

  // -------------------------
  // Atualizar produto no DynamoDB
  // -------------------------
  const updateProdutoOnDB = async () => {
    try {
      if (!produto?.id) {
        Alert.alert("Erro", "Produto sem ID — não é possível atualizar.");
        return;
      }

      // validar e construir objeto de tamanhos
      let tamanhosParsed = {};

      if (editTamanhoTipo.trim() !== "") {
        const inicio = parseInt(editTamanhoInicio, 10);
        const fim = parseInt(editTamanhoFim, 10);

        if (isNaN(inicio) || isNaN(fim)) {
          Alert.alert(
            "Erro",
            "Os campos de início e fim devem ser números válidos."
          );
          return;
        }

        if (inicio > fim) {
          Alert.alert(
            "Erro",
            "O valor de início não pode ser maior que o valor de fim."
          );
          return;
        }

        tamanhosParsed = {
          tipo: editTamanhoTipo,
          intervalo: {
            inicio,
            fim,
          },
          indisponiveis: indisponiveisSelecionados || [],
        };
      }

      // gera imagensFlat (todos urls concatenados)
      const imagensFlat = [];
      (availableColors || []).forEach((c) => {
        if (c.imagens && c.imagens.length) imagensFlat.push(...c.imagens);
      });

      const params = {
        TableName: "produtos",
        Key: { id: { S: String(produto.id) } },
        UpdateExpression:
          "SET nome = :nome, preco = :preco, descricao = :descricao, cores = :cores, imagens = :imagens, tamanhos = :tamanhos",
        ExpressionAttributeValues: {
          ":nome": { S: editNome || "" },
          ":preco": { N: String(editPreco || "0") },
          ":descricao": { S: editDescricao || "" },
          ":cores": { S: JSON.stringify(availableColors || []) },
          ":imagens": { S: JSON.stringify(imagensFlat || []) },
          ":tamanhos": { S: JSON.stringify(tamanhosParsed) },
        },
        ReturnValues: "ALL_NEW",
      };

      const command = new UpdateItemCommand(params);
      const response = await dynamoDB.send(command);

      // atualizar local state com os novos valores (para refletir na UI)
      const updatedProduto = {
        ...produto,
        nome: editNome,
        preco: parseFloat(editPreco),
        descricao: editDescricao,
        cores: availableColors,
        imagensFlat,
        tamanhos: tamanhosParsed,
      };
      setProduto(updatedProduto);

      Alert.alert("Sucesso", "Produto atualizado com sucesso.");
      setModalVisible(false);
    } catch (error) {
      console.error("Erro ao atualizar produto no DynamoDB:", error);
      Alert.alert("Erro", "Falha ao atualizar produto no banco.");
    }
  };

  // -------------------------
  // Deletar produto do DynamoDB
  // -------------------------
  const deleteProdutoFromDB = async () => {
    try {
      if (!produto?.id) {
        Alert.alert("Erro", "Produto sem ID — não é possível deletar.");
        return;
      }

      // Primeiro, deletar todas as imagens do S3
      const imagensFlat = [];
      (availableColors || []).forEach((c) => {
        if (c.imagens && c.imagens.length) imagensFlat.push(...c.imagens);
      });

      for (const url of imagensFlat) {
        await deleteFileFromS3(url);
      }

      // Depois, deletar o item do DynamoDB
      const params = {
        TableName: "produtos",
        Key: { id: { S: String(produto.id) } },
      };

      const command = new DeleteItemCommand(params);
      await dynamoDB.send(command);

      Alert.alert("Sucesso", "Produto deletado com sucesso.");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao deletar produto no DynamoDB:", error);
      Alert.alert("Erro", "Falha ao deletar produto no banco.");
    }
  };

  // -------------------------
  // UI helper: render imagens da cor selecionada com controles
  // -------------------------
  const renderImagesForSelectedColor = () => {
    if (!selectedColorPicker) return null;
    const color = availableColors.find(
      (c) => (c.id || c.cor) === selectedColorPicker
    );
    if (!color) return null;
    const imagens = color.imagens || [];

    return (
      <View>
        <Text style={{ fontWeight: "600", marginBottom: 8 }}>
          Imagens da cor: {color.cor || color.id}
        </Text>
        <ScrollView horizontal style={{ marginBottom: 12 }}>
          {imagens.length === 0 && (
            <Text style={{ color: "#666" }}>Nenhuma imagem</Text>
          )}
          {imagens.map((url, idx) => (
            <View key={idx} style={{ marginRight: 8, alignItems: "center" }}>
              <Image
                source={{ uri: url }}
                style={{ width: 120, height: 120, borderRadius: 8 }}
                resizeMode="cover"
              />

              <View style={{ flexDirection: "row", marginTop: 10 }}>
                {/* Ícone de substituir */}
                <TouchableOpacity
                  onPress={() => replaceImage(color.id || color.cor, idx)}
                  style={{
                    padding: 6,
                    borderRadius: 6,
                    marginRight: 16, // espaçamento maior
                  }}
                >
                  <MaterialIcons name="cached" size={28} color="#007bff" />
                </TouchableOpacity>

                {/* Ícone de excluir */}
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert("Confirmar", "Excluir essa imagem?", [
                      { text: "Cancelar", style: "cancel" },
                      {
                        text: "Excluir",
                        style: "destructive",
                        onPress: () => deleteImage(color.id || color.cor, idx),
                      },
                    ]);
                  }}
                  style={{
                    padding: 6,
                    borderRadius: 6,
                  }}
                >
                  <MaterialIcons
                    name="delete-outline"
                    size={28}
                    color="#dc3545"
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity
          onPress={() => pickImagesAndAdd(color.id || color.cor)}
          style={{
            backgroundColor: "#001f3f",
            padding: 10,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              width: "100%",
              justifyContent: "center",
              textAlign: "center",
              backgroundColor: "#001f3f",
            }}
          >
            Adicionar imagem
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // -------------------------
  // Navegar para Detalhes (se precisar)
  // -------------------------
  const goDetalhes = () =>
    navigation.navigate("DetalhesProduto", { productId: produto?.id });

  // -------------------------
  // Render
  // -------------------------

  const handleFavoritar = async () => {
    try {
      const usuarioId = await AsyncStorage.getItem("usuarioLogado");
      if (!usuarioId) {
        Alert.alert("Erro", "Usuário não encontrado (userId).");
        return;
      }
      // Use Scan para verificar se já está favoritado (em vez de Query)
      const scanParams = {
        TableName: "favoritos",
        FilterExpression: "usuarioId = :uid AND produtoId = :pid",
        ExpressionAttributeValues: {
          ":uid": { S: usuarioId },
          ":pid": { S: String(produto.id) },
        },
      };
      const scanCommand = new ScanCommand(scanParams);
      const scanResult = await dynamoDB.send(scanCommand);
      const existingFavorite =
        scanResult.Items && scanResult.Items.length > 0
          ? scanResult.Items[0]
          : null;
      if (existingFavorite) {
        // Já está favoritado: remove usando o "id" do item encontrado
        const deleteParams = {
          TableName: "favoritos",
          Key: {
            id: { S: existingFavorite.id.S }, // Use o "id" como chave primária
          },
        };
        await dynamoDB.send(new DeleteItemCommand(deleteParams));
        setIsFavorito(false);
        Alert.alert("Sucesso", "Produto removido dos favoritos!");
      } else {
        // Não está favoritado: adiciona
        const favoritoId = Date.now().toString();
        const dataAdicionado = new Date().toISOString();
        // Pega a primeira imagem da cor selecionada
        const corSelecionada = selectedColors[0];
        const imagemPrincipal = corSelecionada?.imagens?.[0] || "";
        const itemFavorito = {
          id: { S: favoritoId }, // Chave primária
          usuarioId: { S: usuarioId },
          produtoId: { S: String(produto.id) },
          cor: { S: corSelecionada?.cor || "" },
          dataAdicionado: { S: dataAdicionado },
          imagem: { S: imagemPrincipal },
          nomeProduto: { S: produto.nome },
          preco: { N: String(produto.preco) },
          quantidade: { N: "1" },
          tamanho: { S: selectedTamanho || "" },
        };
        const params = {
          TableName: "favoritos",
          Item: itemFavorito,
        };
        await dynamoDB.send(new PutItemCommand(params));
        setIsFavorito(true);
        Alert.alert("Sucesso", "Produto adicionado aos favoritos!");
      }
    } catch (error) {
      console.log("Erro ao favoritar:", error);
      Alert.alert("Erro", "Não foi possível atualizar os favoritos.");
    }
  };
  // No useLayoutEffect, atualize para usar o estado isFavorito no ícone
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Ionicons
          name={isFavorito ? "heart" : "heart-outline"} // Muda o ícone baseado no estado
          size={24}
          color="#052242"
          style={{ marginRight: 15 }}
          onPress={handleFavoritar}
        />
      ),
    });
  }, [navigation, selectedColors, selectedTamanho, produto, isFavorito]);
  return (
    <View style={styles.container}>
      {isAdmin && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 10,
            marginRight: 15,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              Alert.alert("Confirmar", "Deletar este produto?", [
                { text: "Cancelar", style: "cancel" },
                {
                  text: "Deletar",
                  style: "destructive",
                  onPress: deleteProdutoFromDB,
                },
              ]);
            }}
          >
            <Ionicons name="trash-outline" size={26} color="#dc3545" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons name="create-outline" size={26} color="#333" />
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={displayImages}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={styles.imagem}
            resizeMode="contain"
          />
        )}
        showsVerticalScrollIndicator={false}
        pagingEnabled
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={ITEM_HEIGHT}
      />

      <View style={styles.indicadores}>
        {displayImages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicador,
              imagemAtual === index && styles.indicadorAtivo,
            ]}
          />
        ))}
      </View>

      <View style={styles.infoContainer}>
        <Text style={{ fontWeight: "600", marginBottom: 8 }}>Cor</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: "#eee",
            borderRadius: 8,
            marginBottom: 8,
          }}
        ></View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {selectedColors.map((c, index) => (
            <View key={index} style={{ alignItems: "center" }}>
              <View
                style={[
                  styles.colorCircleLarge,
                  c.hex
                    ? {
                        backgroundColor: c.hex.startsWith("#")
                          ? c.hex
                          : `#${c.hex}`,
                      }
                    : {
                        backgroundColor: "#fff",
                        borderWidth: 1,
                        borderColor: "#ddd",
                      },
                ]}
              />
              <Text
                style={{
                  fontSize: 11,
                  marginTop: 4,
                  width: 30,
                  textAlign: "center",
                }}
              >
                {c.cor}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.nome}>{produto?.nome}</Text>
        <Text style={styles.preco}>
          R$ {Number(produto?.preco || 0).toFixed(2)}
        </Text>

        <TouchableOpacity style={styles.botaoDetalhes} onPress={goDetalhes}>
          <Text style={styles.textoBotaoDetalhes}>Detalhes do Produto</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Edição */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <ScrollView
            style={{ width: "95%" }}
            contentContainerStyle={{
              alignItems: "center",
              paddingVertical: 20,
            }}
          >
            <View style={styles.modalContainer}>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
              >
                Editar Produto
              </Text>

              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                value={editNome}
                onChangeText={setEditNome}
                placeholder="Nome do produto"
              />

              <Text style={styles.label}>Preço</Text>
              <TextInput
                style={styles.input}
                value={editPreco}
                onChangeText={setEditPreco}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                multiline
                value={editDescricao}
                onChangeText={setEditDescricao}
              />

              <Text style={[styles.label, { marginTop: 12 }]}>Tamanhos</Text>

              <Text style={styles.label}>Tipo</Text>
              <TextInput
                style={styles.input}
                value={editTamanhoTipo}
                onChangeText={setEditTamanhoTipo}
                placeholder="Ex: calçado, roupa"
              />

              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Tamanho Inicial</Text>
                  <TextInput
                    style={styles.input}
                    value={editTamanhoInicio}
                    onChangeText={setEditTamanhoInicio}
                    keyboardType="numeric"
                    placeholder="Ex: 38"
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Tamanho Final</Text>
                  <TextInput
                    style={styles.input}
                    value={editTamanhoFim}
                    onChangeText={setEditTamanhoFim}
                    keyboardType="numeric"
                    placeholder="Ex: 44"
                  />
                </View>
              </View>

              {/* Intervalo de tamanhos */}
              {editTamanhoInicio && editTamanhoFim && (
                <View style={{ marginTop: 12 }}>
                  <Text style={styles.label}>Tamanhos Disponíveis</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 8,
                      marginTop: 8,
                    }}
                  >
                    {gerarArrayTamanhos().map((tamanho) => (
                      <TouchableOpacity
                        key={tamanho}
                        onPress={() => toggleIndisponivel(tamanho)}
                        style={{
                          paddingHorizontal: 14,
                          paddingVertical: 8,
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: "#ccc",
                          backgroundColor: indisponiveisSelecionados.includes(
                            tamanho
                          )
                            ? "#dc3545"
                            : "#fff",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: indisponiveisSelecionados.includes(tamanho)
                              ? "#fff"
                              : "#333",
                            fontWeight: "600",
                            fontSize: 14,
                          }}
                        >
                          {tamanho}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#666",
                      marginTop: 8,
                    }}
                  >
                    Clique em um tamanho para marcar como indisponível
                  </Text>
                </View>
              )}

              {/* Imagens da cor selecionada + controles */}
              <View style={{ marginTop: 12 }}>
                {renderImagesForSelectedColor()}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 20,
                  marginBottom: 30,
                }}
              >
                <TouchableOpacity
                  style={styles.botaoCancelar}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botaoSalvar}
                  onPress={() => {
                    // Confirma antes de enviar
                    Alert.alert("Confirmar", "Salvar alterações do produto?", [
                      { text: "Cancelar", style: "cancel" },
                      {
                        text: "Salvar",
                        onPress: updateProdutoOnDB,
                      },
                    ]);
                  }}
                >
                  <Text style={styles.textoBotaoSalvar}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

/* --- estilos (mantive seu visual) --- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  imagem: { width: "100%", marginTop: 20, height: ITEM_HEIGHT },
  indicadores: { position: "absolute", right: 15, top: "25%" },
  indicador: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginVertical: 4,
  },
  indicadorAtivo: { backgroundColor: "#000" },
  infoContainer: {
    backgroundColor: "#f5efe5",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  colorCircleLarge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  nome: { fontSize: 18, fontWeight: "600", color: "#1a1a1a", marginTop: 8 },
  preco: { fontSize: 16, color: "#1a1a1a", marginVertical: 6 },
  botaoDetalhes: {
    backgroundColor: "#001f3f",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 50,
  },
  botaoCarrinho: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 50,
  },
  textoBotaoDetalhes: { color: "#fff", fontSize: 16, fontWeight: "500" },
  textoBotaoCarrinho: { color: "#001f3f", fontSize: 16, fontWeight: "500" },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 10,
  },
  label: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  botaoCancelar: {
    backgroundColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  textoBotaoCancelar: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  botaoSalvar: {
    backgroundColor: "#001f3f",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  textoBotaoSalvar: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
