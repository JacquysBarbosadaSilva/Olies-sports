import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";

const logoUrl =
  "https://olies-ports.s3.us-east-1.amazonaws.com/img/logotipo.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZYPPXAY4RCJUVETB%2F20251022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251022T213109Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEH4aCXVzLWVhc3QtMSJHMEUCIF5r9n3SlIlwrWIih6WGQBbM0tGPsmu0u7PQwsqhz%2BPlAiEAzLnLGZ5HWc0lLBpQCkn8Ylt59i%2BhXca%2BCmKpOjpOQeIqgwMINxAAGgw2NzEwNTQ0OTczMzciDDFO1pKJNryxXbCVoyrgAmMmOaS%2BflOGH6QAoaH6tzhwkvCfOw1wekhWdxd6GUAlmfhHfXztqglXHvi2%2FQTpdwpgBqVFOX54Jr9tA%2FG%2BhCyO9tJQWvEGsSpNrutHIdNSftmozjutyzZYH6KLii%2BZaAP%2BCN3lYeN%2FB%2FJLvosSMsCPw7pxl6xzcYL4d6GTtqsKlK6Kcv%2BDODZWmZe3jPJKj1%2FjO%2B203fQN9Dtx1ggorUTAuKfTXzaCnYvkpRPCJ2F6052rKZnjND%2FGmyvflyFr7JnTgKF3HVI164zMpxtFN%2BspzP5UBHMui0wtJR7XtVQbr8rytz4f6DYoDmL4RVxX0uGr2%2BCK1b6tGzOiEdLBsgZ21Z0e4%2Fl%2FjG%2FuxejOUZfQwhJpHnY5kbMu1oyYUKvuKTsyAgktsLbNkMG1WuopiJXaQKj%2Fcl%2BH0x0KXYz3q8mttq8QUpqOmh9rnkc6DxEMGmIWHzB9rLtRvhN7uc9PWXQwgNzkxwY6hwKiJY9COGoIhCXtEd48aip89g9td2xbtd54Ojr2N4wznAW2oK1ufZ9OTiMIo8tuOL%2BUhJigtU3KxkJugU2JVjLAnDctb6AImhjY4ULdlqxP35%2FI3LHaM1t5Wiw7ltZ3laOJ0FsSDiNt693oroD3pSBxs%2B4R01ye3Ra62%2B7w7wkJxGLcPLOHraDS36OLrSQh4jOAjiOey%2BrKt7t6QaiJgFu4qRVWLA23wQzhYTMRNpTzaTzU26pewVPuRhE5y7X82XqNiNdum8vVwd2KO6ZHlOWxKDqhiOV4PnOoNYGuDj99HpOK6hE8UIThBdCQAshDTd6VKPUYsMEc%2FQZQWUvQHDSYA31Mc7nikQ%3D%3D&X-Amz-Signature=11eb26d8eb399b6d2f91c9721a92839350d8a784acefe0d988a547de57c03b6f&X-Amz-SignedHeaders=host&response-content-disposition=inline";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Tabs"); // ✅ vai para o TabNavigator
    }, 2000); // ⏱️ tempo do splash (3 segundos)

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={{ uri: logoUrl }} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3ECE2",
  },
  logo: {
    width: 300,
    height: 300,
  },
});
