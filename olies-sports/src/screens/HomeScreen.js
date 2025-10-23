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

const logoUrl = "https://olies-ports.s3.us-east-1.amazonaws.com/img/logotipo.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZYPPXAY4RCJUVETB%2F20251022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251022T213109Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEH4aCXVzLWVhc3QtMSJHMEUCIF5r9n3SlIlwrWIih6WGQBbM0tGPsmu0u7PQwsqhz%2BPlAiEAzLnLGZ5HWc0lLBpQCkn8Ylt59i%2BhXca%2BCmKpOjpOQeIqgwMINxAAGgw2NzEwNTQ0OTczMzciDDFO1pKJNryxXbCVoyrgAmMmOaS%2BflOGH6QAoaH6tzhwkvCfOw1wekhWdxd6GUAlmfhHfXztqglXHvi2%2FQTpdwpgBqVFOX54Jr9tA%2FG%2BhCyO9tJQWvEGsSpNrutHIdNSftmozjutyzZYH6KLii%2BZaAP%2BCN3lYeN%2FB%2FJLvosSMsCPw7pxl6xzcYL4d6GTtqsKlK6Kcv%2BDODZWmZe3jPJKj1%2FjO%2B203fQN9Dtx1ggorUTAuKfTXzaCnYvkpRPCJ2F6052rKZnjND%2FGmyvflyFr7JnTgKF3HVI164zMpxtFN%2BspzP5UBHMui0wtJR7XtVQbr8rytz4f6DYoDmL4RVxX0uGr2%2BCK1b6tGzOiEdLBsgZ21Z0e4%2Fl%2FjG%2FuxejOUZfQwhJpHnY5kbMu1oyYUKvuKTsyAgktsLbNkMG1WuopiJXaQKj%2Fcl%2BH0x0KXYz3q8mttq8QUpqOmh9rnkc6DxEMGmIWHzB9rLtRvhN7uc9PWXQwgNzkxwY6hwKiJY9COGoIhCXtEd48aip89g9td2xbtd54Ojr2N4wznAW2oK1ufZ9OTiMIo8tuOL%2BUhJigtU3KxkJugU2JVjLAnDctb6AImhjY4ULdlqxP35%2FI3LHaM1t5Wiw7ltZ3laOJ0FsSDiNt693oroD3pSBxs%2B4R01ye3Ra62%2B7w7wkJxGLcPLOHraDS36OLrSQh4jOAjiOey%2BrKt7t6QaiJgFu4qRVWLA23wQzhYTMRNpTzaTzU26pewVPuRhE5y7X82XqNiNdum8vVwd2KO6ZHlOWxKDqhiOV4PnOoNYGuDj99HpOK6hE8UIThBdCQAshDTd6VKPUYsMEc%2FQZQWUvQHDSYA31Mc7nikQ%3D%3D&X-Amz-Signature=11eb26d8eb399b6d2f91c9721a92839350d8a784acefe0d988a547de57c03b6f&X-Amz-SignedHeaders=host&response-content-disposition=inline";


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
        <Image source={{uri: logoUrl}} style={styles.logo} />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("ListaDesejos")}>
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
