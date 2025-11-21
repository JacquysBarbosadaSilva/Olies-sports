// Produtos.js
import React, { useState, useRef, useEffect } from "react";
import "react-native-get-random-values";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  FlatList,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { useNavigation } from "@react-navigation/native";
// import awsConfig, { dynamoDB, s3, BUCKET_NAME, REGION } from "../../awsConfig";
import { v4 as uuid } from "uuid";
import * as AWS from "../../awsConfig";

const dynamoDB = AWS.dynamoDB;
const s3 = AWS.s3;
const BUCKET_NAME = AWS.BUCKET_NAME;
const REGION = AWS.REGION;

const ROUPA_OPCOES = ["PP", "P", "M", "G", "GG", "XG"];
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function Produtos() {
  const fetchProdutos = async () => {
    try {
      const params = {
        TableName: "produtos",
      };

      const data = await dynamoDB.send(new ScanCommand(params));

      const items = (data.Items || []).map((item) => ({
        id: item.id.S,
        nome: item.nome.S,
        preco: Number(item.preco.N),
        descricao: item.descricao.S,
        tipo: item.tipo.S,
        cores: JSON.parse(item.cores.S),
        tamanhos: JSON.parse(item.tamanhos.S),
        imagensFlat: JSON.parse(item.imagens.S),
      }));

      setProdutos(items);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);
  const navigation = useNavigation();

  const abrirProduto = (item) => {
    navigation.navigate("InfoProduto", { produto: item });
  };

  // estados do modal / formulário
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [corInput, setCorInput] = useState("");
  const [hexInput, setHexInput] = useState("");
  // público-alvo (pode ter vários)
  const [publicoInput, setPublicoInput] = useState("");
  const [publicoAlvo, setPublicoAlvo] = useState([]);

  // tipo: calcado | roupa
  const [tipo, setTipo] = useState("calcado");

  // tamanhos
  const [inicioCalc, setInicioCalc] = useState("");
  const [fimCalc, setFimCalc] = useState("");
  const [indisponiveisCalc, setIndisponiveisCalc] = useState([]);
  const [indisponiveisRoupa, setIndisponiveisRoupa] = useState([]);

  // cores: cada cor { id, cor, hex, imagens: [ { uri, fileName } ] }
  const [cores, setCores] = useState([]);

  // lista de produtos salvos (aparece na tela principal)
  const [produtos, setProdutos] = useState([]);

  // ajuda: gera array de números inclusive
  const gerarIntervalo = (inicio, fim) => {
    const a = parseInt(inicio, 10);
    const b = parseInt(fim, 10);
    if (Number.isNaN(a) || Number.isNaN(b) || a > b) return [];
    const arr = [];
    for (let i = a; i <= b; i++) arr.push(i);
    return arr;
  };

  const handleAddPublico = () => {
    if (!publicoInput.trim()) {
      return Alert.alert("Público-alvo obrigatório", "Digite um valor.");
    }
    setPublicoAlvo((prev) => [...prev, publicoInput.trim()]);
    setPublicoInput("");
  };

  const removePublico = (item) => {
    setPublicoAlvo((prev) => prev.filter((p) => p !== item));
  };

  // Toggle indisponível (calcado)
  const toggleIndisponivelCalc = (size) => {
    setIndisponiveisCalc((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Toggle indisponível (roupa)
  const toggleIndisponivelRoupa = (size) => {
    setIndisponiveisRoupa((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Adicionar nova cor vazia
  const handleAddColor = () => {
    if (!hexInput.trim()) {
      Alert.alert(
        "HEX obrigatório",
        "Preencha o campo HEX antes de adicionar uma cor."
      );
      return; // impede continuar
    }
    if (!corInput.trim()) return Alert.alert("Insira o nome da cor");
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    const newColor = {
      id,
      cor: corInput.trim(),
      hex: hexInput || null,
      imagens: [],
    };
    setCores((p) => [...p, newColor]);
    setCorInput("");
    setHexInput("");
  };

  // Remover cor
  const handleRemoveColor = (colorId) => {
    setCores((p) => p.filter((c) => c.id !== colorId));
  };

  // Pick images FOR A GIVEN COLOR (uses ImagePicker allowsMultipleSelection)
  const pickImagesForColor = async (colorId) => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (res.canceled) return;
      const assets = res.assets || [];
      setCores((prev) =>
        prev.map((c) =>
          c.id === colorId ? { ...c, imagens: [...c.imagens, ...assets] } : c
        )
      );
    } catch (err) {
      console.error(err);
      Alert.alert("Erro ao selecionar imagens");
    }
  };

  const uploadToS3 = async (productId, file) => {
    try {
      const response = await fetch(file.uri);
      const arrayBuffer = await response.arrayBuffer();

      const ext = (file.fileName && file.fileName.split(".").pop()) || "jpg";

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
      console.error("S3 upload error:", err);
      return null;
    }
  };

  const saveToDynamoDB = async (product) => {
    try {
      const params = {
        TableName: "produtos",
        Item: {
          id: { S: String(product.id) },
          nome: { S: product.nome },
          preco: { N: String(product.preco) },
          descricao: { S: product.descricao || "" },
          tipo: { S: product.tipo },
          cores: { S: JSON.stringify(product.cores) },
          tamanhos: { S: JSON.stringify(product.tamanhos) },
          imagens: { S: JSON.stringify(product.imagensFlat || []) },
        },
      };

      await dynamoDB.send(new PutItemCommand(params));
    } catch (err) {
      console.error("DynamoDB save error:", err);
      throw err;
    }
  };

  const handleSaveProduct = async () => {
    if (!nome.trim()) return Alert.alert("Nome obrigatório");
    if (!preco || Number.isNaN(Number(preco)))
      return Alert.alert("Preço inválido");
    if (!cores.length)
      return Alert.alert("Adicione pelo menos uma cor com imagens");

    // montar tamanhos
    let tamanhosObj = {};
    if (tipo === "calcado") {
      const inicio = parseInt(inicioCalc, 10);
      const fim = parseInt(fimCalc, 10);
      if (Number.isNaN(inicio) || Number.isNaN(fim) || inicio > fim)
        return Alert.alert("Intervalo de calçado inválido");
      tamanhosObj = {
        tipo: "calcado",
        intervalo: { inicio, fim },
        indisponiveis: indisponiveisCalc,
      };
    } else {
      tamanhosObj = {
        tipo: "roupa",
        opcoes: ROUPA_OPCOES,
        indisponiveis: indisponiveisRoupa,
      };
    }

    const productId = Date.now().toString();

    const coresParaSalvar = [];
    const imagensFlat = [];
    let uploadFailed = false;

    for (const color of cores) {
      const uploadedUrls = [];
      for (const img of color.imagens) {
        const url = await uploadToS3(productId, img);
        if (url) {
          uploadedUrls.push(url);
          imagensFlat.push(url);
        } else {
          uploadFailed = true;
        }
      }
      coresParaSalvar.push({
        cor: color.cor,
        hex: color.hex || null,
        imagens: uploadedUrls,
      });
    }
    if (uploadFailed) {
      Alert.alert(
        "Atenção",
        "Algumas imagens falharam no upload. Produto salvo sem elas."
      );
    }

    const productData = {
      id: productId,
      nome: nome.trim(),
      preco: parseFloat(preco),
      descricao,
      tipo,
      cores: coresParaSalvar,
      tamanhos: tamanhosObj,
      imagensFlat,
    };

    try {
      await saveToDynamoDB(productData);

      // adicionar à lista local de produtos (aparece na tela principal)
      setProdutos((prev) => [productData, ...prev]);

      // reset form
      setModalVisible(false);
      setNome("");
      setPreco("");
      setDescricao("");
      setCores([]);
      setInicioCalc("");
      setFimCalc("");
      setIndisponiveisCalc([]);
      setIndisponiveisRoupa([]);

      Alert.alert(
        "Sucesso",
        "Produto e imagens salvas! Agora você pode ver o card na tela principal."
      );
    } catch (err) {
      console.error("Erro final ao salvar produto:", err);
      Alert.alert("Erro fatal", "Erro ao salvar o produto no banco de dados.");
    }
  };

  // Componente interno: card de produto com carrossel automático
  const ProductCard = ({ produto }) => {
    const scrollRef = useRef(null);
    const indexRef = useRef(0);
    const intervalRef = useRef(null);

    const imagens =
      produto.imagensFlat && produto.imagensFlat.length
        ? produto.imagensFlat
        : [];

    useEffect(() => {
      if (!imagens.length) return;

      // auto-scroll
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        indexRef.current = (indexRef.current + 1) % imagens.length;
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            x: indexRef.current * (SCREEN_WIDTH * 0.44), // largura da imagem no card
            animated: true,
          });
        }
      }, 2500);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }, [produto]);

    return (
      <View style={styles.card}>
        <View style={styles.cardImageWrap}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: "center" }}
          >
            {imagens.length ? (
              imagens.map((url, i) => (
                <Image
                  key={i}
                  source={{ uri: url }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
              ))
            ) : (
              <View
                style={[
                  styles.cardImage,
                  { justifyContent: "center", alignItems: "center" },
                ]}
              >
                <Text>Sem imagem</Text>
              </View>
            )}
          </ScrollView>
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {produto.nome}
          </Text>
          <Text style={styles.cardPrice}>
            R$ {Number(produto.preco).toFixed(2)}
          </Text>
          {!!produto.descricao && (
            <Text style={styles.cardDesc} numberOfLines={2}>
              {produto.descricao}
            </Text>
          )}
        </View>
      </View>
    );
  };

  // UI principal
  return (
    <View style={{ flex: 1, backgroundColor: "#f6f3ee" }}>
      {/* Lista de produtos no topo */}
      <View style={{ padding: 12 }}>
        {produtos.length === 0 ? (
          <Text style={{ color: "#666", marginBottom: 8 }}>
            Nenhum produto ainda. Clique em + para adicionar.
          </Text>
        ) : (
          <FlatList
            key={"2columns"} // 👈 IMPORTANTE: evita o erro do numColumns
            data={produtos}
            numColumns={2}
            keyExtractor={(item) => item.id}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: 12,
            }}
            contentContainerStyle={{ paddingBottom: 120 }}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => abrirProduto(item)}>
                <ProductCard produto={item} />
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Botão + */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Modal simples (overlay) */}
      {modalVisible && (
        <View style={styles.modal}>
          <ScrollView>
            <Text style={styles.modalTitle}>Novo Produto</Text>

            <TextInput
              placeholder="Nome"
              value={nome}
              onChangeText={setNome}
              style={styles.input}
            />
            <TextInput
              placeholder="Preço"
              value={preco}
              onChangeText={setPreco}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Descrição"
              value={descricao}
              onChangeText={setDescricao}
              style={[styles.input, { height: 80 }]}
              multiline
            />

            <Text style={[styles.label, { marginTop: 12 }]}>
              Público-alvo
            </Text>

            <View style={{ flexDirection: "row", gap: 8 }}>
              <TextInput
                placeholder="Ex: Masculino, Feminino..."
                value={publicoInput}
                onChangeText={setPublicoInput}
                style={[styles.input, { flex: 1 }]}
              />

              <TouchableOpacity
      
                onPress={handleAddPublico}
              >
                <Text style={styles.tipoBtnpublico}>Adicionar</Text>
              </TouchableOpacity>
            </View>

            {/* lista */}
            <View style={{ marginTop: 8 }}>
              {publicoAlvo.map((p, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#eee",
                    padding: 8,
                    borderRadius: 8,
                    marginBottom: 6,
                  }}
                >
                  <Text style={{ flex: 1 }}>{p}</Text>

                  <TouchableOpacity
                    onPress={() => removePublico(p)}
                    style={{
                      backgroundColor: "#d33",
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 6,
                    }}
                  >
                    <Text style={{ color: "#fff" }}>Remover</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <Text style={styles.label}>Tipo</Text>
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 8 }}>
              <TouchableOpacity
                style={[
                  styles.tipoBtn,
                  tipo === "calcado" && styles.tipoBtnAtivo,
                ]}
                onPress={() => setTipo("calcado")}
              >
                <Text
                  style={
                    tipo === "calcado" ? styles.tipoTextAtivo : styles.tipoText
                  }
                >
                  Calçado
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tipoBtn,
                  tipo === "roupa" && styles.tipoBtnAtivo,
                ]}
                onPress={() => setTipo("roupa")}
              >
                <Text
                  style={
                    tipo === "roupa" ? styles.tipoTextAtivo : styles.tipoText
                  }
                >
                  Roupa
                </Text>
              </TouchableOpacity>
            </View>

            {/* tamanhos dinamicos */}
            {tipo === "calcado" && (
              <>
                <Text style={styles.label}>Intervalo (ex: 38 - 44)</Text>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TextInput
                    placeholder="Início"
                    value={inicioCalc}
                    onChangeText={setInicioCalc}
                    style={[styles.input, { flex: 1 }]}
                    keyboardType="numeric"
                  />
                  <TextInput
                    placeholder="Fim"
                    value={fimCalc}
                    onChangeText={setFimCalc}
                    style={[styles.input, { flex: 1 }]}
                    keyboardType="numeric"
                  />
                </View>

                <Text style={[styles.label, { marginTop: 10 }]}>
                  Marcar indisponíveis
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {gerarIntervalo(inicioCalc, fimCalc).map((s) => {
                    const disabled = indisponiveisCalc.includes(s);
                    return (
                      <TouchableOpacity
                        key={s}
                        onPress={() => toggleIndisponivelCalc(s)}
                        style={[
                          styles.sizeBox,
                          disabled && styles.sizeBoxDisabled,
                        ]}
                      >
                        <Text
                          style={[
                            styles.sizeBoxText,
                            disabled && { opacity: 0.5 },
                          ]}
                        >
                          {s}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            )}

            {tipo === "roupa" && (
              <>
                <Text style={styles.label}>Marcar indisponíveis (roupa)</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {ROUPA_OPCOES.map((sz) => {
                    const disabled = indisponiveisRoupa.includes(sz);
                    return (
                      <TouchableOpacity
                        key={sz}
                        onPress={() => toggleIndisponivelRoupa(sz)}
                        style={[
                          styles.sizeBox,
                          disabled && styles.sizeBoxDisabled,
                        ]}
                      >
                        <Text
                          style={[
                            styles.sizeBoxText,
                            disabled && { opacity: 0.5 },
                          ]}
                        >
                          {sz}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            )}

            {/* Cores */}
            <Text style={[styles.label, { marginTop: 12 }]}>
              Adicionar cor (cada cor tem imagens)
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TextInput
                placeholder="Nome da cor"
                value={corInput}
                onChangeText={setCorInput}
                style={[styles.input, { flex: 1 }]}
              />
              <TextInput
                placeholder="#hex"
                value={hexInput}
                onChangeText={setHexInput}
                style={[styles.input, { width: 100 }]}
              />
            </View>
            <TouchableOpacity
              style={[styles.pickButton, { marginTop: 8 }]}
              onPress={handleAddColor}
            >
              <Text style={styles.pickText}>Adicionar cor</Text>
            </TouchableOpacity>

            {/* Cores list */}
            <View style={{ marginTop: 12 }}>
              {cores.map((color) => (
                <View key={color.id} style={styles.colorRow}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      flex: 1,
                    }}
                  >
                    <View
                      style={[
                        styles.colorCircle,
                        color.hex
                          ? { backgroundColor: color.hex }
                          : { backgroundColor: "#eee" },
                      ]}
                    />
                    <Text style={{ flex: 1 }}>{color.cor}</Text>
                    <TouchableOpacity
                      onPress={() => pickImagesForColor(color.id)}
                      style={styles.smallBtn}
                    >
                      <Text style={{ color: "#fff" }}>+ Imagens</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleRemoveColor(color.id)}
                      style={[
                        styles.smallBtn,
                        { backgroundColor: "#ccc", marginLeft: 8 },
                      ]}
                    >
                      <Text>Excluir</Text>
                    </TouchableOpacity>
                  </View>

                  {/* thumbnails */}
                  <ScrollView horizontal style={{ marginTop: 8 }}>
                    {color.imagens.map((img, idx) => (
                      <Image
                        key={idx}
                        source={{ uri: img.uri }}
                        style={styles.preview}
                      />
                    ))}
                  </ScrollView>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProduct}
            >
              <Text style={styles.saveButtonText}>Salvar Produto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text>Fechar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

/* --- estilos --- */
const styles = StyleSheet.create({
  addButton: {
    backgroundColor: "#001f3f",
    position: "absolute",
    bottom: 18,
    right: 18,
    width: 60,
    height: 60,
    borderRadius: 30,
    zIndex: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontSize: 34 },
  modal: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#F3ECE2",
    padding: 16,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#F3ECE2",
    padding: 20,
    borderRadius: 20,
    maxHeight: "90%",
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#001f3f",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#001f3f",
  },

  tipoBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: "#e4ded4",
  },

  tipoBtnAtivo: {
    backgroundColor: "#001f3f",
  },

  tipoBtnpublico: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: "#001f3f",
    color: "#fff",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
  },

  tipoText: {
    color: "#001f3f",
    fontWeight: "600",
  },
  tipoTextAtivo: {
    color: "#fff",
    fontWeight: "700",
  },
  sizeBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#001f3f",
    margin: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },

  sizeBoxDisabled: {
    backgroundColor: "#d9d9d9",
    borderColor: "#888",
  },

  sizeBoxText: {
    fontSize: 16,
    color: "#001f3f",
  },
  pickButton: {
    backgroundColor: "#001f3f",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  pickText: {
    color: "#fff",
    fontWeight: "600",
  },

  colorRow: {
    marginBottom: 16,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#aaa",
  },
  smallBtn: {
    backgroundColor: "#001f3f",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },

  preview: {
    width: 75,
    height: 75,
    borderRadius: 10,
    marginRight: 8,
  },

  saveButton: {
    backgroundColor: "#001f3f",
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 20,
    alignItems: "center",
  },

  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  closeButton: {
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 12,
    backgroundColor: "#e4ded4",
    alignItems: "center",
  },
  sizeBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  sizeBoxDisabled: { backgroundColor: "#f7f7f7", opacity: 0.6 },
  sizeBoxText: { fontWeight: "600" },

  /* --- estilos dos cards --- */
  card: {
    width: SCREEN_WIDTH * 0.46,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardImageWrap: {
    height: 140,
    backgroundColor: "#f2f2f2",
  },
  cardImage: {
    width: SCREEN_WIDTH * 0.44,
    height: 140,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginRight: 6,
  },
  cardInfo: {
    padding: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  cardPrice: {
    color: "#0a8f27",
    fontWeight: "700",
    marginTop: 6,
  },
  cardDesc: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});
