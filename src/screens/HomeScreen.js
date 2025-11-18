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
} from "react-native";
import { useFonts } from "expo-font";
// Não precisamos mais do Ionicons, mas o mantemos caso seja necessário para outros componentes.
import { Ionicons } from '@expo/vector-icons'; 

// Obtém a largura da tela para dimensionar o banner
const { width } = Dimensions.get('window');

// --- 1. Definição de URLs e Dados (MANTIDOS) ---

const bannerUrls = [
    "https://olies-ports.s3.us-east-1.amazonaws.com/img/Banner%20Olie%27s%20Sportes.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZYPPXAY4TBA33C32%2F20251118%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251118T125203Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEP3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIQC61lObM9ncKWc3quq5OXPx20P%2Fi8VVbO0N0JsMfYnyGQIgBsZpapqAgli7uctWRuWyo5QCIQrDt3SF2%2Fy9dVvClI8qjAMIxv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2NzEwNTQ0OTczMzciDAT59gVZ6%2F9eNkHaJCrgAgXIZuQD78Pgzjk336nxRTU5knOOxMH%2FoeHDBhqRCNPG%2F%2BFM8mat9s8FRgKYbpGSpZ5zC3ka4O0Ohdupg5XzYMtFC4JkbMTwbiyMb3du1ZEm27ZKdCiyvGh5sWHs1JBctxKj5DP0ftMK2kdUVpmaCu4VeMtLEbSRJ6mce9rzk7%2FduAzudhSdYbPuu%2B0eUt6ABdm0SZE9gKde0hdkU6%2B759L0aIgZBfrD6RoHhVInUQIH097FvON%2Fc0h9%2FSZpVF955t6ZmR6Nafas7%2FWW6WDKOkpY%2FMETSJ8POtEUyAvL41HyrCxaqtvpOBnrrNu7er8oY9n8Ht%2FJyV6e4ORCY%2B%2Br19MrhG5Cu8KMn9gp0T3DheuKc3fruUfen%2FDsakl0IXZPIam0z1sXeyp5VVlE%2FNlBlU9X%2BJ7TMm68sJLnUhcij21uFkmUNnlzHaiikiI5hXZBB4kD3sxrSHMvsTOkUJ%2F66Xsw7qnxyAY6hwJheseGqrZWZGgRUVjX3%2BeHEwKWtd4yGK8ho7%2BSHSo2uzkBfiMAPXeSHuT1ZRyWZk1mEV0DrPfycQZ0XirEu6H95b2AYFD2tlNLqpLpcD8Rzm76LxjAqPWWHCzNkJBiVkoFUT6AqVcDwCcnSUWTeyEFHSrYZmCKc1zg9ch2bQ2LnKrpa6xJBBFqQ4s3VTUspbmOFOXMfQJdLlHGBkh8OGwyecY5S6aOrQHau8%2BmhCFjmL4VF%2FWSPebEQFM12k88PnXgauko1YIbdahRbvB48SfLGvfOIn6XHsPACBNyvke2kTUxQ39fEf9LzZSLe%2BD0R87Zy%2Bc2gtZJXTyD5lLq9jYXvE4yj7o5JQ%3D%3D&X-Amz-Signature=ebd3a41cfc51f08ee6adbce02a30984a21d4e999f982ca5c6e46c1a70faceea2&X-Amz-SignedHeaders=host&response-content-disposition=inline",
    "https://olies-ports.s3.us-east-1.amazonaws.com/img/banner%20olie%27s%20sports.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZYPPXAY4TBA33C32%2F20251118%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251118T125253Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEP3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIQC61lObM9ncKWc3quq5OXPx20P%2Fi8VVbO0N0JsMfYnyGQIgBsZpapqAgli7uctWRuWyo5QCIQrDt3SF2%2Fy9dVvClI8qjAMIxv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2NzEwNTQ0OTczMzciDAT59gVZ6%2F9eNkHaJCrgAgXIZuQD78Pgzjk336nxRTU5knOOxMH%2FoeHDBhqRCNPG%2F%2BFM8mat9s8FRgKYbpGSpZ5zC3ka4O0Ohdupg5XzYMtFC4JkbMTwbiyMb3du1ZEm27ZKdCiyvGh5sWHs1JBctxKj5DP0ftMK2kdUVpmaCu4VeMtLEbSRJ6mce9rzk7%2FduAzudhSdYbPuu%2B0eUt6ABdm0SZE9gKde0hdkU6%2B759L0aIgZBfrD6RoHhVInUQIH097FvON%2Fc0h9%2FSZpVF955t6ZmR6Nafas7%2FWW6WDKOkpY%2FMETSJ8POtEUyAvL41HyrCxaqtvpOBnrrNu7er8oY9n8Ht%2FJyV6e4ORCY%2B%2Br19MrhG5Cu8KMn9gp0T3DheuKc3fruUfen%2FDsakl0IXZPIam0z1sXeyp5VVlE%2FNlBlU9X%2BJ7TMm68sJLnUhcij21uFkmUNnlzHaiikiI5hXZBB4kD3sxrSHMvsTOkUJ%2F66Xsw7qnxyAY6hwJheseGqrZWZGgRUVjX3%2BeHEwKWtd4yGK8ho7%2BSHSo2uzkBfiMAPXeSHuT1ZRyWZk1mEV0DrPfycQZ0XirEu6H95b2AYFD2tlNLqpLpcD8Rzm76LxjAqPWWHCzNkJBiVkoFUT6AqVcDwCcnSUWTeyEFHSrYZmCKc1zg9ch2bQ2LnKrpa6xJBBFqQ4s3VTUspbmOFOXMfQJdLlHGBkh8OGwyecY5S6aOrQHau8%2BmhCFjmL4VF%2FWSPebEQFM12k88PnXgauko1YIbdahRbvB48SfLGvfOIn6XHsPACBNyvke2kTUxQ39fEf9LzZSLe%2BD0R87Zy%2Bc2gtZJXTyD5lLq9jYXvE4yj7o5JQ%3D%3D&X-Amz-Signature=a1971782e3d47cd9d2adb6919681e55dc286954e7f256dd7a556a931ed211a29&X-Amz-SignedHeaders=host&response-content-disposition=inline",
    "https://olies-ports.s3.us-east-1.amazonaws.com/img/banner%20Olie%27s%20Sportes%20%281%29.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZYPPXAY4VT2YPRB6%2F20251118%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251118T150949Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAAaCXVzLWVhc3QtMSJGMEQCIDW4iV%2FbjlZ9STaKPVdGdqQ%2Futmu16rKjMUb48ipdlX1AiAwxNpzuSRkB7sKT5pb7tTvqOrHrQKuIreLX82TxxjlCSqMAwjI%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDY3MTA1NDQ5NzMzNyIMoaaGXJlneDpjJScrKuAC3uPnaQ3P6F82b1owtgZhp0lm6zyeFYmqT1IxU7la2yLzqQN6mn7Lt3u5u1b0DLeu0H9nsRpaw02DY734k77N%2BGvp%2Fs%2FvRQapP7WlsGZ5Jlpq43ZxEYu4Rp9H7npEvZorlS8Sic%2Fur3XdPkLv79MhogsrxSAX%2Bym75S4hYjLMtTGrisDMg7%2BZ%2B5gfX0lhgiLpudSWbarUv0%2FTyjH8OP5IrvaqsmR6GW4cqzFkUjCdKmhHsGnckRPpnSXNTPJiQiXRtZaxlwfPRTedNcgePrPPqboBdcRRDMpwi0Hm4Zdus%2FnJCZjmtOja5UXLGmWwpgD1AyE8wuPV7wt7dvPBPkrSSQtjcJxzcbWJAvRExUXUaynpN%2FfVCJ0u4WNKnmWD%2FDkllwPDXhOvm8vyYvB5j%2BeMRlPBww3LdoqHCIhD5x7uFLmvxY5sE05dVCmI5Rox%2BlpLh6z5JfnXUj5b7mcM6SUlmDCXlfLIBjqIAg%2BVzo%2FTpkSUESisV%2FF0fF7AFjTEsS%2FiOY%2BBoUr%2BoWQDOC5ocpx2AT%2F%2FTXSm6NDSPiwiWFOil%2FgMn3LNY8XA6m9s%2F%2FdAOYC6BisN%2FZ6H5dh8%2FRwBILz9X23S3ooaMDW%2B8bLxYvvzRfgvIFG4xA8NI%2BC8wzSqXflh03%2FQdpsy%2BSbil%2BKi8aIlN5uwrtXPUom7wDp5LGyn2J2OiLb26hqJG0KQpif8VSamD5lQ32pz81n8IhcYztZzKYY0WBjRtSTMPIyXACv9%2BmfMSu4PO%2BEqQrfIYja83XWX16d03wMQB5Tgx%2FroD%2BYquDj6vtIMMsSBLmGbZE3P2m0bovCtBnSIr7XRKbNCs%2F7HHA%3D%3D&X-Amz-Signature=3ae18f93b3394446f7afe08659b6cd3323c4d04dd6bf4e22b36e572f3b1dcb1a&X-Amz-SignedHeaders=host&response-content-disposition=inline"
];

const initialProducts = [
    {
        id: "p1",
        name: "Smartband Samsung Galaxy Fit3 Grafite",
        price: 289.99,
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

const logoUrl =
    "https://olies-ports.s3.us-east-1.amazonaws.com/img/logotipo.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZYPPXAY4RCJUVETB%2F20251022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251022T213109Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEH4aCXVzLWVhc3QtMSJHMEUCIF5r9n3SlIlwrWIih6WGQBbM0tGPsmu0u7PQwsqhz%2BPlAiEAzLnLGZ5HWc0lLBpQCkn8Ylt59i%2BhXca%2BCmKpOjpOQeIqgwMINxAAGgw2NzEwNTQ0OTczMzciDDFO1pKJNryxXbCVoyrgAmMmOaS%2BflOGH6QAoaH6tzhwkvCfOw1wekhWdxd6GUAlmfhHfXztqglXHvi2%2FQTpdwpgBqVFOX54Jr9tA%2FG%2BhCyO9tJQWvEGsSpNrutHIdNSftmozjutyzZYH6KLii%2BZaAP%2BCN3lYeN%2FB%2FJLvosSMsCPw7pxl6xzcYL4d6GTtqsKlK6Kcv%2BDODZWmZe3jPJKj1%2FjO%2B203fQN9Dtx1ggorUTAuKfTXzaCnYvkpRPCJ2F6052rKZnjND%2FGmyvflyFr7JnTgKF3HVI164zMpxtFN%2BspzP5UBHMui0wtJR7XtVQbr8rytz4f6DYoDmL4RVxX0uGr2%2BCK1b6tGzOiEdLBsgZ21Z0e4%2Fl%2FjG%2FuxejOUZfQwhJpHnY5kbMu1oyYUKvuKTsyAgktsLbNkMG1WuopiJXaQKj%2Fcl%2BH0x0KXYz3q8mttq8QUpqOmh9rnkc6DxEMGmIWHzB9rLtRvhN7uc9PWXQwgNzkxwY6hwKiJY9COGoIhCXtEd48aip89g9td2xbtd54Ojr2N4wznAW2oK1ufZ9OTiMIo8tuOL%2BUhJigtU3KxkJugU2JVjLAnDctb6AImhjY4ULdlqxP35%2FI3LHaM1t5Wiw7ltZ3laOJ0FsSDiNt693oroD3pSBxs%2B4R01ye3Ra62%2B7w7wkJxGLcPLOHraDS36OLrSQh4jOAjiOey%2BrKt7t6QaiJgFu4qRVWLA23wQzhYTMRNpTzaTzU26pewVPuRhE5y7X82XqNiNdum8vVwd2KO6ZHlOWxKDqhiOV4PnOoNYGuDj99HpOK6hE8UIThBdCQAshDTd6VKPUYsMEc%2FQZQWUvQHDSYA31Mc7nikQ%3D%3D&X-Amz-Signature=11eb26d8eb399b6d2f91c9721a92839350d8a784acefe0d988a547de57c03b6f&X-Amz-SignedHeaders=host&response-content-disposition=inline";

// --- Componente Card de Produto (MANTIDO) ---
const ProductCard = ({ product, onAddToCart }) => (
    <View style={styles.cards}>
        <View style={[styles.desconto]}>
            <View style={[styles.promoValor]}>
                <Text style={[styles.fontKantumruySemiBold, styles.promocao]}>{product.discount}</Text>
            </View>
        </View>
        <Image source={product.image} style={styles.image} resizeMode="contain" />
        <View>
            <Text style={[styles.fontKantumruySemiBold, styles.nomeProduto]}>{product.name}</Text>
        </View>
        <View>
            <Pressable style={styles.botao} onPress={() => onAddToCart(product)}>
                <Text style={[styles.textBotao, styles.fontKantumruySemiBold]}>Adicionar ao carrinho</Text>
            </Pressable>
        </View>
        <View>
            <Text style={[styles.fontKantumruySemiBold, styles.precoProduto]}>{product.precoProdutoText}</Text>
            <Text style={[styles.fontKantumruySemiBold, styles.parcelaProduto]}>{product.installments}</Text>
        </View>
    </View>
);

// --- Componente Principal: HomeScreen ---
export default function HomeScreen({ navigation }) {
    const [search, setSearch] = useState("");
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0); 
    
    // Os Refs são mantidos, mas não são usados para rolagem manual com setas
    const lancamentosScrollRef = useRef(null);
    const acessosScrollRef = useRef(null);
    
    // As constantes de rolagem são mantidas, mas a função de scroll não é mais usada
    const CARD_WIDTH = 165; 
    const GAP = 20;
    const SCROLL_AMOUNT = CARD_WIDTH + GAP; 

    const [fontsLoaded] = useFonts({
        "Kantumruy Pro SemiBold": require("../assets/fonts/KantumruyPro-SemiBold.ttf"),
        "Kantumruy Pro Medium": require("../assets/fonts/KantumruyPro-Medium.ttf"),
    });

    // Lógica para o carrossel de banners (auto-scroll a cada 5 segundos) - MANTIDA
    useEffect(() => {
        if (bannerUrls.length > 1) {
            const interval = setInterval(() => {
                setCurrentBannerIndex(prevIndex => (prevIndex + 1) % bannerUrls.length);
            }, 5000); 

            return () => clearInterval(interval); 
        }
    }, []); 
    
    // A função scrollProducts foi removida, pois as setas foram removidas.
    
    const handleAddToCart = (product) => {
        navigation.navigate("Carrinho", { newItem: product });
        console.log("Adicionado ao carrinho:", product.name);
    };

    if (!fontsLoaded) {
        return null;
    }

    return (
        <ScrollView contentContainerStyle={{ alignItems: "center" }} style={styles.container}>
            {/* Área de Pesquisa e Logo */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={[styles.input, styles.fontKantumruy]}
                    placeholder="Pesquisar..."
                    value={search}
                    onChangeText={setSearch}
                    placeholderTextColor="#A3A3A3"
                />
                <Image source={{ uri: logoUrl }} style={styles.logo} />
            </View>
            
            {/* Carrossel de Banner */}
            <TouchableOpacity onPress={() => navigation.navigate("ListaDesejos")} style={styles.bannerContainer}>
                {bannerUrls.length > 0 && ( 
                    <Image
                        source={{ uri: bannerUrls[currentBannerIndex] }} 
                        style={styles.bannerImage}
                        resizeMode="cover" 
                    />
                )}
            </TouchableOpacity>

            {/* Indicadores de página do banner */}
            <View style={styles.paginationContainer}>
                {bannerUrls.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.paginationDot,
                            currentBannerIndex === index ? styles.activeDot : styles.inactiveDot,
                        ]}
                    />
                ))}
            </View>

            {/* Categorias */}
            <View style={styles.categoriesContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("Categorias")}>
                    <View style={styles.categoryButton}>
                        <View style={styles.categoryCircle}>
                            <Image source={require("../assets/calcados.jpg")} style={styles.categoryIcon} />
                        </View>
                        <Text style={[styles.categoryText, styles.fontKantumruy]}>Calçados</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Categorias")}>
                    <View style={styles.categoryButton}>
                        <View style={styles.categoryCircle}>
                            <Image source={require("../assets/esportes.jpg")} style={styles.categoryIcon} />
                        </View>
                        <Text style={[styles.categoryText, styles.fontKantumruy]}>Esportes</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.categoryButton}>
                    <View style={styles.categoryCircle}>
                        <Image source={require("../assets/acessorios.jpg")} style={styles.categoryIcon} />
                    </View>
                    <Text style={[styles.categoryText, styles.fontKantumruy]}>Acessórios</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("Categorias")}>
                    <View style={styles.categoryButton}>
                        <View style={styles.categoryCircle}>
                            <Image source={require("../assets/feminino-ico.jpg")} style={styles.categoryIcon} />
                        </View>
                        <Text style={[styles.categoryText, styles.fontKantumruy]}>Feminino</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Categorias")}>
                    <View style={styles.categoryButton}>
                        <View style={styles.categoryCircle}>
                            <Image source={require("../assets/vertodos.jpg")} style={styles.categoryIcon} />
                        </View>
                        <Text style={[styles.categoryText, styles.fontKantumruySemiBold]}>Ver todos</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Cabeçalho Lançamentos */}
            <View style={styles.lancamentosContainer}>
                <Text style={[styles.lancamentosText, styles.fontKantumruyMedium]}>Lançamentos</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Categorias")}>
                    <Text style={[styles.verTodos, styles.fontKantumruySemiBold]}>Ver todos</Text>
                </TouchableOpacity>
            </View>

            {/* Carrossel de Lançamentos (Sem Setas) */}
            <View style={styles.containerCarrossel}>
                <ScrollView
                    ref={lancamentosScrollRef} 
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                >
                    {initialProducts.map((product) => (
                        <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                    ))}
                </ScrollView>
            </View>

            {/* Cabeçalho Últimos Acessos */}
            <View style={styles.contUltimosAcessos}>
                <Text style={[styles.ultimosAcessosText, styles.fontKantumruyMedium]}>Últimos produtos acessados</Text>
            </View>

            {/* Carrossel de Últimos Acessos (Sem Setas) */}
            <View style={styles.containerCarrossel}>
                <ScrollView
                    ref={acessosScrollRef} 
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                >
                    {lastAccessedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
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
    // Fontes
    fontKantumruySemiBold: {
        fontFamily: "Kantumruy Pro SemiBold",
    },
    fontKantumruyMedium: {
        fontFamily: "Kantumruy Pro Medium",
    },
    // Input de pesquisa
    input: {
        width: "80%",
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
    },
    // Imagem do produto no card
    image: {
        width: "100%",
        height: 70,
        marginVertical: 20,
    },
    // Container de Pesquisa e Logo
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
    // Imagem da Logo
    logo: {
        width: 77,
        height: 40,
        marginLeft: 10,
    },
    // Estilos para o Carrossel de Banner
    bannerContainer: {
        width: width * 0.95, // Usa 95% da largura da tela
        height: width * 0.95 * (293 / 440), // Mantém a proporção da imagem original (440x293)
        alignSelf: "center",
        borderRadius: 8,
        overflow: "hidden", 
    },
    bannerImage: {
        width: "100%",
        height: "100%",
    },
    // Estilos de paginação (pontos) para o banner
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
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
        backgroundColor: '#052242',
    },
    inactiveDot: {
        backgroundColor: '#ccc',
    },
    
    // Categorias
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
    // Lançamentos Header
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
    // Cards de Produtos
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
    // Contêiner Carrossel de Produtos (Usado agora que as setas foram removidas)
    containerCarrossel: {
        width: '100%',
        paddingVertical: 20,
        backgroundColor: "#F3ECE2",
    },
    scrollContainer: {
        paddingHorizontal: 10,
        gap: 20,
        marginLeft: 10,
        paddingRight: 10, // Ajustado para remover o padding extra das setas
    },
    // Últimos Acessos Header
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
    // Os estilos 'carouselWrapper', 'arrow', 'arrowLeft' e 'arrowRight' foram removidos.
});