// Produtos.js
import React, { useState } from "react";
import "react-native-get-random-values";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Alert, FlatList } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { useNavigation } from "@react-navigation/native";
// import awsConfig, { dynamoDB, s3, BUCKET_NAME, REGION } from "../../awsConfig";
import { v4 as uuid } from "uuid";
import * as AWS from "../../awsConfig";

const dynamoDB = AWS.dynamoDB;
const s3 = AWS.s3;
const BUCKET_NAME = AWS.BUCKET_NAME;
const REGION = AWS.REGION;


const productId = uuid();

const bucketName = BUCKET_NAME; // ajuste se necessário

const ROUPA_OPCOES = ["PP", "P", "M", "G", "GG", "XG"];

export default function Produtos() {
    const navigation = useNavigation();

    // campos básicos
    const [modalVisible, setModalVisible] = useState(false);
    const [nome, setNome] = useState("");
    const [preco, setPreco] = useState("");
    const [descricao, setDescricao] = useState("");
    const [corInput, setCorInput] = useState(""); // nome da cor quando adiciona cor
    const [hexInput, setHexInput] = useState(""); // opcional hex

    // tipo: calcado | roupa
    const [tipo, setTipo] = useState("calcado");

    // tamanhos
    const [inicioCalc, setInicioCalc] = useState("");
    const [fimCalc, setFimCalc] = useState("");
    const [indisponiveisCalc, setIndisponiveisCalc] = useState([]);
    const [indisponiveisRoupa, setIndisponiveisRoupa] = useState([]);

    // cores: cada cor { id, cor, hex, imagens: [ { uri, fileName } ] }
    const [cores, setCores] = useState([]);

    // state temporário ao adicionar imagens para a cor atual
    const [selectedColorForUpload, setSelectedColorForUpload] = useState(null);

    // ajuda: gera array de números inclusive
    const gerarIntervalo = (inicio, fim) => {
        const a = parseInt(inicio, 10);
        const b = parseInt(fim, 10);
        if (Number.isNaN(a) || Number.isNaN(b) || a > b) return [];
        const arr = [];
        for (let i = a; i <= b; i++) arr.push(i);
        return arr;
    };

    // Toggle indisponível (calcado)
    const toggleIndisponivelCalc = (size) => {
        setIndisponiveisCalc((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
    };

    // Toggle indisponível (roupa)
    const toggleIndisponivelRoupa = (size) => {
        setIndisponiveisRoupa((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
    };

    // Adicionar nova cor vazia
    const handleAddColor = () => {
        if (!corInput.trim()) return Alert.alert("Insira o nome da cor");
        const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
        const newColor = { id, cor: corInput.trim(), hex: hexInput || null, imagens: [] };
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
            setCores((prev) => prev.map((c) => (c.id === colorId ? { ...c, imagens: [...c.imagens, ...assets] } : c)));
        } catch (err) {
            console.error(err);
            Alert.alert("Erro ao selecionar imagens");
        }
    };



    const uploadToS3 = async (productId, file) => {
        // Removida a variável colorName
        try {
            // Buscar arquivo do dispositivo
            const response = await fetch(file.uri);
            const arrayBuffer = await response.arrayBuffer(); // ← FUNCIONA NO RN // Nome seguro (apenas gera a extensão)

            const ext = (file.fileName && file.fileName.split(".").pop()) || "jpg"; // ⚠️ FIX: Caminho simplificado: produtos/ID_PRODUTO/timestamp-random.ext

            const key = `produtos/${productId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`; // ENVIO AO S3

            await s3.send(
                new PutObjectCommand({
                    Bucket: bucketName,
                    Key: key,
                    Body: arrayBuffer, // ← AQUI É O QUE IMPORTA
                    ContentType: "image/jpeg", // ou file.mimeType se existir
                }),
            ); 

            return `https://${bucketName}.s3.${REGION}.amazonaws.com/${key}`;
        } catch (err) {
            console.error("S3 upload error:", err);
            return null;
        }
    };

    const saveToDynamoDB = async (product) => {
        console.log("DynamoDB Client object:", dynamoDB);
        try {
            const params = {
                TableName: "produtos", // ajuste nome da tabela
                Item: {
                    id: { S: String(product.id) },
                    nome: { S: product.nome },
                    preco: { N: String(product.preco) },
                    descricao: { S: product.descricao || "" },
                    tipo: { S: product.tipo },
                    cores: { S: JSON.stringify(product.cores) }, // armazenamos JSON string
                    tamanhos: { S: JSON.stringify(product.tamanhos) },
                    imagens: { S: JSON.stringify(product.imagensFlat || []) }, // all urls flat (opcional)
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
        if (!preco || Number.isNaN(Number(preco))) return Alert.alert("Preço inválido");
        if (!cores.length) return Alert.alert("Adicione pelo menos uma cor com imagens");

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
            Alert.alert("Atenção", "Algumas imagens falharam no upload. Produto salvo sem elas.");
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
            // reset
            setModalVisible(false);
            setNome("");
            setPreco("");
            setDescricao("");
            setCores([]);
            setInicioCalc("");
            setFimCalc("");
            setIndisponiveisCalc([]);
            setIndisponiveisRoupa([]);
            // navegar para InfoProduto com o objeto criado (compatível)
            Alert.alert("Sucesso", "Produto e imagens salvas!");
            navigation.navigate("InfoProduto", { produto: productData });
        } catch (err) {
            console.error("Erro final ao salvar produto:", err);
            Alert.alert("Erro fatal", "Erro ao salvar o produto no banco de dados.");
        }
    };

    // UI
    return (
        <View style={{ flex: 1 }}>
            {/* Botão + */}
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>

            {modalVisible && (
                <View style={styles.modal}>
                    <ScrollView>
                        <Text style={styles.modalTitle}>Novo Produto</Text>

                        <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
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

                        <Text style={styles.label}>Tipo</Text>
                        <View style={{ flexDirection: "row", gap: 10, marginBottom: 8 }}>
                            <TouchableOpacity
                                style={[styles.tipoBtn, tipo === "calcado" && styles.tipoBtnAtivo]}
                                onPress={() => setTipo("calcado")}
                            >
                                <Text style={tipo === "calcado" ? styles.tipoTextAtivo : styles.tipoText}>Calçado</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tipoBtn, tipo === "roupa" && styles.tipoBtnAtivo]}
                                onPress={() => setTipo("roupa")}
                            >
                                <Text style={tipo === "roupa" ? styles.tipoTextAtivo : styles.tipoText}>Roupa</Text>
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

                                <Text style={[styles.label, { marginTop: 10 }]}>Marcar indisponíveis</Text>
                                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                                    {gerarIntervalo(inicioCalc, fimCalc).map((s) => {
                                        const disabled = indisponiveisCalc.includes(s);
                                        return (
                                            <TouchableOpacity
                                                key={s}
                                                onPress={() => toggleIndisponivelCalc(s)}
                                                style={[styles.sizeBox, disabled && styles.sizeBoxDisabled]}
                                            >
                                                <Text style={[styles.sizeBoxText, disabled && { opacity: 0.5 }]}>
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
                                                style={[styles.sizeBox, disabled && styles.sizeBoxDisabled]}
                                            >
                                                <Text style={[styles.sizeBoxText, disabled && { opacity: 0.5 }]}>
                                                    {sz}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </>
                        )}

                        {/* Cores */}
                        <Text style={[styles.label, { marginTop: 12 }]}>Adicionar cor (cada cor tem imagens)</Text>
                        <View style={{ flexDirection: "row", gap: 8 }}>
                            <TextInput
                                placeholder="Nome da cor"
                                value={corInput}
                                onChangeText={setCorInput}
                                style={[styles.input, { flex: 1 }]}
                            />
                            <TextInput
                                placeholder="#hex (opcional)"
                                value={hexInput}
                                onChangeText={setHexInput}
                                style={[styles.input, { width: 100 }]}
                            />
                        </View>
                        <TouchableOpacity style={[styles.pickButton, { marginTop: 8 }]} onPress={handleAddColor}>
                            <Text style={styles.pickText}>Adicionar cor</Text>
                        </TouchableOpacity>

                        {/* Cores list */}
                        <View style={{ marginTop: 12 }}>
                            {cores.map((color) => (
                                <View key={color.id} style={styles.colorRow}>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
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
                                            style={[styles.smallBtn, { backgroundColor: "#ccc", marginLeft: 8 }]}
                                        >
                                            <Text>Excluir</Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/* thumbnails */}
                                    <ScrollView horizontal style={{ marginTop: 8 }}>
                                        {color.imagens.map((img, idx) => (
                                            <Image key={idx} source={{ uri: img.uri }} style={styles.preview} />
                                        ))}
                                    </ScrollView>
                                </View>
                            ))}
                        </View>

                        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProduct}>
                            <Text style={styles.saveButtonText}>Salvar Produto</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
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
        backgroundColor: "#fff",
        padding: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
    },
    label: {
        fontWeight: "600",
        marginBottom: 6,
    },
    tipoBtn: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: "#f0f0f0",
    },
    tipoBtnAtivo: {
        backgroundColor: "#001f3f",
    },
    tipoText: {
        color: "#333",
    },
    tipoTextAtivo: {
        color: "#fff",
    },
    pickButton: {
        backgroundColor: "#001f3f",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
    },
    pickText: {
        color: "#fff",
    },
    colorRow: {
        marginBottom: 12,
    },
    colorCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        marginRight: 8,
    },
    smallBtn: {
        backgroundColor: "#007bff",
        padding: 8,
        borderRadius: 6,
    },
    preview: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 8,
    },
    saveButton: {
        backgroundColor: "#28a745",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 12,
    },
    saveButtonText: {
        color: "#fff",
        fontWeight: "700",
    },
    closeButton: {
        marginTop: 8,
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        backgroundColor: "#eee",
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
});
