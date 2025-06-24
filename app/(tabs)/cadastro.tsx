import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';

// Importe o JSON de usuários (apenas para validação, não salva de verdade)
import usuarios from '../../data/usuarios.json';

const backgroundImage = require('../../assets/images/fundolivraria.png');

export default function CadastroScreen() {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigation = useNavigation();

  const handleCadastro = () => {
    if (!username || !senha || !confirmarSenha) {
      setErro('Preencha todos os campos!');
      return;
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem!');
      return;
    }
    const usuarioExistente = usuarios.find((u) => u.username === username);
    if (usuarioExistente) {
      setErro('Nome de usuário já existe!');
      return;
    }
    setErro('');
    Alert.alert('Cadastro realizado!', 'Agora você pode fazer login.', [
      { text: 'OK', onPress: () => navigation.navigate('Login') },
    ]);

  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={styles.background}
      >
        <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.overlay}
        >
          <BlurView intensity={70} tint="light" style={styles.loginBox}>
            <Text style={styles.title}>Cadastre-se aqui</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome de usuário"
              placeholderTextColor="#333"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#333"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmar senha"
              placeholderTextColor="#333"
              secureTextEntry
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />
            {erro ? <Text style={styles.erro}>{erro}</Text> : null}
            <Pressable style={styles.button} onPress={handleCadastro}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </Pressable>
            <View style={styles.cadastroContainer}>
              <Text style={styles.cadastroText}>Já tem conta?</Text>
              <Pressable onPress={() => navigation.navigate('index')}>
                <Text style={styles.cadastroLink}> Entrar</Text>
              </Pressable>
            </View>
          </BlurView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loginBox: {
    width: '90%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#ffffffcc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#d10000', 
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cadastroContainer: {
    flexDirection: 'row',
    marginTop: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cadastroText: {
    color: '#333',
    fontSize: 15,
  },
  cadastroLink: {
    color: '#d10000',
    fontWeight: 'bold',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  erro: {
    color: '#d10000',
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 15,
  },
});