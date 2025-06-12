import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";

const backgroundImage = require("../../assets/images/fundolivraria.png");

export default function Favoritos() {
  const route = useRoute();
  const navigation = useNavigation();
  // @ts-ignore
  const { favoritos } = route.params || { favoritos: [] };

  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={styles.background}
    >
      <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.voltarButton}
          onPress={() => navigation.navigate("home")}
        >
          <Text style={styles.voltarButtonText}>← Voltar para Home</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Meus Favoritos</Text>
        <FlatList
          data={favoritos}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.nenhum}>Nenhum favorito ainda.</Text>
          }
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity
                onPress={() => {
                  // Remover favorito (apenas local)
                  // Implemente se quiser remover aqui também
                }}
                style={styles.starButton}
              >
                <Text style={{ fontSize: 26, color: "#ffd700" }}>★</Text>
              </TouchableOpacity>
              <Image
                source={item.thumbnail ? { uri: item.thumbnail } : undefined}
                style={styles.thumbnail}
              />
              <View style={styles.infoArea}>
                <Text style={styles.nome}>{item.title}</Text>
                <Text style={styles.info}>
                  Autor:{" "}
                  {item.authors ? item.authors.join(", ") : "Desconhecido"}
                </Text>
                <Text style={styles.info}>
                  Ano: {item.publishedDate || "N/A"}
                </Text>
                <TouchableOpacity
                  style={styles.botaoDetalhes}
                  onPress={() =>
                    navigation.navigate("detalhes", { livro: item })
                  }
                >
                  <Text style={styles.textoDetalhes}>Ver detalhes</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </ImageBackground>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 18,
    textAlign: "center",
    color: "#222",
    letterSpacing: 1,
  },
  lista: {
    alignItems: "center",
    paddingBottom: 24,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 18,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    alignItems: "center",
    width: width * 0.92,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    position: "relative",
  },
  thumbnail: {
    width: 90,
    height: 120,
    borderRadius: 12,
    margin: 12,
    backgroundColor: "#eee",
  },
  infoArea: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#222",
  },
  info: {
    fontSize: 15,
    color: "#555",
    marginBottom: 2,
  },
  nenhum: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
    fontSize: 16,
  },
  voltarButton: {
    alignSelf: "flex-start",
    marginBottom: 10,
    backgroundColor: "#a259f7",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    elevation: 2,
  },
  voltarButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  botaoDetalhes: {
  marginTop: 10,
  backgroundColor: '#6c47ff', // roxo de destaque
  borderRadius: 16,
  paddingVertical: 10,
  paddingHorizontal: 22,
  alignSelf: 'flex-end',
  elevation: 3,
  shadowColor: '#6c47ff',
  shadowOpacity: 0.18,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 3 },
},
textoDetalhes: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
  letterSpacing: 0.5,
  textAlign: 'center',
},
});
