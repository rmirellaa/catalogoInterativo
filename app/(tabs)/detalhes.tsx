import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function Detalhes() {
  const route = useRoute();
  // @ts-ignore
  const { livro } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>{livro.title}</Text>
      {livro.thumbnail && (
        <Image source={{ uri: livro.thumbnail }} style={styles.thumbnail} />
      )}
      <Text style={styles.info}>
        <Text style={styles.label}>Autor:</Text> {livro.authors ? livro.authors.join(', ') : 'Desconhecido'}
      </Text>
      <Text style={styles.info}>
        <Text style={styles.label}>Ano:</Text> {livro.publishedDate || 'N/A'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#e0eafc',
    flexGrow: 1,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
    color: '#222',
  },
  thumbnail: {
    width: 160,
    height: 220,
    borderRadius: 12,
    marginBottom: 18,
    backgroundColor: '#eee',
  },
  info: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    color: '#007bff',
  },
});