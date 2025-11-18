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
    Picker, // se estiver usando a API antiga; preferir @react-native-picker/picker
    Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const { height } = Dimensions.get("window");
const CAROUSEL_HEIGHT_RATIO = 0.5;
const ITEM_HEIGHT = height * CAROUSEL_HEIGHT_RATIO;

export default function InfoProduto() {
    const navigation = useNavigation();
    const route = useRoute();
    const { produto } = route.params || {};

    // state
    const [selectedColors, setSelectedColors] = useState([]); // array de color objects { cor, hex, imagens }
    const [availableColors, setAvailableColors] = useState(produto?.cores || []);
    const [displayImages, setDisplayImages] = useState([]); // urls para o carrossel
    const [imagemAtual, setImagemAtual] = useState(0);
    const [selectedColorPicker, setSelectedColorPicker] = useState(null); // valor do picker (color id)

    // inicializa availableColors a partir do produto
    useEffect(() => {
        setAvailableColors(produto?.cores || []);
        // default display: primeira cor se existir
        const first = produto?.cores && produto.cores.length ? produto.cores[0] : null;
        if (first) {
            setSelectedColors([first]);
            setDisplayImages(first.imagens || []);
            setSelectedColorPicker(first.id || first.cor);
        }
    }, [produto]);

    // quando selectedColors muda, atualiza displayImages (concatena imagens das cores selecionadas, ordem adicionada)
    useEffect(() => {
        if (!selectedColors || selectedColors.length === 0) {
            const first = availableColors && availableColors.length ? availableColors[0] : null;
            setDisplayImages(first ? first.imagens || [] : []);
            return;
        }
        const urls = [];
        selectedColors.forEach((c) => {
            if (c.imagens && c.imagens.length) urls.push(...c.imagens);
        });
        setDisplayImages(urls);
    }, [selectedColors, availableColors]);

    // handle picker selection: adiciona a cor selecionada ao array de selectedColors (se já estiver, ignora)
    const handlePickerSelect = (value) => {
        if (!value) return;
        const colorObj = availableColors.find((c) => c.id === value || c.cor === value);
        if (!colorObj) return;
        // se já foi selecionada, apenas remove (toggle) — mas você pediu "poder selecionar mais de uma, se selecionar mais de uma vai adicionando"
        // eu implemento toggle: se já estava selecionada, remove; se não, adiciona.
        setSelectedColors((prev) => {
            const exists = prev.some((p) => (p.id || p.cor) === (colorObj.id || colorObj.cor));
            if (exists) return prev.filter((p) => (p.id || p.cor) !== (colorObj.id || colorObj.cor));
            return [...prev, colorObj];
        });
        setSelectedColorPicker(value);
    };

    const handleScroll = (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
        setImagemAtual(index);
    };

    // navega para detalhes do produto
    const goDetalhes = () => navigation.navigate("DetalhesProduto", { productId: produto?.id });

    return (
        <View style={styles.container}>
            {/* carrossel vertical */}
            <FlatList
                data={displayImages}
                contentContainerStyle={{ paddingTop: 50 }}
                keyExtractor={(_, i) => String(i)}
                renderItem={({ item }) => <Image source={{ uri: item }} style={styles.imagem} resizeMode="contain" />}
                showsVerticalScrollIndicator={false}
                pagingEnabled
                onScroll={handleScroll}
                scrollEventThrottle={16}
                snapToInterval={ITEM_HEIGHT}
            />

            <View style={styles.indicadores}>
                {displayImages.map((_, index) => (
                    <View key={index} style={[styles.indicador, imagemAtual === index && styles.indicadorAtivo]} />
                ))}
            </View>

            <View style={styles.infoContainer}>
                {/* DROPDOWN para cores */}
                <Text style={{ fontWeight: "600", marginBottom: 8 }}>Cor</Text>

                {/* Usando Picker (troque conforme sua lib) */}
                <View style={{ borderWidth: 1, borderColor: "#eee", borderRadius: 8, marginBottom: 8 }}>
                    <Picker
                        selectedValue={selectedColorPicker}
                        onValueChange={(val) => handlePickerSelect(val)}
                        mode="dropdown"
                        style={{ height: Platform.OS === "android" ? 50 : undefined }}
                    >
                        {availableColors.map((c) => (
                            <Picker.Item key={c.id || c.cor} label={c.cor} value={c.id || c.cor} />
                        ))}
                    </Picker>
                </View>

                {/* Exibir circunferências das cores selecionadas (multi) */}
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    {selectedColors.map((c) => (
                        <View key={c.id || c.cor} style={{ alignItems: "center" }}>
                            <View
                                style={[
                                    styles.colorCircleLarge,
                                    c.hex
                                        ? { backgroundColor: c.hex }
                                        : { backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd" },
                                ]}
                            />
                            <Text style={{ fontSize: 11, marginTop: 4 }}>{c.cor}</Text>
                        </View>
                    ))}
                </View>

                {/* Nome e preço */}
                <Text style={styles.nome}>{produto?.nome}</Text>
                <Text style={styles.preco}>R$ {Number(produto?.preco || 0).toFixed(2)}</Text>

                {/* botões (mantive seu design) */}
                <TouchableOpacity style={styles.botaoDetalhes} onPress={goDetalhes}>
                    <Text style={styles.textoBotaoDetalhes}>Detalhes do Produto</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botaoCarrinho}>
                    <Text style={styles.textoBotaoCarrinho}>Adicionar ao Carrinho</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

/* --- estilos (mantive seu visual) --- */
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    imagem: { width: "100%", marginTop: 20, height: ITEM_HEIGHT },
    indicadores: { position: "absolute", right: 15, top: "25%" },
    indicador: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#ccc", marginVertical: 4 },
    indicadorAtivo: { backgroundColor: "#000" },
    infoContainer: {
        backgroundColor: "#f5efe5",
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderColor: "#ddd",
    },
    colorCircleLarge: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: "#ddd" },
    nome: { fontSize: 18, fontWeight: "600", color: "#1a1a1a", marginTop: 8 },
    preco: { fontSize: 16, color: "#1a1a1a", marginVertical: 6 },
    botaoDetalhes: {
        backgroundColor: "#001f3f",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 8,
    },
    botaoCarrinho: {
        backgroundColor: "#fff",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    textoBotaoDetalhes: { color: "#fff", fontSize: 16, fontWeight: "500" },
    textoBotaoCarrinho: { color: "#001f3f", fontSize: 16, fontWeight: "500" },
});
