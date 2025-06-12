import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { useRoute, useNavigation } from '@react-navigation/native';

const backgroundImage = require('../../assets/images/fundolivraria.png');

export default function Detalhes() {
  const route = useRoute();
  const navigation = useNavigation();
  // @ts-ignore
  const { livro } = route.params;

  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={styles.background}
    >
      <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.box}>
          <TouchableOpacity
            style={styles.voltarButton}
            onPress={() => navigation.navigate('home')}
          >
            <Text style={styles.voltarButtonText}>← Voltar para Home</Text>
          </TouchableOpacity>
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
          <View style={styles.descricaoBox}>
            <Text style={styles.label}>Descrição:</Text>
            <Text style={styles.descricao}>
              {livro.description ? livro.description : 'Não disponível.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

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
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  box: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  voltarButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    backgroundColor: '#a259f7',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    elevation: 2,
  },
  voltarButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
    color: '#6c47ff',
    letterSpacing: 1,
  },
  thumbnail: {
    width: 160,
    height: 220,
    borderRadius: 12,
    marginBottom: 18,
    backgroundColor: '#eee',
    borderWidth: 2,
    borderColor: '#a259f7',
  },
  info: {
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    color: '#6c47ff',
  },
  descricaoBox: {
    width: '100%',
    backgroundColor: '#f3f0fa',
    borderRadius: 12,
    padding: 14,
    marginTop: 18,
    shadowColor: '#a259f7',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  descricao: {
    fontSize: 16,
    color: '#444',
    marginTop: 8,
    textAlign: 'justify',
  },
});