import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { ScanCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as AWS from "../../awsConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLoggedUser } from "./getLoggedUser";

const { width } = Dimensions.get("window");

const dynamoDB = AWS.dynamoDB;
const s3 = AWS.s3;

// --- Componente Card de Produto ---
const ProductCard = ({ product, onAddToCart }) => (
  <View style={styles.cards}>
    <View style={[styles.desconto]}>
      <View style={[styles.promoValor]}>
        <Text style={[styles.fontKantumruySemiBold, styles.promocao]}>
          {product.discount || "-0% OFF"}
        </Text>
      </View>
    </View>
    <Image
      source={{ uri: product.image }}
      style={styles.image}
      resizeMode="contain"
      onError={() => console.log("Erro ao carregar imagem:", product.image)}
    />
    <View>
      <Text style={[styles.fontKantumruySemiBold, styles.nomeProduto]}>
        {product.name}
      </Text>
    </View>
    <View>
      <Pressable style={styles.botao} onPress={() => onAddToCart(product)}>
        <Text style={[styles.textBotao, styles.fontKantumruySemiBold]}>
          Adicionar ao carrinho
        </Text>
      </Pressable>
    </View>
    <View>
      <Text style={[styles.fontKantumruySemiBold, styles.precoProduto]}>
        {product.precoProdutoText}
      </Text>
      <Text style={[styles.fontKantumruySemiBold, styles.parcelaProduto]}>
        {product.installments}
      </Text>
    </View>
  </View>
);

// --- Componente Principal: HomeScreen ---
export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [banners, setBanners] = useState([]);
  const [lancamentos, setLancamentos] = useState([]);
  const [lastAccessedProducts, setLastAccessedProducts] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  // Estados para o modal de seleção
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [productDetails, setProductDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const lancamentosScrollRef = useRef(null);
  const acessosScrollRef = useRef(null);
  const [fontsLoaded] = useFonts({
    "Kantumruy Pro SemiBold": require("../assets/fonts/KantumruyPro-SemiBold.ttf"),
    "Kantumruy Pro Medium": require("../assets/fonts/KantumruyPro-Medium.ttf"),
  });

  // --- Verificar se o usuário está logado ---
  useEffect(() => {
    const checkUserLogin = async () => {
      try {
        const usuario = await AsyncStorage.getItem("usuarioLogado");
        if (usuario) {
          const usuarioObj = JSON.parse(usuario);
          setUsuarioLogado(usuarioObj);
          setIsUserLoggedIn(true);
          console.log("Usuário logado detectado:", usuarioObj.email);
        } else {
          setUsuarioLogado(null);
          setIsUserLoggedIn(false);
          console.log("Nenhum usuário logado");
        }
      } catch (error) {
        console.error("Erro ao verificar login:", error);
        setUsuarioLogado(null);
        setIsUserLoggedIn(false);
      }
    };
    checkUserLogin();

    // Verificar novamente quando a tela entra em foco
    const unsubscribe = navigation.addListener("focus", checkUserLogin);
    return unsubscribe;
  }, [navigation]);

  // --- Buscar Banners do S3 ---
  useEffect(() => {
    const fetchBannersFromS3 = async () => {
      try {
        setLoadingBanners(true);
        const command = new ListObjectsV2Command({
          Bucket: "banner-olies-sports",
        });
        const data = await s3.send(command);
        if (data.Contents && data.Contents.length > 0) {
          const bannerUrls = await Promise.all(
            data.Contents.map(async (item) => {
              const getObjectCommand = new GetObjectCommand({
                Bucket: "banner-olies-sports",
                Key: item.Key,
              });
              return await getSignedUrl(s3, getObjectCommand, {
                expiresIn: 3600,
              });
            })
          );
          setBanners(bannerUrls);
        } else {
          console.log("Nenhum banner encontrado no bucket");
        }
        setLoadingBanners(false);
      } catch (error) {
        console.error("Erro ao buscar banners:", error);
        setLoadingBanners(false);
      }
    };
    fetchBannersFromS3();
  }, []);

  // --- Buscar Produtos do DynamoDB (últimos 30 dias) ---
  useEffect(() => {
    const fetchProductsFromDynamoDB = async () => {
      try {
        setLoadingProducts(true);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const dataThirtyDaysAgo = thirtyDaysAgo.toISOString().split("T")[0];
        const command = new ScanCommand({
          TableName: "produtos",
          FilterExpression: "dataPublicacao >= :dataLimite",
          ExpressionAttributeValues: {
            ":dataLimite": { S: dataThirtyDaysAgo },
          },
          Limit: 50,
        });
        const data = await dynamoDB.send(command);
        if (data.Items && data.Items.length > 0) {
          const produtosFormatados = data.Items.map((item) => {
            const preco = parseFloat(item.preco?.N || 0);
            const imagensFlat = item.imagens ? JSON.parse(item.imagens.S) : [];
            const primeiraImagem = imagensFlat.length > 0 ? imagensFlat[0] : "";
            return {
              id: item.id.S,
              name: item.nome?.S || "Sem nome",
              price: preco,
              installments:
                item.parcelamento?.S ||
                `ou ${Math.ceil(preco / 100)}x de R$ ${(
                  preco / Math.ceil(preco / 100)
                ).toFixed(2)}`,
              discount: item.desconto?.S || "-0% OFF",
              image: primeiraImagem || "",
              precoProdutoText: `R$ ${preco.toFixed(2)} à vista`,
            };
          });
          setLancamentos(produtosFormatados);
        } else {
          setLancamentos([]);
        }
        setLoadingProducts(false);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setLoadingProducts(false);
      }
    };
    fetchProductsFromDynamoDB();
  }, []);
  

  // --- Carrossel de Banners (auto-scroll) ---
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [banners]);

  // --- Adicionar ao carrinho com verificação de autenticação ---
  // ... (mantém todo o código anterior até a função handleAddToCart)

  // --- Adicionar ao carrinho com verificação de autenticação ---
  const handleAddToCart = async (product) => {
    try {
      console.log("=== INICIANDO ADIÇÃO AO CARRINHO ===");

      // ----- 1. Buscar usuário logado de forma segura -----
      const usuarioRaw = await AsyncStorage.getItem("usuarioLogado");

      console.log(
        "Usuário no AsyncStorage:",
        usuarioRaw ? "Existe" : "NÃO existe"
      );

      if (!usuarioRaw) {
        console.log("USUÁRIO NÃO LOGADO - Exibindo alerta");
        Alert.alert(
          "Você não está logado",
          "Para adicionar ao carrinho, faça login primeiro.",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Fazer login",
              onPress: () => {
                console.log("Navegando para tela de Login");
                navigation.navigate("Login");
              },
            },
          ]
        );
        return;
      }

      // ----- 2. Parse do usuário -----
      const usuarioObj = JSON.parse(usuarioRaw);
      const usuarioId = String(usuarioObj.id);

      console.log("USUÁRIO LOGADO - Processando carrinho");
      console.log("ID do usuário:", usuarioId);
      console.log("Produto a adicionar:", product.name);

      // ----- 3. GERAR ID ÚNICO COM TIMESTAMP (SEMPRE NOVO) -----
      const timestamp = Date.now();
      const carrinhoItemId = `${usuarioId}_${product.id}_${timestamp}`;

      console.log("🆔 ID único gerado:", carrinhoItemId);

      // ----- 4. Salvar no DynamoDB PRIMEIRO (fonte da verdade) -----
      try {
        const precoFormatado = parseFloat(product.price || 0).toFixed(1);

        const carrinhoItem = {
          id: { S: String(carrinhoItemId) }, // ✅ ID único com timestamp
          usuarioId: { S: String(usuarioId) },
          produtoId: { S: String(product.id) },
          nomeProduto: { S: String(product.name || "Produto sem nome") },
          preco: { N: String(precoFormatado) },
          imagem: { S: String(product.image || "") },
          quantidade: { N: "1" },
          dataAdicionado: { S: new Date().toISOString() },
        };

        const putCommand = new PutItemCommand({
          TableName: "carrinho",
          Item: carrinhoItem,
        });

        await dynamoDB.send(putCommand);
        console.log("✅ Produto salvo no DynamoDB com sucesso");

        // ----- 5. Sucesso -----
        Alert.alert("Sucesso", "Produto adicionado ao carrinho!", [
          {
            text: "OK",
            onPress: () => console.log("=== ADIÇÃO AO CARRINHO CONCLUÍDA ==="),
          },
        ]);
      } catch (dbError) {
        console.error("❌ Erro ao salvar no DynamoDB:", dbError);
        Alert.alert(
          "Erro",
          "Não foi possível adicionar o produto ao carrinho. Tente novamente."
        );
      }
    } catch (error) {
      console.error("❌ Erro geral ao adicionar ao carrinho:", error);
      Alert.alert("Erro", "Não foi possível adicionar o produto ao carrinho.");
    }
  };

  useEffect(() => {
    const debug = async () => {
      console.log("===== DEBUG ASYNCSTORAGE =====");
      const keys = await AsyncStorage.getAllKeys();
      console.log("Todas as chaves:", keys);

      const usuario = await AsyncStorage.getItem("usuarioLogado");
      console.log("usuarioLogado bruto:", usuario);
    };

    debug();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView
      contentContainerStyle={{ alignItems: "center" }}
      style={styles.container}
    >
      {/* Área de Pesquisa e Logo */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.input, styles.fontKantumruy]}
          placeholder="Pesquisar..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#A3A3A3"
        />
        <Image
          source={{
            uri: "https://olies-ports.s3.us-east-1.amazonaws.com/img/logotipo.png",
          }}
          style={styles.logo}
        />
      </View>

      {/* Carrossel de Banner */}
      {loadingBanners ? (
        <View style={styles.bannerContainer}>
          <ActivityIndicator size="large" color="#052242" />
        </View>
      ) : banners.length > 0 ? (
        <TouchableOpacity
          onPress={() => navigation.navigate("ListaDesejos")}
          style={styles.bannerContainer}
        >
          <Image
            source={{ uri: banners[currentBannerIndex] }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      ) : null}

      {/* Indicadores de página do banner */}
      {banners.length > 1 && (
        <View style={styles.paginationContainer}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                currentBannerIndex === index
                  ? styles.activeDot
                  : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      )}

      {/* Categorias */}
      <View style={styles.categoriesContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Categorias")}>
          <View style={styles.categoryButton}>
            <View style={styles.categoryCircle}>
              <Image
                source={require("../assets/calcados.jpg")}
                style={styles.categoryIcon}
              />
            </View>
            <Text style={[styles.categoryText, styles.fontKantumruy]}>
              Calçados
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Categorias")}>
          <View style={styles.categoryButton}>
            <View style={styles.categoryCircle}>
              <Image
                source={require("../assets/esportes.jpg")}
                style={styles.categoryIcon}
              />
            </View>
            <Text style={[styles.categoryText, styles.fontKantumruy]}>
              Esportes
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.categoryButton}>
          <View style={styles.categoryCircle}>
            <Image
              source={require("../assets/acessorios.jpg")}
              style={styles.categoryIcon}
            />
          </View>
          <Text style={[styles.categoryText, styles.fontKantumruy]}>
            Acessórios
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Categorias")}>
          <View style={styles.categoryButton}>
            <View style={styles.categoryCircle}>
              <Image
                source={require("../assets/feminino-ico.jpg")}
                style={styles.categoryIcon}
              />
            </View>
            <Text style={[styles.categoryText, styles.fontKantumruy]}>
              Feminino
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Categorias")}>
          <View style={styles.categoryButton}>
            <View style={styles.categoryCircle}>
              <Image
                source={require("../assets/vertodos.jpg")}
                style={styles.categoryIcon}
              />
            </View>
            <Text style={[styles.categoryText, styles.fontKantumruySemiBold]}>
              Ver todos
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Cabeçalho Lançamentos */}
      <View style={styles.lancamentosContainer}>
        <Text style={[styles.lancamentosText, styles.fontKantumruyMedium]}>
          Lançamentos
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Categorias")}>
          <Text style={[styles.verTodos, styles.fontKantumruySemiBold]}>
            Ver todos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Carrossel de Lançamentos */}
      {loadingProducts ? (
        <View style={[styles.containerCarrossel, { justifyContent: "center" }]}>
          <ActivityIndicator size="large" color="#052242" />
        </View>
      ) : lancamentos.length > 0 ? (
        <View style={styles.containerCarrossel}>
          <ScrollView
            ref={lancamentosScrollRef}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            {lancamentos.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </ScrollView>
        </View>
      ) : (
        <View style={[styles.containerCarrossel, { justifyContent: "center" }]}>
          <Text style={styles.fontKantumruy}>Nenhum lançamento disponível</Text>
        </View>
      )}

      {/* Cabeçalho Últimos Acessos */}
      <View style={styles.contUltimosAcessos}>
        <Text style={[styles.ultimosAcessosText, styles.fontKantumruyMedium]}>
          Últimos produtos acessados
        </Text>
      </View>

      {/* Carrossel de Últimos Acessos */}
      <View style={styles.containerCarrossel}>
        <ScrollView
          ref={acessosScrollRef}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {lastAccessedProducts.length > 0 ? (
            lastAccessedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))
          ) : (
            <Text style={styles.fontKantumruy}>Nenhum produto acessado</Text>
          )}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F3ECE2",
  },
  fontKantumruySemiBold: {
    fontFamily: "Kantumruy Pro SemiBold",
  },
  fontKantumruyMedium: {
    fontFamily: "Kantumruy Pro Medium",
  },
  fontKantumruy: {
    fontFamily: "Kantumruy Pro Medium",
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 70,
    marginVertical: 20,
  },
  searchContainer: {
    flexDirection: "row",
    width: "90%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: 60,
    marginTop: 40,
    marginBottom: 10,
  },
  logo: {
    width: 77,
    height: 40,
    marginLeft: 10,
  },
  bannerContainer: {
    width: width * 0.95,
    height: width * 0.95 * (293 / 440),
    alignSelf: "center",
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#052242",
  },
  inactiveDot: {
    backgroundColor: "#ccc",
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    paddingVertical: 18,
    backgroundColor: "#F3ECE2",
    marginBottom: 8,
  },
  categoryButton: {
    alignItems: "center",
  },
  categoryCircle: {
    backgroundColor: "#F7F6F3",
    borderRadius: 40,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  categoryIcon: {
    width: 34,
    height: 34,
  },
  categoryText: {
    fontSize: 14,
    color: "#A3A3A3",
    fontWeight: "bold",
    textAlign: "center",
  },
  lancamentosContainer: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  lancamentosText: {
    fontSize: 18,
    fontFamily: "Kantumruy Pro Medium",
    color: "#9D9D9D",
  },
  verTodos: {
    fontSize: 14,
    color: "#052242",
  },
  cards: {
    backgroundColor: "white",
    height: 242,
    width: 165,
    padding: 2,
    borderRadius: 10,
    marginBottom: 30,
    alignItems: "center",
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 10,
  },
  promocao: {
    backgroundColor: "#052242",
    color: "white",
    textAlign: "center",
    width: 68,
    padding: 1,
    fontSize: 12,
    borderRadius: 5,
  },
  desconto: {
    width: "100%",
    alignItems: "flex-start",
    paddingLeft: 10,
    paddingTop: 10,
  },
  promoValor: {
    width: "100%",
  },
  nomeProduto: {
    color: "#9D9D9D",
    textAlign: "center",
  },
  precoProduto: {
    color: "#696969",
    textAlign: "center",
    fontSize: 16,
  },
  parcelaProduto: {
    color: "#A3A3A3",
    textAlign: "center",
    fontSize: 10,
  },
  botao: {
    backgroundColor: "#fff",
    borderColor: "#052242",
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 19,
  },
  textBotao: {
    color: "#052242",
    fontSize: 10,
  },
  containerCarrossel: {
    width: "100%",
    paddingVertical: 20,
    backgroundColor: "#F3ECE2",
  },
  scrollContainer: {
    paddingHorizontal: 10,
    gap: 20,
    marginLeft: 10,
    paddingRight: 10,
  },
  contUltimosAcessos: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  ultimosAcessosText: {
    fontSize: 18,
    fontFamily: "Kantumruy Pro Medium",
    color: "#9D9D9D",
  },
});
