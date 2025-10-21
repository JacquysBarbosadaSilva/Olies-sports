import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const productData = {
  sizes: ["38", "39", "40", "41", "42", "43", "44", "45", "46"],
  description:
    "Este tênis? Ele foi feito para ser diferente. Equipado com tecnologia pronta para as quadras, o Zion 4 ajuda a impulsionar um jogo explosivo. A unidade Air Zoom em toda a extensão e a entressola drop-in oferecem o amortecimento responsivo que seus movimentos verticais de alta energia exigem.",
  rating: 4.5,
};

const PRIMARY_COLOR = "#052242";
const BACKGROUND_COLOR = "#f3ece2";
const BORDER_COLOR = "#d1cac1";

const SizeItem = ({ size, isSelected, onPress }) => (
  <TouchableOpacity
    key={size}
    style={[styles.sizeItem, isSelected && styles.sizeItemSelected]}
    onPress={onPress}
  >
    <Text style={[styles.sizeText, isSelected && styles.sizeTextSelected]}>
      {size}
    </Text>
  </TouchableOpacity>
);

const FitBar = ({ label, positionPercentage = 50 }) => {
  return (
    <View style={styles.fitBarSection}>
      <Text style={styles.fitBarLabel}>{label}</Text>

      <View style={styles.fitBarTopRow}>
        <Text style={styles.fitBarTopText}>Muito pequeno</Text>
        <Text style={[styles.fitBarTopText, styles.fitBarCenterText]}>
          Fiel ao tamanho
        </Text>
        <Text style={styles.fitBarTopText}>Muito grande</Text>
      </View>

      <View style={styles.barLineContainer}>
        <View style={styles.barLine}>
          <View
            style={[styles.barIndicator, { left: `${positionPercentage}%` }]}
          />
          <View style={styles.barLineFill} />
          <View style={styles.barLineCenterDark} />
        </View>
      </View>
    </View>
  );
};

const DetalhesProduto = () => {
  const navigation = useNavigation();
  const [selectedSize, setSelectedSize] = useState("40");

  const handleSelectSize = (size) => {
    setSelectedSize(size);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const totalStars = 5;
    let stars = [];
    const starColor = PRIMARY_COLOR;

    for (let i = 0; i < totalStars; i++) {
      if (i < fullStars) {
        stars.push(
          <Ionicons key={i} name="star" size={20} color={starColor} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons
            key={i}
            name="star-half-sharp"
            size={20}
            color={starColor}
          />
        );
      } else {
        stars.push(
          <Ionicons key={i} name="star-outline" size={20} color={starColor} />
        );
      }
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.sizeSelectionContainer}>
        <View style={styles.sizeTitleRow}>
          <Text style={styles.sizeTitle}>Tamanho</Text>
          <View style={styles.rulerIconBox}>
          </View>
        </View>

        <View style={styles.sizesRow}>
          {productData.sizes.map((size) => (
            <SizeItem
              key={size}
              size={size}
              isSelected={size === selectedSize}
              onPress={() => handleSelectSize(size)}
            />
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.addToCartButton}>
        <Text style={styles.addToCartText}>Adicionar ao carrinho</Text>
        <Ionicons
          name="bag-handle-outline"
          size={20}
          color="#FFFFFF"
          style={styles.cartIcon}
        />
      </TouchableOpacity>

      <View style={styles.paymentIconsContainer}>
        <TouchableOpacity style={styles.paymentIconItem}>
          <Ionicons name="card-outline" size={18} color={PRIMARY_COLOR} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.paymentIconItem}>
           <Image source={require("../assets/pix-icone.png")} style={{ width: 18, height: 18 }} />
        </TouchableOpacity>
      </View>

      <View style={styles.productDetailSection}>
        <Text style={styles.productDetailTitle}>Jordan Zion 4</Text>
        <Text
          style={[styles.productDetailDescription, styles.fontKantumruyMedium]}
        >
          {productData.description}
        </Text>
      </View>

      <View style={styles.reviewsSection}>
        <Text style={styles.reviewsTitle}>Avaliações e comentários</Text>

        <View style={styles.ratingRow}>
          <Text style={styles.ratingValue}>
            {productData.rating.toFixed(1)}
          </Text>
          {renderStars(productData.rating)}
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("Comentarios")}
        >
          <Text style={styles.commentsLink}>Comentários</Text>
        </TouchableOpacity>

        <FitBar label="Tamanho" positionPercentage={50} />
        <FitBar label="Largura" positionPercentage={50} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  fontKantumruySemiBold: {
    fontFamily: "Kantumruy Pro SemiBold",
  },
  fontKantumruyMedium: {
    fontFamily: "Kantumruy Pro Medium",
  },
  sectionPadding: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  sizeSelectionContainer: {
    paddingVertical: 15,
  },
  sizeTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sizeTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginRight: 10,
  },
  rulerIconBox: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  sizesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
    width: "100%",
    borderTopColor: BORDER_COLOR,
    paddingVertical: 4,
  },
  sizeItem: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  sizeItemSelected: {},
  sizeText: {
    color: "#999999",
    fontSize: 14,
    fontWeight: "400",
  },
  sizeTextSelected: {
    color: "#333333",
    fontWeight: "600",
  },

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
  addToCartText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  cartIcon: {},

  paymentIconsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  paymentIconItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },

  productDetailSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  productDetailTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 10,
  },
  productDetailDescription: {
    fontSize: 16,
    lineHeight: 20,
    color: "#555555",
  },

  reviewsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#f3ece2",
    borderTopWidth: 1,
    borderTopColor: "#d1cac1",
  },
  reviewsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  ratingValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333333",
    marginRight: 10,
  },
  starsContainer: {
    flexDirection: "row",
  },
  commentsLink: {
    fontSize: 14,
    color: "#555555",
    textDecorationLine: "underline",
    marginBottom: 10,
  },

  fitBarSection: {
    marginBottom: 20,
    marginTop: 15,
  },
  fitBarLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
    color: "#333333",
  },
  fitBarTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  fitBarTopText: {
    fontSize: 12,
    color: "#777777",
  },
  fitBarCenterText: {
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -40 }],
    fontWeight: "600",
    color: PRIMARY_COLOR,
  },
  barLineContainer: {
    position: "relative",
    height: 10,
    paddingVertical: 3,
  },
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
  barLineFill: {},
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
