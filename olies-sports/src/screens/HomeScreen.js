import React from "react";
import { View, Text, StyleSheet, TextInput, Image } from "react-native";
import { useFonts } from 'expo-font';

import { useState } from "react";

export default function HomeScreen() {
    const [search, setSearch] = useState("");
    const [fontsLoaded] = useFonts({
        "Kantumruy Pro SemiBold": require("../assets/fonts/KantumruyPro-SemiBold.ttf"),
        "Kantumruy Pro Medium": require("../assets/fonts/KantumruyPro-Medium.ttf"),
    });

    if (!fontsLoaded) {
        return null; // ou um loading screen
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={[styles.input, styles.fontKantumruy]}
                    placeholder="Pesquisar..."
                    value={search}
                    onChangeText={setSearch}
                    placeholderTextColor="#A3A3A3"
                />
                <Image source={require("../assets/logotipo.png")} style={styles.image} resizeMode="contain" />
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
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
        width: 70,
        height: 70,
        marginVertical: 20,
    },
    searchContainer: {
        flexDirection: "row",
        width: "90%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
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
});
