import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const { height } = Dimensions.get("window");

// 🔹 Reduzindo para 50% para dar mais espaço ao infoContainer
const CAROUSEL_HEIGHT_RATIO = 0.50; 
const ITEM_HEIGHT = height * CAROUSEL_HEIGHT_RATIO;

export default function InfoProduto() {
    const navigation = useNavigation();
    const route = useRoute();
    const { produto } = route.params;

    // 🔹 Grupos de imagens por cor
    const coresDisponiveis = {
        bege: [
            require("../assets/img/cor-produto1.png"),
            require("../assets/img/cor2-produto1.png"),
            require("../assets/img/cor3-produto1.png"),
            require("../assets/img/cor4-produto1.png"),
        ],

        branco:[
            require("../assets/img/produto-categoria1.png"),
            require("../assets/img/info-produto1.png"),
        ]

    };

    // 🔹 Cor padrão (ex: bege)
    const [corSelecionada, setCorSelecionada] = useState("bege");
    const [imagemAtual, setImagemAtual] = useState(0);

    const handleScroll = (event) => {
        // Usa o ITEM_HEIGHT para cálculo preciso
        const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
        setImagemAtual(index);
    };

    // 🔹 Atualiza o carrossel quando troca a cor
    const imagens = coresDisponiveis[corSelecionada] || [];

    return (
        <View style={styles.container}>
            {/* Carrossel vertical */}
            <FlatList
                data={imagens}
                contentContainerStyle={{ paddingTop: 50 }} // <- Isso cria o espaço visual
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                    // Mantenha "contain" para ver a imagem inteira
                    <Image source={item} style={styles.imagem} resizeMode="contain" /> 
                )}
                showsVerticalScrollIndicator={false}
                pagingEnabled
                onScroll={handleScroll}
                scrollEventThrottle={16}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="normal"
            />

            {/* Indicadores à direita */}
            <View style={styles.indicadores}>
                {imagens.map((_, index) => (
                    <View
                        key={index}
                        style={[styles.indicador, imagemAtual === index && styles.indicadorAtivo]}
                    />
                ))}
            </View>

            {/* Informações do Produto */}
            <View style={styles.infoContainer}>
                {/* Botões de cor */}
                <View style={styles.coresContainer}>
                    <TouchableOpacity
                        style={[
                            styles.circuloCor,
                            { backgroundColor: "#E3DBC8" }, 
                            corSelecionada === "bege" && styles.corSelecionada,
                        ]}
                        onPress={() => setCorSelecionada("bege")}
                    />
                    <TouchableOpacity
                        style={[
                            styles.circuloCor,
                            { backgroundColor: "#fff" }, // branco
                            corSelecionada === "branco" && styles.corSelecionada,
                        ]}
                        onPress={() => setCorSelecionada("branco")}
                    />
                </View>

                <Text style={styles.nome}>{produto.nome}</Text>
                <Text style={styles.preco}>R$ {produto.preco.toFixed(2)}</Text>

                <TouchableOpacity style={styles.botaoDetalhes} onPress={() => navigation.navigate("DetalhesProduto")}>
                    <Text style={styles.textoBotaoDetalhes}>Detalhes do Produto</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botaoCarrinho} onPress={() => navigation.navigate("Carrinho")}>
                    <Text style={styles.textoBotaoCarrinho}>Adicionar ao Carrinho</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },

    imagem: {
        width: "100%",
        marginTop: 20,
        height: height * CAROUSEL_HEIGHT_RATIO, 
    },

    indicadores: {
        position: "absolute",
        right: 15,
        // Posição ajustada para ser um pouco mais alta
        top: "25%", 
    },

    indicador: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#ccc",
        marginVertical: 4,
    },

    indicadorAtivo: {
        backgroundColor: "#000",
    },

    infoContainer: {
        backgroundColor: "#f5efe5",
        paddingVertical: 90,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderColor: "#ddd",
    },

    coresContainer: {
        marginTop: -40, 
        flexDirection: "row",
        gap: 12,
        marginBottom: 16,
    },

    circuloCor: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#ccc",
    },

    corSelecionada: {
        borderColor: "#001f3f",
        borderWidth: 3,
    },

    nome: {
        fontSize: 20,
        fontWeight: "600",
        color: "#1a1a1a",
        marginBottom: 8,
    },

    preco: {
        fontSize: 18,
        color: "#1a1a1a",
        marginBottom: 16,
    },

    botaoDetalhes: {
        backgroundColor: "#001f3f",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
    },

    botaoCarrinho: {
        backgroundColor: "#fff",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
                marginTop: 20,
    },

    textoBotaoDetalhes: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
    },  

    textoBotaoCarrinho: {
        color: "#001f3f",
        fontSize: 16,
        fontWeight: "500",
    },
});