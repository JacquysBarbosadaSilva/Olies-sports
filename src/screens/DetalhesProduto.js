// DetalhesProduto.js
import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import awsConfig, { dynamoDB, s3, BUCKET_NAME } from "../../awsConfig"; // ajuste path

const PRODUCTS_TABLE = "produtos"; // ajuste conforme seu banco

const PRIMARY_COLOR = "#052242";
const BACKGROUND_COLOR = "#f3ece2";
const BORDER_COLOR = "#d1cac1";

const SizeItem = ({ size, isSelected, onPress }) => (
    <TouchableOpacity key={size} style={[styles.sizeItem, isSelected && styles.sizeItemSelected]} onPress={onPress}>
        <Text style={[styles.sizeText, isSelected && styles.sizeTextSelected]}>{size}</Text>
    </TouchableOpacity>
);

const FitBar = ({ label, positionPercentage = 50 }) => {
    return (
        <View style={styles.fitBarSection}>
            <Text style={styles.fitBarLabel}>{label}</Text>

            <View style={styles.fitBarTopRow}>
                <Text style={styles.fitBarTopText}>Muito pequeno</Text>
                <Text style={[styles.fitBarTopText, styles.fitBarCenterText]}>Fiel ao tamanho</Text>
                <Text style={styles.fitBarTopText}>Muito grande</Text>
            </View>

            <View style={styles.barLineContainer}>
                <View style={styles.barLine}>
                    <View style={[styles.barIndicator, { left: `${positionPercentage}%` }]} />
                    <View style={styles.barLineFill} />
                    <View style={styles.barLineCenterDark} />
                </View>
            </View>
        </View>
    );
};

const DetalhesProduto = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { productId } = route.params || { productId: "1" };

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState("");

    useEffect(() => {
        loadProductData();
    }, [productId]);

    const loadProductData = async () => {
        try {
            setLoading(true);

            const params = {
                TableName: PRODUCTS_TABLE,
                Key: {
                    id: { S: String(productId) },
                },
            };

            const command = new GetItemCommand(params);
            const result = await dynamoDB.send(command);

            if (result.Item) {
                const productData = unmarshallProduct(result.Item);
                setProduct(productData);

                // seleciona primeiro tamanho válido (se calcado -> primeiro disponível; se roupa -> primeiro opção)
                if (productData && productData.tamanhos) {
                    if (productData.tamanhos.tipo === "calcado") {
                        const { inicio, fim } = productData.tamanhos.intervalo || {};
                        const all = [];
                        if (typeof inicio === "number" && typeof fim === "number") {
                            for (let s = inicio; s <= fim; s++) all.push(String(s));
                        }
                        const available = all.filter(
                            (s) => !(productData.tamanhos.indisponiveis || []).includes(Number(s)),
                        );
                        if (available.length) setSelectedSize(available[0]);
                    } else {
                        const op = productData.tamanhos.opcoes || [];
                        const available = op.filter((s) => !(productData.tamanhos.indisponiveis || []).includes(s));
                        if (available.length) setSelectedSize(available[0]);
                    }
                }
            } else {
                setProduct(null);
            }
        } catch (error) {
            console.error("Erro ao buscar produto:", error);
            Alert.alert("Erro ao carregar produto");
        } finally {
            setLoading(false);
        }
    };

    const unmarshallProduct = (dynamoItem) => {
        // Este método aceita 2 formatos:
        // - formato antigo: tamanhos como L (lista)
        // - novo formato: tamanhos como S (JSON string) com estrutura { tipo, intervalo/opcoes, indisponiveis }
        const parsePossibleJson = (attr) => {
            if (!attr) return null;
            if (attr.S) {
                try {
                    return JSON.parse(attr.S);
                } catch (err) {
                    return null;
                }
            }
            // fallback para L
            if (attr.L) {
                // attr.L expected to be list of strings
                return attr.L.map((x) => (x.S ? x.S : x));
            }
            return null;
        };

        // cores pode estar como S (JSON) ou L
        let cores = [];
        if (dynamoItem.cores) {
            if (dynamoItem.cores.S) {
                try {
                    cores = JSON.parse(dynamoItem.cores.S);
                } catch (e) {
                    cores = [];
                }
            } else if (dynamoItem.cores.L) {
                // convert list to expected format (cada item pode ter M)
                cores = dynamoItem.cores.L.map((it) => {
                    if (it.M) {
                        const plain = {};
                        Object.keys(it.M).forEach((k) => {
                            const v = it.M[k];
                            plain[k] =
                                v.S || (v.N ? Number(v.N) : undefined) || (v.L ? v.L.map((x) => x.S) : undefined);
                        });
                        return plain;
                    }
                    return null;
                }).filter(Boolean);
            }
        }

        const tamanhosAttr = parsePossibleJson(dynamoItem.tamanhos);
        const tamanhos = tamanhosAttr || (dynamoItem.tamanhos?.L ? dynamoItem.tamanhos.L.map((x) => x.S) : []);

        const precoVal = dynamoItem.preco?.N
            ? parseFloat(dynamoItem.preco.N)
            : dynamoItem.preco?.S
            ? parseFloat(dynamoItem.preco.S)
            : 0;

        return {
            id: dynamoItem.id?.S,
            nome: dynamoItem.nome?.S,
            preco: precoVal,
            descricao: dynamoItem.descricao?.S || "",
            tamanhos: tamanhos,
            avaliacao: dynamoItem.avaliacao?.N ? parseFloat(dynamoItem.avaliacao.N) : 0,
            cores: cores,
            // caso exista imagens flat
            imagensFlat: dynamoItem.imagens?.S ? JSON.parse(dynamoItem.imagens.S) : [],
        };
    };

    const handleSelectSize = (size) => {
        setSelectedSize(size);
    };

    const handleAddToCart = () => {
        if (product && selectedSize) {
            Alert.alert("Adicionado", `${product.nome} tamanho ${selectedSize} adicionado ao carrinho`);
        } else {
            Alert.alert("Escolha um tamanho");
        }
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const totalStars = 5;
        let stars = [];
        const starColor = PRIMARY_COLOR;

        for (let i = 0; i < totalStars; i++) {
            if (i < fullStars) stars.push(<Ionicons key={i} name="star" size={20} color={starColor} />);
            else if (i === fullStars && hasHalfStar)
                stars.push(<Ionicons key={i} name="star-half-sharp" size={20} color={starColor} />);
            else stars.push(<Ionicons key={i} name="star-outline" size={20} color={starColor} />);
        }
        return <View style={styles.starsContainer}>{stars}</View>;
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                <Text style={styles.loadingText}>Carregando detalhes...</Text>
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Produto não encontrado</Text>
            </View>
        );
    }

    // montar array de tamanhos para exibir
    const sizesToShow = (() => {
        if (!product.tamanhos) return [];
        if (product.tamanhos.tipo === "calcado") {
            const inicio = product.tamanhos.intervalo?.inicio;
            const fim = product.tamanhos.intervalo?.fim;
            const indispon = product.tamanhos.indisponiveis || [];
            const arr = [];
            for (let s = inicio; s <= fim; s++) arr.push(String(s));
            // marcar indisponíveis no botão irá bloquear seleção no UI
            return arr.map((s) => ({ label: s, disponivel: !indispon.includes(Number(s)) }));
        }
        // roupa
        if (product.tamanhos.opcoes) {
            const indispon = product.tamanhos.indisponiveis || [];
            return product.tamanhos.opcoes.map((sz) => ({ label: sz, disponivel: !indispon.includes(sz) }));
        }
        // fallback: if tamanhos is array
        if (Array.isArray(product.tamanhos)) {
            return product.tamanhos.map((s) => ({ label: s, disponivel: true }));
        }
        return [];
    })();

    return (
        <ScrollView style={styles.container}>
            {/* Tamanhos */}
            <View style={styles.sizeSelectionContainer}>
                <View style={styles.sizeTitleRow}>
                    <Text style={styles.sizeTitle}>Tamanho</Text>
                    <View style={styles.rulerIconBox} />
                </View>

                <View style={styles.sizesRow}>
                    {sizesToShow.map((item) => (
                        <TouchableOpacity
                            key={item.label}
                            style={[
                                styles.sizeItem,
                                item.label === selectedSize && styles.sizeItemSelected,
                                !item.disponivel && { opacity: 0.4 },
                            ]}
                            onPress={() => item.disponivel && handleSelectSize(item.label)}
                            disabled={!item.disponivel}
                        >
                            <Text style={[styles.sizeText, item.label === selectedSize && styles.sizeTextSelected]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Botão adicionar */}
            <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                <Text style={styles.addToCartText}>Adicionar ao carrinho</Text>
                <Ionicons name="bag-handle-outline" size={20} color="#FFFFFF" style={styles.cartIcon} />
            </TouchableOpacity>

            {/* icons payment */}
            <View style={styles.paymentIconsContainer}>
                <TouchableOpacity style={styles.paymentIconItem}>
                    <Ionicons name="card-outline" size={18} color={PRIMARY_COLOR} />
                </TouchableOpacity>
            </View>

            {/* detalhes */}
            <View style={styles.productDetailSection}>
                <Text style={styles.productDetailTitle}>{product.nome}</Text>
                <Text style={styles.productDetailDescription}>{product.descricao}</Text>
            </View>

            <View style={styles.reviewsSection}>
                <Text style={styles.reviewsTitle}>Avaliações e comentários</Text>
                <View style={styles.ratingRow}>
                    <Text style={styles.ratingValue}>{(product.avaliacao || 0).toFixed(1)}</Text>
                    {renderStars(product.avaliacao || 0)}
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("Comentarios")}>
                    <Text style={styles.commentsLink}>Comentários</Text>
                </TouchableOpacity>
                <FitBar label="Tamanho" positionPercentage={50} />
                <FitBar label="Largura" positionPercentage={50} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BACKGROUND_COLOR },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: BACKGROUND_COLOR },
    loadingText: { marginTop: 10, fontSize: 16, color: PRIMARY_COLOR },
    errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: BACKGROUND_COLOR },
    errorText: { fontSize: 16, color: "#FF0000" },

    sizeSelectionContainer: { paddingVertical: 15 },
    sizeTitleRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, marginBottom: 8 },
    sizeTitle: { fontSize: 14, fontWeight: "500", color: "#333", marginRight: 10 },
    rulerIconBox: { width: 20, height: 20, justifyContent: "center", alignItems: "center" },
    sizesRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR,
        width: "100%",
        paddingVertical: 8,
    },
    sizeItem: {
        minWidth: 36,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
        marginBottom: 8,
    },
    sizeItemSelected: {},
    sizeText: { color: "#999999", fontSize: 14, fontWeight: "400" },
    sizeTextSelected: { color: "#333333", fontWeight: "600" },

    addToCartButton: {
        backgroundColor: PRIMARY_COLOR,
        height: 50,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 20,
        borderRadius: 5,
        marginTop: 15,
        marginBottom: 10,
    },
    addToCartText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold", marginRight: 10 },

    paymentIconsContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    paymentIconItem: { flexDirection: "row", alignItems: "center", marginRight: 15 },

    productDetailSection: { paddingHorizontal: 20, paddingVertical: 20 },
    productDetailTitle: { fontSize: 24, fontWeight: "700", color: "#333333", marginBottom: 10 },
    productDetailDescription: { fontSize: 16, lineHeight: 20, color: "#555555" },

    reviewsSection: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: BACKGROUND_COLOR,
        borderTopWidth: 1,
        borderTopColor: BORDER_COLOR,
    },
    reviewsTitle: { fontSize: 20, fontWeight: "700", color: "#333333", marginBottom: 10 },
    ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
    ratingValue: { fontSize: 32, fontWeight: "700", color: "#333333", marginRight: 10 },
    starsContainer: { flexDirection: "row" },
    commentsLink: { fontSize: 14, color: "#555555", textDecorationLine: "underline", marginBottom: 10 },

    fitBarSection: { marginBottom: 20, marginTop: 15 },
    fitBarLabel: { fontSize: 14, fontWeight: "500", marginBottom: 5, color: "#333333" },
    fitBarTopRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
    fitBarTopText: { fontSize: 12, color: "#777777" },
    fitBarCenterText: {
        position: "absolute",
        left: "50%",
        transform: [{ translateX: -40 }],
        fontWeight: "600",
        color: PRIMARY_COLOR,
    },
    barLineContainer: { position: "relative", height: 10, paddingVertical: 3 },
    barLine: {
        flex: 1,
        height: 2,
        backgroundColor: BORDER_COLOR,
        borderRadius: 1,
        position: "relative",
        top: 0,
        left: 0,
        right: 0,
    },
    barLineCenterDark: {
        position: "absolute",
        left: "50%",
        width: 1,
        height: 4,
        backgroundColor: "#333",
        transform: [{ translateX: -0.5 }, { translateY: -1 }],
    },
    barIndicator: {
        position: "absolute",
        top: -4,
        width: 4,
        height: 10,
        backgroundColor: "#333333",
        transform: [{ translateX: -2 }],
    },
});

export default DetalhesProduto;
