import AsyncStorage from "@react-native-async-storage/async-storage";

export const getLoggedUser = async () => {
  try {
    const raw = await AsyncStorage.getItem("usuarioLogado");

    if (!raw) return null;

    const user = JSON.parse(raw);

    if (!user.id) return null;

    return user;
  } catch (e) {
    console.log("Erro ao ler usuário logado:", e);
    return null;
  }
};
