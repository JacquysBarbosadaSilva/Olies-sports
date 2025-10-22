import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const logoUrl = "https://olies-ports.s3.us-east-1.amazonaws.com/img/logotipo.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZYPPXAY4RCJUVETB%2F20251022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251022T213109Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEH4aCXVzLWVhc3QtMSJHMEUCIF5r9n3SlIlwrWIih6WGQBbM0tGPsmu0u7PQwsqhz%2BPlAiEAzLnLGZ5HWc0lLBpQCkn8Ylt59i%2BhXca%2BCmKpOjpOQeIqgwMINxAAGgw2NzEwNTQ0OTczMzciDDFO1pKJNryxXbCVoyrgAmMmOaS%2BflOGH6QAoaH6tzhwkvCfOw1wekhWdxd6GUAlmfhHfXztqglXHvi2%2FQTpdwpgBqVFOX54Jr9tA%2FG%2BhCyO9tJQWvEGsSpNrutHIdNSftmozjutyzZYH6KLii%2BZaAP%2BCN3lYeN%2FB%2FJLvosSMsCPw7pxl6xzcYL4d6GTtqsKlK6Kcv%2BDODZWmZe3jPJKj1%2FjO%2B203fQN9Dtx1ggorUTAuKfTXzaCnYvkpRPCJ2F6052rKZnjND%2FGmyvflyFr7JnTgKF3HVI164zMpxtFN%2BspzP5UBHMui0wtJR7XtVQbr8rytz4f6DYoDmL4RVxX0uGr2%2BCK1b6tGzOiEdLBsgZ21Z0e4%2Fl%2FjG%2FuxejOUZfQwhJpHnY5kbMu1oyYUKvuKTsyAgktsLbNkMG1WuopiJXaQKj%2Fcl%2BH0x0KXYz3q8mttq8QUpqOmh9rnkc6DxEMGmIWHzB9rLtRvhN7uc9PWXQwgNzkxwY6hwKiJY9COGoIhCXtEd48aip89g9td2xbtd54Ojr2N4wznAW2oK1ufZ9OTiMIo8tuOL%2BUhJigtU3KxkJugU2JVjLAnDctb6AImhjY4ULdlqxP35%2FI3LHaM1t5Wiw7ltZ3laOJ0FsSDiNt693oroD3pSBxs%2B4R01ye3Ra62%2B7w7wkJxGLcPLOHraDS36OLrSQh4jOAjiOey%2BrKt7t6QaiJgFu4qRVWLA23wQzhYTMRNpTzaTzU26pewVPuRhE5y7X82XqNiNdum8vVwd2KO6ZHlOWxKDqhiOV4PnOoNYGuDj99HpOK6hE8UIThBdCQAshDTd6VKPUYsMEc%2FQZQWUvQHDSYA31Mc7nikQ%3D%3D&X-Amz-Signature=11eb26d8eb399b6d2f91c9721a92839350d8a784acefe0d988a547de57c03b6f&X-Amz-SignedHeaders=host&response-content-disposition=inline";

const PRIMARY_COLOR = "#052242";
const BACKGROUND_COLOR = "#f3ece2";
const CARD_BACKGROUND_COLOR = "#ded7cd";

const mockReviews = [
  {
    id: 1,
    title: "Conforto e performance em alto nível!",
    rating: 5,
    date: "SEP 08, 2025",
    content:
      "Comprei o Jordan Zion 4 e simplesmente superou todas as minhas expectativas! O tênis é extremamente confortável, o amortecimento faz muita diferença tanto no dia a dia quanto nas quadras, e o design é incrível — moderno e cheio de estilo. A estabilidade também é ótima, dá muita confiança nos movimentos rápidos.",
  },
  {
    id: 2,
    title: "Ótimo tênis, mas poderia ser mais leve",
    rating: 3.5,
    date: "SEP 08, 2025",
    content:
      "O Jordan Zion 4 é um tênis de altíssima qualidade! Muito confortável, com excelente amortecimento e um design bonito que chama atenção. A performance em quadra é realmente boa, trazendo firmeza nos movimentos. Só não dou 5 estrelas porque achei que poderia ser um pouco mais leve, mas ainda assim é uma ótima escolha e recomendo bastante",
  },
];

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const totalStars = 5;
  let stars = [];
  const starColor = PRIMARY_COLOR;
  const starSize = 18;

  for (let i = 0; i < totalStars; i++) {
    if (i < fullStars) {
      stars.push(
        <Ionicons key={i} name="star" size={starSize} color={starColor} />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <Ionicons
          key={i}
          name="star-half-sharp"
          size={starSize}
          color={starColor}
        />
      );
    } else {
      stars.push(
        <Ionicons
          key={i}
          name="star-outline"
          size={starSize}
          color={starColor}
        />
      );
    }
  }
  return <View style={styles.starsContainer}>{stars}</View>;
};

const ReviewCard = ({ review }) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <View style={styles.starsRow}>{renderStars(review.rating)}</View>
      <Text style={styles.reviewDate}>{review.date}</Text>
    </View>

    <Text style={styles.reviewTitle}>{review.title}</Text>
    <Text style={styles.reviewContent}>{review.content}</Text>
  </View>
);

const Comentarios = () => {
  return (
    <ScrollView style={styles.container}>

      <View style={styles.reviewsList}>
        {mockReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </View>

      <TouchableOpacity style={styles.loadMoreButton}>
        <Text style={styles.loadMoreText}>Aguardando mais comentários</Text>
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <View style = {styles.linhaLogotipo}></View>
        <Image source={{uri: logoUrl}} style={{ width: 77, height: 77 }}/>
        <View style = {styles.linhaLogotipo}></View>
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },

  reviewsList: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  reviewCard: {
    backgroundColor: CARD_BACKGROUND_COLOR,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  starsContainer:{
    flexDirection: "row",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  starsRow: {
    flexDirection: "row",
  },
  reviewDate: {
    fontSize: 12,
    color: "#999999",
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginBottom: 8,
  },
  reviewContent: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333333",
  },

  loadMoreButton: {
    backgroundColor: PRIMARY_COLOR,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 30,
  },
  loadMoreText: {
    color: "#FFFFFF",
    fontSize: 16, 
    fontWeight: "bold",
  },

  logoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    marginLeft: 5,
    fontSize: 18,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    fontStyle: "italic",
  },


  linhaLogotipo:{
    width: 150,
    height: 2,
    backgroundColor: "#00000025",
    marginHorizontal: 10,
  }
});

export default Comentarios;
