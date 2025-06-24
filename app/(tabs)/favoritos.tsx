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


const { width } = Dimensions.get("window");
const isLargeScreen = width >= 768;


const getNumColumns = () => {
  if (width >= 1024) return 3;
  if (isLargeScreen) return 2;
  return 1;
};

export default function Favoritos() {
  const route = useRoute();
  const navigation = useNavigation();
  const numColumns = getNumColumns();


  const { favoritos } = route.params || { favoritos: [] };


  const renderFavorito = ({ item }: { item: any }) => {
    const isGrid = numColumns > 1;
    const cardStyle = isGrid ? [styles.card, styles.cardGrid] : styles.card;
    const thumbnailStyle = isGrid ? styles.thumbnailGrid : styles.thumbnail;
    const infoAreaStyle = isGrid ? styles.infoAreaGrid : styles.infoArea;

    return (
      <View style={cardStyle}>
        <TouchableOpacity

          // Botão de estrela adicionado, mas sem funcionalidade
          onPress={() => {}}
          style={styles.starButton}
        >
          <Text style={{ fontSize: 28, color: "#ffd700" }}>★</Text>
        </TouchableOpacity>
        <Image
          source={item.thumbnail ? { uri: item.thumbnail } : undefined}
          style={thumbnailStyle}
        />
        <View style={infoAreaStyle}>
          <Text style={styles.nome} numberOfLines={isGrid ? 3 : 2}>{item.title}</Text>
          <Text style={styles.info} numberOfLines={2}>
            Autor: {item.authors ? item.authors.join(", ") : "Desconhecido"}
          </Text>
          <Text style={styles.info}>
            Ano: {item.publishedDate || "N/A"}
          </Text>
          <TouchableOpacity
            style={styles.botaoDetalhes}
            // Navegação para detalhes do livro
            onPress={() => navigation.navigate("detalhes", { livro: item })}
          >
            <Text style={styles.textoDetalhes}>Ver detalhes</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={styles.background}
    >
      <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.container}>
        {/* Botão de voltar para a Home */}
        <TouchableOpacity
           
            style={styles.voltarButton}
            onPress={() => navigation.navigate("home")}
        >
            <Text style={styles.voltarButtonText}>← Voltar para Home</Text>
        </TouchableOpacity>

        <View style={styles.header}>
            <Text style={styles.titulo}>Meus Favoritos</Text>
        </View>
        
        <FlatList
          data={favoritos}
          renderItem={renderFavorito} // Renderiza cada favorito com o layout adequado
          keyExtractor={(item) => item.id}
        // Ajusta o número de colunas dinamicamente
          key={numColumns}
          numColumns={numColumns}
          ListEmptyComponent={
            
            <View style={styles.nenhumContainer}>
              <Text style={styles.nenhumIcon}>📚</Text>
              <Text style={styles.nenhumText}>Nenhum favorito ainda.</Text>
              <Text style={styles.nenhumSubtext}>Volte para a Home e adicione seus livros preferidos!</Text>
            </View>
          }
          contentContainerStyle={styles.lista}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%" },
  container: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 16,
    height: 50,
    justifyContent: 'center',
  },
  voltarButton: {
    position: 'absolute',
    top: 90,
    left: 16,
    backgroundColor: '#a259f7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    zIndex: 1,
    elevation: 3,
   
  },
  voltarButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  titulo: {
    fontSize: isLargeScreen ? 32 : 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#222",
  },
  lista: {
    paddingHorizontal: 8,
    paddingBottom: 24,
  },
 
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    position: 'relative',
    flexDirection: 'row',
    marginBottom: 18,
    width: '100%',
    alignItems: 'center',
    overflow: 'hidden',
    top: 28,
  },
  cardGrid: {
    flexDirection: 'column',
    flex: 1,
    margin: 8,
    alignItems: 'stretch',
  },
  starButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
    padding: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 20
  },
  thumbnail: {
    width: 90,
    height: 120,
    borderRadius: 12,
    margin: 12,
    backgroundColor: '#eee',
  },
  thumbnailGrid: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#eee',
  },
  infoArea: {
    flex: 1,
    padding: 10,
    paddingRight: 15,
    justifyContent: 'center',
  },
  infoAreaGrid: {
    padding: 12,
    alignItems: 'center',
  },
  nome: {
    fontSize: isLargeScreen ? 18 : 17,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#222',
    textAlign: getNumColumns() > 1 ? 'center' : 'left',
  },
  info: {
    fontSize: 15,
    color: '#555',
    marginBottom: 2,
    textAlign: getNumColumns() > 1 ? 'center' : 'left',
  },
  botaoDetalhes: {
    marginTop: 10,
    backgroundColor: '#6c47ff',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 18,
    elevation: 2,
    alignSelf: getNumColumns() > 1 ? 'center' : 'flex-end',
  },
  textoDetalhes: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  nenhumContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: width * 0.2,
  },
  nenhumIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  nenhumText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  nenhumSubtext: {
    fontSize: 16,
    color: '#cccbcb',
    textAlign: 'center',
    lineHeight: 22,
  },
});