import React from "react";
import { View, Text, StyleSheet, TextInput, Image, ScrollView, Pressable } from "react-native";
import { useFonts } from 'expo-font';
import { useState } from "react";

export default function HomeScreen() {
    const handlePress = () => {
        console.log('Botão pressionado!');
    };
    const [search, setSearch] = useState("");
    const [fontsLoaded] = useFonts({
        "Kantumruy Pro SemiBold": require("../assets/fonts/KantumruyPro-SemiBold.ttf"),
        "Kantumruy Pro Medium": require("../assets/fonts/KantumruyPro-Medium.ttf"),
    });

    if (!fontsLoaded) {
        return null; // ou um loading screen
    }

    return (
        <ScrollView contentContainerStyle={{ alignItems: 'center' }} style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={[styles.input, styles.fontKantumruy]}
                    placeholder="Pesquisar..."
                    value={search}
                    onChangeText={setSearch}
                    placeholderTextColor="#A3A3A3"
                />
                <Image source={require("../assets/logotipo.png")} style={styles.logo}  />
            </View>

            <View style={styles.banner}>
                <Image
                    source={require("../assets/banner-promocao.jpg")}
                    style={styles.bannerPromocao}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.categoriesContainer}>
                <View style={styles.categoryButton}>
                    <View style={styles.categoryCircle}>
                        <Image source={require("../assets/calcados.jpg")} style={styles.categoryIcon} />
                    </View>
                    <Text style={[styles.categoryText, styles.fontKantumruy]}>Calçados</Text>
                </View>
                <View style={styles.categoryButton}>
                    <View style={styles.categoryCircle}>
                        <Image source={require("../assets/esportes.jpg")} style={styles.categoryIcon} />
                    </View>
                    <Text style={[styles.categoryText, styles.fontKantumruy]}>Esportes</Text>
                </View>
                <View style={styles.categoryButton}>
                    <View style={styles.categoryCircle}>
                        <Image source={require("../assets/acessorios.jpg")} style={styles.categoryIcon} />
                    </View>
                    <Text style={[styles.categoryText, styles.fontKantumruy]}>Acessórios</Text>
                </View>
                <View style={styles.categoryButton}>
                    <View style={styles.categoryCircle}>
                        <Image source={require("../assets/feminino.jpg")} style={styles.categoryIcon} />
                    </View>
                    <Text style={[styles.categoryText, styles.fontKantumruy]}>Feminino</Text>
                </View>
                <View style={styles.categoryButton}>
                    <View style={styles.categoryCircle}>
                        <Image source={require("../assets/vertodos.jpg")} style={styles.categoryIcon} />
                    </View>
                    <Text style={[styles.categoryText, styles.fontKantumruySemiBold]}>Ver todos</Text>
                </View>
            </View>

            <View>
                <View style={styles.lancamentosContainer}>
                    <Text style={[styles.lancamentosText, styles.fontKantumruyMedium]}>Lançamentos</Text>
                    <Text style={[styles.verTodos, styles.fontKantumruySemiBold]}>Ver todos</Text>
                </View>
            </View>

            <View style={styles.containerCarrossel}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.cards}>
                        <View style={[styles.desconto]}>
                            <View style={[styles.promoValor]}>
                                <Text style={[styles.fontKantumruySemiBold, styles.promocao]}>-30% OFF</Text>
                            </View>
                        </View>
                        <Image source={require("../assets/imagem-produto1.jpg")} style={styles.image} resizeMode="contain" />
                        <View>
                            <Text style={[styles.fontKantumruySemiBold, styles.nomeProduto]}>Smartband Samsung Galaxy Fit3 Grafite</Text>
                        </View>
                        <View>
                            <Pressable style={styles.botao} onPress={handlePress}>
                                <Text style={[styles.textBotao, styles.fontKantumruySemiBold]}>Adicionar ao carrinho</Text>
                            </Pressable>
                        </View>
                        <View>
                            <Text style={[styles.fontKantumruySemiBold, styles.precoProduto]}>R$299,00 à vista</Text>
                            <Text style={[styles.fontKantumruySemiBold, styles.parcelaProduto]}>ou 2x de R$ 149,50</Text>
                        </View>
                    </View>

                    <View style={styles.cards}>
                        <View style={[styles.desconto]}>
                            <View style={[styles.promoValor]}>
                                <Text style={[styles.fontKantumruySemiBold, styles.promocao]}>-5% OFF</Text>
                            </View>
                        </View>
                        <Image source={require("../assets/imagem-produto2.png")} style={styles.image} resizeMode="contain" />
                        <View>
                            <Text style={[styles.fontKantumruySemiBold, styles.nomeProduto]}>Tênis Nike Air Jordan 1 Low SE</Text>
                        </View>
                        <View>
                            <Pressable style={styles.botao} onPress={handlePress}>
                                <Text style={[styles.textBotao, styles.fontKantumruySemiBold]}>Adicionar ao carrinho</Text>
                            </Pressable>
                        </View>
                        <View>
                            <Text style={[styles.fontKantumruySemiBold, styles.precoProduto]}>R$$1139,99 à vista</Text>
                            <Text style={[styles.fontKantumruySemiBold, styles.parcelaProduto]}>ou 10x de R$ 113,99</Text>
                        </View>
                    </View>

                    <View style={styles.cards}>
                        <View style={[styles.desconto]}>
                            <View style={[styles.promoValor]}>
                                <Text style={[styles.fontKantumruySemiBold, styles.promocao]}>-10% OFF</Text>
                            </View>
                        </View>
                        <Image source={require("../assets/imagem-produto3.png")} style={styles.image} resizeMode="contain" />
                        <View>
                            <Text style={[styles.fontKantumruySemiBold, styles.nomeProduto]}>Tênis Nike Flex Experience Run 12</Text>
                        </View>
                        <View>
                            <Pressable style={styles.botao} onPress={handlePress}>
                                <Text style={[styles.textBotao, styles.fontKantumruySemiBold]}>Adicionar ao carrinho</Text>
                            </Pressable>
                        </View>
                        <View>
                            <Text style={[styles.fontKantumruySemiBold, styles.precoProduto]}>R$ 1199,99 à vista</Text>
                            <Text style={[styles.fontKantumruySemiBold, styles.parcelaProduto]}>ou R$1079,99 no pix</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>

                <View style={styles.contUltimosAcessos}>
                    <Text style={[styles.ultimosAcessosText, styles.fontKantumruyMedium]}>Últimos produtos acessados</Text>
                </View>

                <View style={styles.containerCarrossel}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.cards}>
                        <View style={[styles.desconto]}>
                            <View style={[styles.promoValor]}>
                                <Text style={[styles.fontKantumruySemiBold, styles.promocao]}>-30% OFF</Text>
                            </View>
                        </View>
                        <Image source={require("../assets/imagem-produto4.png")} style={styles.image} resizeMode="contain" />
                        <View>
                            <Text style={[styles.fontKantumruySemiBold, styles.nomeProduto]}>Tênis adidas RunFalcon 5 Masculino</Text>
                        </View>
                        <View>
                            <Pressable style={styles.botao} onPress={handlePress}>
                                <Text style={[styles.textBotao, styles.fontKantumruySemiBold]}>Adicionar ao carrinho</Text>
                            </Pressable>
                        </View>
                        <View>
                            <Text style={[styles.fontKantumruySemiBold, styles.precoProduto]}>279,99 à vista</Text>
                            <Text style={[styles.fontKantumruySemiBold, styles.parcelaProduto]}>ou 4x de R$ 64,99</Text>
                        </View>
                    </View>

                    <View style={styles.cards}>
                        <View style={[styles.desconto]}>
                            <View style={[styles.promoValor]}>
                                <Text style={[styles.fontKantumruySemiBold, styles.promocao]}>-53% OFF</Text>
                            </View>
                        </View>
                        <Image source={require("../assets/imagem-produto5.png")} style={styles.image} resizeMode="contain" />
                        <View>
                            <Text style={[styles.fontKantumruySemiBold, styles.nomeProduto]}>Kit Meia Adidas Cano Baixo c/ 6 Pares - Br...</Text>
                        </View>
                        <View>
                            <Pressable style={styles.botao} onPress={handlePress}>
                                <Text style={[styles.textBotao, styles.fontKantumruySemiBold]}>Adicionar ao carrinho</Text>
                            </Pressable>
                        </View>
                        <View>
                            <Text style={[styles.fontKantumruySemiBold, styles.precoProduto]}>66,49 à vista</Text>
                            <Text style={[styles.fontKantumruySemiBold, styles.parcelaProduto]}>ou 2x de R$ 33,29</Text>
                        </View>
                    </View>

                    <View style={styles.cards}>
                        <View style={[styles.desconto]}>
                            <View style={[styles.promoValor]}>
                                <Text style={[styles.fontKantumruySemiBold, styles.promocao]}>-5% OFF</Text>
                            </View>
                        </View>
                        <Image source={require("../assets/imagem-produto1.jpg")} style={styles.image} resizeMode="contain" />
                        <View>
                            <Text style={[styles.fontKantumruySemiBold, styles.nomeProduto]}>Smartband Samsung Galaxy Fit3 Grafite</Text>
                        </View>
                        <View>
                            <Pressable style={styles.botao} onPress={handlePress}>
                                <Text style={[styles.textBotao, styles.fontKantumruySemiBold]}>Adicionar ao carrinho</Text>
                            </Pressable>
                        </View>
                        <View>
                            <Text style={[styles.fontKantumruySemiBold, styles.precoProduto]}>R$299,00 à vista</Text>
                            <Text style={[styles.fontKantumruySemiBold, styles.parcelaProduto]}>ou 2x de R$ 149,50</Text>
                        </View>
                    </View>
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
    }, // Estilo base para a fonte Kantumruy Pro
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

    cards:{
        backgroundColor: "white",
        height: 242,
        width: 165,
        padding: 2,
        borderRadius: 10,
        marginBottom: 30,
        alignItems:"center",
        marginTop: 5,
        // IOS
        shadowColor: "#000",          
        shadowOffset: { width: 4, height: 4 }, 
        shadowOpacity: 1,           
        shadowRadius: 4,             
        //Android
        elevation: 10,     
    },

    promocao:{
        backgroundColor: "#052242",
        color: "white",
        textAlign: "center",
        width: 68,
        padding: 1,
        fontSize: 12,
        borderRadius: 5,
        
    },

    desconto:{
        width: "100%",
        alignItems: "flex-start", // Alinha o conteúdo à esquerda
        paddingLeft: 10,
        paddingTop: 10,
    },

    promoValor:{
        width: "100%",
    },

    nomeProduto:{
        color: "#9D9D9D",
        textAlign:"center",
    },

    precoProduto:{
        color: "#696969",
        textAlign:"center",
        fontSize: 16,
    },

    parcelaProduto:{
        color: "#A3A3A3",
        textAlign:"center", 
        fontSize: 10,
    },

    botao:{
        backgroundColor: "#fff",
        borderColor: "#052242",
        borderWidth: 1,
        borderRadius: 5,
        // paddingVertical: 6,
        // paddingHorizontal: 12,
        marginTop: 5,
        marginBottom: 5,
        alignItems: "center",
        justifyContent: "center",
        width: 100,
        height: 19,
    },

    textBotao:{
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
        justifyContent: "flex-start !important",
        alignItems: "flex-start !important",
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
