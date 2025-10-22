import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useFonts } from "expo-font";
import { useState } from "react";

// 1. Definição dos dados dos produtos do carrossel
const initialProducts = [
  {
    id: "p1",
    name: "Smartband Samsung Galaxy Fit3 Grafite",
    price: 299.0,
    installments: "ou 2x de R$ 149,50",
    discount: "-30% OFF",
    image: require("../assets/imagem-produto1.jpg"),
    precoProdutoText: "R$299,00 à vista",
  },
  {
    id: "p2",
    name: "Tênis Nike Air Jordan 1 Low SE",
    price: 1139.99,
    installments: "ou 10x de R$ 113,99",
    discount: "-5% OFF",
    image: require("../assets/imagem-produto2.png"),
    precoProdutoText: "R$1139,99 à vista",
  },
  {
    id: "p3",
    name: "Tênis Nike Flex Experience Run 12",
    price: 1199.99,
    installments: "ou R$1079,99 no pix",
    discount: "-10% OFF",
    image: require("../assets/imagem-produto3.png"),
    precoProdutoText: "R$ 1199,99 à vista",
  },
];

const lastAccessedProducts = [
  {
    id: "p4",
    name: "Tênis adidas RunFalcon 5 Masculino",
    price: 279.99,
    installments: "ou 4x de R$ 64,99",
    discount: "-30% OFF",
    image: require("../assets/imagem-produto4.png"),
    precoProdutoText: "279,99 à vista",
  },
  {
    id: "p5",
    name: "Kit Meia Adidas Cano Baixo c/ 6 Pares - Br...",
    price: 66.49,
    installments: "ou 2x de R$ 33,29",
    discount: "-53% OFF",
    image: require("../assets/imagem-produto5.png"),
    precoProdutoText: "66,49 à vista",
  },
  {
    id: "p6",
    name: "Smartband Samsung Galaxy Fit3 Grafite",
    price: 299.0,
    installments: "ou 2x de R$ 149,50",
    discount: "-5% OFF",
    image: require("../assets/imagem-produto1.jpg"),
    precoProdutoText: "R$299,00 à vista",
  },
];

// Componente Card de Produto para reutilização
const ProductCard = ({ product, onAddToCart }) => (
  <View style={styles.cards}>
    <View style={[styles.desconto]}>
      <View style={[styles.promoValor]}>
        <Text style={[styles.fontKantumruySemiBold, styles.promocao]}>
          {product.discount}
        </Text>
      </View>
    </View>
    <Image source={product.image} style={styles.image} resizeMode="contain" />
    <View>
      <Text style={[styles.fontKantumruySemiBold, styles.nomeProduto]}>
        {product.name}
      </Text>
    </View>
    <View>
      {/* 3. Chamada da função com os dados do produto */}
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

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [fontsLoaded] = useFonts({
    "Kantumruy Pro SemiBold": require("../assets/fonts/KantumruyPro-SemiBold.ttf"),
    "Kantumruy Pro Medium": require("../assets/fonts/KantumruyPro-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  // 2. Função para adicionar ao carrinho e navegar
  const handleAddToCart = (product) => {
    // Navega para a tela 'Carrinho' e passa os dados do item
    // A tela de Carrinho precisará implementar a lógica para receber este item
    navigation.navigate("Carrinho", { newItem: product });
    console.log("Adicionado ao carrinho:", product.name);
  };

  return (
    <ScrollView
      contentContainerStyle={{ alignItems: "center" }}
      style={styles.container}
    >
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.input, styles.fontKantumruy]}
          placeholder="Pesquisar..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#A3A3A3"
        />
        <Image source={require("../assets/logotipo.png")} style={styles.logo} />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("Pagamento")}>
        <View style={styles.banner}>
          <Image
            source={require("../assets/banner-promocao.jpg")}
            style={styles.bannerPromocao}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>

      <View style={styles.categoriesContainer}>
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
      </View>

      <View>
        <View style={styles.lancamentosContainer}>
          <Text style={[styles.lancamentosText, styles.fontKantumruyMedium]}>
            Lançamentos
          </Text>
          <Text style={[styles.verTodos, styles.fontKantumruySemiBold]}>
            Ver todos
          </Text>
        </View>
      </View>

      {/* Carrossel de Lançamentos */}
      <View style={styles.containerCarrossel}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {initialProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.contUltimosAcessos}>
        <Text style={[styles.ultimosAcessosText, styles.fontKantumruyMedium]}>
          Últimos produtos acessados
        </Text>
      </View>

      {/* Carrossel de Últimos Acessos */}
      <View style={styles.containerCarrossel}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {lastAccessedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
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
  banner: {
    width: 440,
    height: 293,
    alignSelf: "center",
  },
  bannerPromocao: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
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
    fontFamily: "KantumruyPro-SemiBold",
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
    // IOS
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    //Android
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
    flex: 1,
    paddingVertical: 20,
    backgroundColor: "#F3ECE2",
    marginRight: 20,
  },
  scrollContainer: {
    paddingHorizontal: 10,
    gap: 20,
    marginLeft: 10,
  },

  contUltimosAcessos: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  ultimosAcessosText: {
    fontSize: 18,
    fontFamily: "KantumruyPro-SemiBold",
    color: "#9D9D9D",
  },

  logo: {
    width: 77,
    height: 40,
    marginLeft: 10,
  },
});
