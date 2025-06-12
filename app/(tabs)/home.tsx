import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';

const backgroundImage = require('../../assets/images/fundolivraria.png');

interface Livro {
  id: string;
  title: string;
  authors?: string[];
  thumbnail?: string;
  publishedDate?: string;
  description?: string;
}

const assuntos = [
  { label: 'Ficção Científica', value: 'ficção científica' },
  { label: 'Romance', value: 'romance' },
  { label: 'Aventura', value: 'aventura' },
  { label: 'Terror', value: 'terror' },
  { label: 'Fantasia', value: 'fantasia' },
];

export default function Home() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);
  const [assunto, setAssunto] = useState('ficção científica');
  const [favoritos, setFavoritos] = useState<Livro[]>([]);
  const navigation = useNavigation();

  const buscarLivros = async (tema: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(tema)}`
      );
      const data = await response.json();
      const livrosFormatados: Livro[] = (data.items || []).map((item: any) => ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors,
        thumbnail: item.volumeInfo.imageLinks?.thumbnail,
        publishedDate: item.volumeInfo.publishedDate,
        description: item.volumeInfo.description,
      }));
      setLivros(livrosFormatados);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      setLivros([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    buscarLivros(assunto);
  }, [assunto]);

  const toggleFavorito = (livro: Livro) => {
    setFavoritos((prev) => {
      if (prev.some(f => f.id === livro.id)) {
        return prev.filter(f => f.id !== livro.id);
      }
      return [...prev, livro];
    });
  };

  if (loading) {
    return (
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={styles.background}
      >
        <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      </ImageBackground>
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
        <View style={styles.topBar}>
          <Text style={styles.titulo}>Livros por Assunto</Text>
          <TouchableOpacity
            style={styles.favButton}
            onPress={() => navigation.navigate('favoritos', { favoritos })}
            activeOpacity={0.8}
          >
            <Text style={styles.favButtonText}>★ Ver Favoritos</Text>
          </TouchableOpacity>
        </View>
        <View style={{ width: '100%', alignItems: 'center', marginBottom: 10 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.buscaContent}
            style={styles.buscaArea}
          >
            {assuntos.map((a, idx) => (
              <TouchableOpacity
                key={a.value}
                style={[
                  styles.botaoCategoria,
                  assunto === a.value && styles.botaoCategoriaAtivo,
                  idx === assuntos.length - 1 && { marginRight: 0 },
                ]}
                onPress={() => setAssunto(a.value)}
                activeOpacity={0.85}
              >
                <Text style={styles.textoBotaoCategoria}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <FlatList
          data={livros}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Text style={styles.nenhum}>Nenhum livro encontrado.</Text>
          }
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity
                onPress={() => toggleFavorito(item)}
                style={styles.starButton}
              >
                <Text style={{
                  fontSize: 26,
                  color: favoritos.some(f => f.id === item.id) ? '#ffd700' : '#bbb'
                }}>
                  ★
                </Text>
              </TouchableOpacity>
              <Image
                source={
                  item.thumbnail
                    ? { uri: item.thumbnail }
                    : undefined
                }
                style={styles.thumbnail}
              />
              <View style={styles.infoArea}>
                <Text style={styles.nome}>{item.title}</Text>
                <Text style={styles.info}>
                  Autor: {item.authors ? item.authors.join(', ') : 'Desconhecido'}
                </Text>
                <Text style={styles.info}>
                  Ano: {item.publishedDate || 'N/A'}
                </Text>
                <TouchableOpacity
                  style={styles.botaoDetalhes}
                  onPress={() => {
                    navigation.navigate('detalhes', { livro: item });
                  }}
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

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 8,
  },
  favButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    flexDirection: 'row',
    alignItems: 'center',
  },
  favButtonText: {
    color: '#a259f7',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buscaArea: {
    flexDirection: 'row',
    marginBottom: 20,
    alignSelf: 'center',
    maxHeight: 60,
  },
  buscaContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  botaoCategoria: {
    marginRight: 12,
    backgroundColor: '#6c47ff',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
    height: 44,
    elevation: 4,
    shadowColor: '#6c47ff',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    borderWidth: 2,
    borderColor: 'transparent',
    marginVertical: 4,
  },
  botaoCategoriaAtivo: {
    backgroundColor: '#a259f7',
    borderColor: '#fff',
    borderWidth: 2,
    elevation: 7,
    shadowColor: '#a259f7',
  },
  textoBotaoCategoria: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  lista: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 18,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    alignItems: 'center',
    width: width * 0.92,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    position: 'relative',
  },
  starButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
  },
  thumbnail: {
    width: 90,
    height: 120,
    borderRadius: 12,
    margin: 12,
    backgroundColor: '#eee',
  },
  infoArea: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#222',
  },
  info: {
    fontSize: 15,
    color: '#555',
    marginBottom: 2,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nenhum: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16,
  },
  botaoDetalhes: {
    marginTop: 10,
    backgroundColor: '#6c47ff',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 18,
    alignSelf: 'flex-end',
    elevation: 2,
  },
  textoDetalhes: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
});