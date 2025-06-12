import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import usuariosCadastrados from '../../data/usuarios.json'; 


interface Usuario {
  id: string;
  username: string;
  password: string;
  nomeCompleto: string;
}

interface LoginState {
  isLoggedIn: boolean;
  loggedInUser?: Usuario;
}


const LOGIN_STATE_FILENAME = 'login_session_state.json';
const loginStateFilePath = `${FileSystem.documentDirectory}${LOGIN_STATE_FILENAME}`;

export default function App() {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUserData, setLoggedInUserData] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState('');


  const saveLoginState = async (loggedIn: boolean, user?: Usuario) => {
    try {
      const stateToSave: LoginState = { isLoggedIn: loggedIn, loggedInUser: user };
      await FileSystem.writeAsStringAsync(loginStateFilePath, JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Erro ao salvar estado de login:', error);
    }
  };


  useEffect(() => {
    const loadLoginState = async () => {
      setIsLoading(true);
      try {
        const fileInfo = await FileSystem.getInfoAsync(loginStateFilePath);
        if (fileInfo.exists) {
          const storedStateString = await FileSystem.readAsStringAsync(loginStateFilePath);
          const loadedState: LoginState = JSON.parse(storedStateString);
          setIsLoggedIn(loadedState.isLoggedIn);
          if (loadedState.isLoggedIn && loadedState.loggedInUser) {
            setLoggedInUserData(loadedState.loggedInUser);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar estado de login:', error);
        setIsLoggedIn(false);
        setLoggedInUserData(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadLoginState();
  }, []);

 
  const handleLogin = () => {
    setLoginError('');
    const userFound = (usuariosCadastrados as Usuario[]).find(
      (user) => user.username === usernameInput.trim() && user.password === passwordInput
    );
    if (userFound) {
      setIsLoggedIn(true);
      setLoggedInUserData(userFound);
      saveLoginState(true, userFound);
      setUsernameInput('');
      setPasswordInput('');
    } else {
      setLoginError('Usuário ou senha inválidos!');
      setIsLoggedIn(false);
      setLoggedInUserData(null);
      saveLoginState(false);
    }
  };

  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUserData(null);
    saveLoginState(false);
    setLoginError('');
  };

  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.containerCentered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Verificando sessão...</Text>
      </SafeAreaView>
    );
  }

 
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.content}>
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Usuário"
            value={usernameInput}
            onChangeText={setUsernameInput}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={passwordInput}
            onChangeText={setPasswordInput}
            secureTextEntry
          />
          {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}
          <View style={styles.buttonContainer}>
            <Button title="Entrar" onPress={handleLogin} color="#ff0000" />
          </View>
        </View>
      </SafeAreaView>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f4f4', // cor de fundo
  },
  containerCentered: { // Tela de carregamento
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f4f4',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
    
  },
  input: {
    height: 50,
    borderColor: '#ff0000',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#a59898',
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
   
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
    color: '#28a745',
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
});



