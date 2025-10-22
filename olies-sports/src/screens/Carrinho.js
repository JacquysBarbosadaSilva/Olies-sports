import React, { useState, useEffect, useRef } from "react";
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
} from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

const formatCurrency = (value) => {
  return `R$ ${value
    .toFixed(2)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
};

const logoUrl = "https://olies-ports.s3.us-east-1.amazonaws.com/img/logotipo.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZYPPXAY4RCJUVETB%2F20251022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251022T213109Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEH4aCXVzLWVhc3QtMSJHMEUCIF5r9n3SlIlwrWIih6WGQBbM0tGPsmu0u7PQwsqhz%2BPlAiEAzLnLGZ5HWc0lLBpQCkn8Ylt59i%2BhXca%2BCmKpOjpOQeIqgwMINxAAGgw2NzEwNTQ0OTczMzciDDFO1pKJNryxXbCVoyrgAmMmOaS%2BflOGH6QAoaH6tzhwkvCfOw1wekhWdxd6GUAlmfhHfXztqglXHvi2%2FQTpdwpgBqVFOX54Jr9tA%2FG%2BhCyO9tJQWvEGsSpNrutHIdNSftmozjutyzZYH6KLii%2BZaAP%2BCN3lYeN%2FB%2FJLvosSMsCPw7pxl6xzcYL4d6GTtqsKlK6Kcv%2BDODZWmZe3jPJKj1%2FjO%2B203fQN9Dtx1ggorUTAuKfTXzaCnYvkpRPCJ2F6052rKZnjND%2FGmyvflyFr7JnTgKF3HVI164zMpxtFN%2BspzP5UBHMui0wtJR7XtVQbr8rytz4f6DYoDmL4RVxX0uGr2%2BCK1b6tGzOiEdLBsgZ21Z0e4%2Fl%2FjG%2FuxejOUZfQwhJpHnY5kbMu1oyYUKvuKTsyAgktsLbNkMG1WuopiJXaQKj%2Fcl%2BH0x0KXYz3q8mttq8QUpqOmh9rnkc6DxEMGmIWHzB9rLtRvhN7uc9PWXQwgNzkxwY6hwKiJY9COGoIhCXtEd48aip89g9td2xbtd54Ojr2N4wznAW2oK1ufZ9OTiMIo8tuOL%2BUhJigtU3KxkJugU2JVjLAnDctb6AImhjY4ULdlqxP35%2FI3LHaM1t5Wiw7ltZ3laOJ0FsSDiNt693oroD3pSBxs%2B4R01ye3Ra62%2B7w7wkJxGLcPLOHraDS36OLrSQh4jOAjiOey%2BrKt7t6QaiJgFu4qRVWLA23wQzhYTMRNpTzaTzU26pewVPuRhE5y7X82XqNiNdum8vVwd2KO6ZHlOWxKDqhiOV4PnOoNYGuDj99HpOK6hE8UIThBdCQAshDTd6VKPUYsMEc%2FQZQWUvQHDSYA31Mc7nikQ%3D%3D&X-Amz-Signature=11eb26d8eb399b6d2f91c9721a92839350d8a784acefe0d988a547de57c03b6f&X-Amz-SignedHeaders=host&response-content-disposition=inline";

const INITIAL_CART_STATE = [];

const CartScreen = ({ navigation }) => {
  const route = useRoute();
  const [cartItems, setCartItems] = useState(INITIAL_CART_STATE);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

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
          return [...prevItems, { ...newItem, quantity: 1, isFavorite: false }];
        }
      });

      navigation.setParams({ newItem: undefined });
    }
  }, [route.params?.newItem]);

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleQuantityChange = (itemId, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemoveItem = (item) => {
    setItemToRemove(item);
    setIsModalVisible(true);
  };

  const confirmRemoval = () => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemToRemove.id)
    );
    setIsModalVisible(false);
    setItemToRemove(null);
  };

  const cancelRemoval = () => {
    setIsModalVisible(false);
    setItemToRemove(null);
  };

  const handleFavoriteToggle = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const cartTotal = calculateTotal();
  const itemCountText =
    cartItems.length === 1 ? "1 item" : `${cartItems.length} itens`;

  const CartItem = ({ item }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handleFavAnimation = () => {
      handleFavoriteToggle(item.id);
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

    const heartIconName = item.isFavorite ? "heart" : "heart-outline";
    const heartIconColor = item.isFavorite ? "#0a2540" : "#999";

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

          <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
          <Text style={styles.itemDescription}>{item.name}</Text>
          <Text style={styles.itemInfo}>{item.installments}</Text>

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

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.titulo}>Carrinho</Text>
        <Image source={{uri: logoUrl}} style={styles.logo} />
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
            <Text style={styles.summaryTotal}>{formatCurrency(cartTotal)}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton}>
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
