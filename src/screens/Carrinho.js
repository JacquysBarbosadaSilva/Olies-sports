import React, { useState, useEffect, useRef, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  Animated,
  ScrollView,
  Alert,
} from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FavoritesContext } from "../context/FavoritesContext";
import dynamoDB from "../../awsConfig";
import {
  QueryCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const logoUrl =
  "https://olies-ports.s3.us-east-1.amazonaws.com/img/logotipo.png";

const INITIAL_CART_STATE = [];

const CartScreen = ({ navigation }) => {
  const route = useRoute();
  const [cartItems, setCartItems] = useState(INITIAL_CART_STATE);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const { favorites, addFavorite, removeFavorite } =
    useContext(FavoritesContext);

  // ============================================
  // FUNÇÃO CORRIGIDA: Extrai a chave primária "id"
  // ============================================
  const extractKeyFromRaw = (raw) => {
    if (!raw || typeof raw !== "object") {
      console.warn("extractKeyFromRaw: raw inválido");
      return null;
    }

    // A tabela usa "id" como Partition Key
    if (!raw.id) {
      console.warn("extractKeyFromRaw: Campo 'id' não encontrado no raw");
      console.log("Raw completo:", JSON.stringify(raw, null, 2));
      return null;
    }

    const Key = {
      id: raw.id, // Mantém o formato AttributeValue: { S: "valor" }
    };

    console.log("Chave extraída:", JSON.stringify(Key, null, 2));
    return Key;
  };

  // ============================================
  // Atualiza quantidade no DynamoDB
  // ============================================
  const updateQuantityInDB = async (cartItem, newQty) => {
    try {
      if (!cartItem._raw) {
        console.warn("updateQuantityInDB: Item não possui _raw", cartItem);
        throw new Error("Item não possui informações de chave (_raw)");
      }

      const Key = extractKeyFromRaw(cartItem._raw);

      if (!Key) {
        throw new Error("Não foi possível extrair a chave do item");
      }

      console.log("Atualizando quantidade para:", newQty);

      await dynamoDB.send(
        new UpdateItemCommand({
          TableName: "carrinho",
          Key,
          UpdateExpression: "SET quantidade = :q",
          ExpressionAttributeValues: {
            ":q": { N: newQty.toString() },
          },
        })
      );

      console.log("Quantidade atualizada com sucesso no DynamoDB");
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error);
      throw error;
    }
  };

  // ============================================
  // Deleta item no DynamoDB
  // ============================================
  const deleteItemFromDB = async (cartItem) => {
    try {
      if (!cartItem._raw) {
        console.warn("deleteItemFromDB: Item não possui _raw", cartItem);
        throw new Error("Item não possui informações de chave (_raw)");
      }

      const Key = extractKeyFromRaw(cartItem._raw);

      if (!Key) {
        throw new Error("Não foi possível extrair a chave do item");
      }

      console.log("Deletando item...");

      await dynamoDB.send(
        new DeleteItemCommand({
          TableName: "carrinho",
          Key,
        })
      );

      console.log("Item deletado com sucesso do DynamoDB");
    } catch (error) {
      console.error("Erro ao deletar item:", error);
      throw error;
    }
  };

  // ============================================
  // Carrega carrinho do DynamoDB
  // ============================================
  const loadCartFromDatabase = async () => {
    try {
      const usuarioStorage = await AsyncStorage.getItem("usuarioLogado");

      if (!usuarioStorage) {
        console.log("Nenhum usuário logado.");
        setCartItems([]);
        return;
      }

      const usuarioObj = JSON.parse(usuarioStorage);
      const userId = String(usuarioObj.id);

      console.log("Buscando carrinho do usuário:", userId);

      const result = await dynamoDB.send(
        new QueryCommand({
          TableName: "carrinho",
          IndexName: "usuarioId-index",
          KeyConditionExpression: "usuarioId = :u",
          ExpressionAttributeValues: {
            ":u": { S: userId },
          },
        })
      );

      if (!result.Items || result.Items.length === 0) {
        console.log("Carrinho vazio no DynamoDB");
        setCartItems([]);
        return;
      }

      // Formata itens preservando _raw completo
      const formatted = result.Items.map((rawItem) => {
        const data = unmarshall(rawItem);

        return {
          id: data.id, // Usa o ID composto como identificador único
          produtoId: data.produtoId,
          name: data.nomeProduto ?? "Produto sem nome",
          price: Number(data.preco ?? 0),
          quantity: Number(data.quantidade ?? 1),
          cor: data.cor ?? "Padrão",
          image: { uri: data.imagem ?? "" },
          _raw: rawItem, // CRÍTICO: Mantém o raw original completo
          _unmarshalled: data,
        };
      });

      console.log(`Carregados ${formatted.length} itens do carrinho`);
      setCartItems(formatted);
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
      Alert.alert("Erro", "Não foi possível carregar o carrinho.");
    }
  };

  useEffect(() => {
    if (route.params?.newItem) {
      const newItem = route.params.newItem;

      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === newItem.id);

        if (existingItem) {
          return prevItems.map((item) =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prevItems, { ...newItem, quantity: 1 }];
        }
      });

      navigation.setParams({ newItem: undefined });
    }
    loadCartFromDatabase();
  }, [route.params?.newItem]);

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // ============================================
  // Handler de mudança de quantidade
  // ============================================
  const handleQuantityChange = async (itemId, delta) => {
    const item = cartItems.find((i) => i.id === itemId);

    if (!item) {
      console.warn("Item não encontrado:", itemId);
      return;
    }

    const newQty = Math.max(1, item.quantity + delta);

    // Atualiza otimisticamente no UI
    setCartItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity: newQty } : i))
    );

    // Atualiza no DB em background
    try {
      await updateQuantityInDB(item, newQty);
    } catch (err) {
      console.error("Falha ao atualizar no DB:", err);
      // Reverte a mudança
      setCartItems((prev) =>
        prev.map((i) =>
          i.id === itemId ? { ...i, quantity: item.quantity } : i
        )
      );
      Alert.alert(
        "Erro",
        "Não foi possível atualizar a quantidade. Tente novamente."
      );
    }
  };

  const handleRemoveItem = (item) => {
    setItemToRemove(item);
    setIsModalVisible(true);
  };

  const confirmRemoval = async () => {
    if (!itemToRemove) return;

    try {
      await deleteItemFromDB(itemToRemove);
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemToRemove.id)
      );
    } catch (e) {
      console.error("Erro ao remover do DB:", e);
      Alert.alert("Erro", "Não foi possível remover o item. Tente novamente.");
    }

    setIsModalVisible(false);
    setItemToRemove(null);
  };

  const cancelRemoval = () => {
    setIsModalVisible(false);
    setItemToRemove(null);
  };

  // ============================================
  // Componente CartItem
  // ============================================
  const CartItem = ({ item }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handleFavAnimation = () => {
      const isFav = favorites.some((fav) => fav.id === item.produtoId);

      const favoriteItem = {
        id: item.produtoId, // Usa produtoId para favoritos
        nome: item.name,
        preco: item.price,
        cor: item.cor || "Não definida",
        imagemSource: item.image,
      };

      if (isFav) {
        removeFavorite(item.produtoId);
      } else {
        addFavorite(favoriteItem);
      }

      scaleAnim.setValue(0.8);
      Animated.spring(scaleAnim, {
        toValue: 1.2,
        friction: 2,
        useNativeDriver: true,
      }).start(() => {
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }).start();
      });
    };

    const isFav = favorites.some((fav) => fav.id === item.produtoId);
    const heartIconName = isFav ? "heart" : "heart-outline";
    const heartIconColor = isFav ? "#0a2540" : "#999";

    return (
      <View style={styles.cartItem}>
        <Image source={item.image} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <View style={styles.itemActions}>
            <TouchableOpacity onPress={handleFavAnimation}>
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Ionicons
                  name={heartIconName}
                  size={20}
                  color={heartIconColor}
                  style={styles.actionIcon}
                />
              </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleRemoveItem(item)}>
              <MaterialIcon
                name="delete-outline"
                size={24}
                color="#e74c3c"
                style={styles.actionIcon}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.itemPrice}>
            R$ {(item.price * item.quantity).toFixed(2)}
          </Text>
          <Text style={styles.itemDescription}>{item.name}</Text>
          <Text style={styles.itemInfo}>{item.cor}</Text>

          <View style={styles.quantityArea}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => handleQuantityChange(item.id, 1)}
                style={styles.qtyButton}
              >
                <Text style={styles.qtyButtonText}>+</Text>
              </TouchableOpacity>
              <View style={styles.qtyValueContainer}>
                <Text style={styles.qtyValueText}>{item.quantity}</Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  item.quantity > 1
                    ? handleQuantityChange(item.id, -1)
                    : handleRemoveItem(item)
                }
                style={styles.qtyButton}
              >
                <Text style={styles.qtyButtonText}>-</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const handleCheckout = async () => {
    try {
      const isLoggedIn = await AsyncStorage.getItem("userLoggedIn");
      if (isLoggedIn === "true") {
        navigation.navigate("Pagamento", { cartItems });
      } else {
        Alert.alert(
          "Atenção",
          "Você precisa estar logado para finalizar a compra.",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Entrar", onPress: () => navigation.navigate("Login") },
          ]
        );
      }
    } catch (e) {
      console.error("Erro ao verificar login:", e);
    }
  };

  const cartTotal = calculateTotal();
  const itemCountText =
    cartItems.length === 1 ? "1 item" : `${cartItems.length} itens`;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.titulo}>Carrinho</Text>
        <Image source={{ uri: logoUrl }} style={styles.logo} />
      </View>
      <View style={styles.shadowLine}></View>

      <ScrollView style={styles.itemsSection}>
        <Text style={styles.itemCountText}>{itemCountText}</Text>

        {cartItems.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Ionicons name="cart-outline" size={80} color="#ccc" />
            <Text style={styles.emptyCartText}>Seu carrinho está vazio.</Text>
            <TouchableOpacity
              style={styles.continueShoppingButton}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.continueShoppingText}>
                Continuar Comprando
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          cartItems.map((item) => <CartItem key={item.id} item={item} />)
        )}
      </ScrollView>

      {cartItems.length > 0 && (
        <View style={styles.footerSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryTotal}>R$ {cartTotal.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutButtonText}>Finalizar compra</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={cancelRemoval}
      >
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <Text style={modalStyles.modalTitle}>Remover Item</Text>
            <Text style={modalStyles.modalText}>
              Tem certeza que deseja remover este item do carrinho?
            </Text>
            <View style={modalStyles.modalActions}>
              <Pressable
                style={[modalStyles.modalButton, modalStyles.buttonCancel]}
                onPress={cancelRemoval}
              >
                <Text style={modalStyles.textCancel}>CANCELAR</Text>
              </Pressable>
              <Pressable
                style={[modalStyles.modalButton, modalStyles.buttonConfirm]}
                onPress={confirmRemoval}
              >
                <Text style={modalStyles.textConfirm}>CONFIRMAR</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3ECE2", paddingTop: 40 },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 92,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#052242",
    marginBottom: 12,
  },
  logo: { width: 77, height: 40, marginLeft: 10 },
  shadowLine: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    borderBottomWidth: 0.8,
    marginBottom: 20,
    borderBottomColor: "#00000025",
  },
  itemsSection: { paddingHorizontal: 20, paddingTop: 10, flex: 1 },
  itemCountText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 10,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyCartText: {
    fontSize: 18,
    color: "#999",
    marginTop: 20,
    marginBottom: 30,
  },
  continueShoppingButton: {
    backgroundColor: "#0a2540",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 6,
  },
  continueShoppingText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 4,
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  itemDetails: { flex: 1, paddingTop: 5 },
  itemActions: {
    position: "absolute",
    top: 0,
    right: 0,
    flexDirection: "row",
    gap: 10,
    zIndex: 10,
  },
  actionIcon: { paddingLeft: 10 },
  itemPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
    lineHeight: 18,
  },
  itemInfo: { fontSize: 12, color: "#777" },
  quantityArea: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
    width: "100%",
  },
  quantityContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    overflow: "hidden",
  },
  qtyButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyButtonText: {
    fontSize: 20,
    lineHeight: 20,
    color: "#555",
    fontWeight: "400",
  },
  qtyValueContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyValueText: { fontSize: 14, fontWeight: "500", color: "#333" },
  footerSummary: {
    backgroundColor: "#f3ece2",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  summaryLabel: { fontSize: 16, fontWeight: "700", color: "#333" },
  summaryTotal: { fontSize: 20, fontWeight: "700", color: "#333" },
  checkoutButton: {
    width: "100%",
    padding: 15,
    backgroundColor: "#0a2540",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    textTransform: "capitalize",
  },
});

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 15 },
  modalText: { marginBottom: 25, textAlign: "center", fontSize: 16 },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    borderRadius: 4,
    padding: 10,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonConfirm: { backgroundColor: "#0a2540" },
  textConfirm: { color: "white", fontWeight: "bold" },
  buttonCancel: { backgroundColor: "#ddd" },
  textCancel: { color: "#333", fontWeight: "bold" },
});
