import React, { useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const { height } = Dimensions.get("window");

export default function InfoProduto() {
    const navigation = useNavigation();
    const route = useRoute();
    const { produto } = route.params;

    // Aqui você pode adicionar mais imagens se quiser
    const imagens = [produto.imagem, produto.imagem, produto.imagem];

    const [imagemAtual, setImagemAtual] = useState(0);

    const handleScroll = (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.y / height);
        setImagemAtual(index);
    };

    return (
        <View style={styles.container}>
            {/* Carrossel Vertical */}
            <FlatList
                data={imagens}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => <Image source={item} style={styles.imagem} resizeMode="contain" />}
                showsVerticalScrollIndicator={false}
                pagingEnabled
                onScroll={handleScroll}
                scrollEventThrottle={16}
            />

            {/* Indicadores laterais */}
            <View style={styles.indicadores}>
                {imagens.map((_, index) => (
                    <View key={index} style={[styles.indicador, imagemAtual === index && styles.indicadorAtivo]} />
                ))}
            </View>

            {/* Informações do Produto */}
            <View style={styles.infoContainer}>
                <Text style={styles.nome}>{produto.nome}</Text>
                <Text style={styles.preco}>R$ {produto.preco.toFixed(2)}</Text>

                <TouchableOpacity style={styles.botaoCarrinho}>
                    <Text style={styles.textoBotao}>Adicionar ao carrinho →</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    imagem: { width: "100%", height: height * 0.75 },

    indicadores: {
        position: "absolute",
        right: 15,
        top: "35%",
    },
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
    botaoCarrinho: {
        backgroundColor: "#001f3f",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    textoBotao: { color: "#fff", fontSize: 16, fontWeight: "500" },
});
