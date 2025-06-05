import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

interface Livro {
  id: string;
  title: string;
  authors?: string[];
  thumbnail?: string;
  publishedDate?: string;
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
  const navigation = useNavigation();

  const buscarLivros = async (tema: string) => {
    setLoading(true);
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(tema)}`);
      const data = await response.json();
      const livrosFormatados: Livro[] = (data.items || []).map((item: any) => ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors,
        thumbnail: item.volumeInfo.imageLinks?.thumbnail,
        publishedDate: item.volumeInfo.publishedDate,
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

  if (loading) {
    return (
      <LinearGradient colors={['#e0eafc', '#cfdef3']} style={styles.gradient}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#e0eafc', '#cfdef3']} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Livros por Assunto</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.buscaArea} contentContainerStyle={styles.buscaContent}>
          {assuntos.map(a => (
            <TouchableOpacity
              key={a.value}
              style={[styles.botao, assunto === a.value && styles.botaoAtivo]}
              onPress={() => setAssunto(a.value)}
              activeOpacity={0.8}
            >
              <Text style={styles.textoBotao}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <FlatList
          data={livros}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text style={styles.nenhum}>Nenhum livro encontrado.</Text>}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            <View style={styles.card}>
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
    </LinearGradient>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
    color: '#222',
    letterSpacing: 1,
  },
  buscaArea: {
    flexDirection: 'row',
    marginBottom: 20,
    alignSelf: 'center',
    maxHeight: 50,
  },
  buscaContent: {
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  botao: {
    marginRight: 10,
    backgroundColor: '#007bff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 40,
    elevation: 3,
    shadowColor: '#007bff',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  botaoAtivo: {
    backgroundColor: '#0056b3',
    elevation: 6,
    shadowColor: '#0056b3',
  },
  textoBotao: {
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
    backgroundColor: '#00b894',
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