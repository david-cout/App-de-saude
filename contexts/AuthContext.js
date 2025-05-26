import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se o usuário já está autenticado
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const userString = await SecureStore.getItemAsync('user');
      if (userString) {
        const userData = JSON.parse(userString);
        setUser(userData);
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const storeUser = async (userData) => {
    try {
      await SecureStore.setItemAsync('user', JSON.stringify(userData));
    } catch (error) {
      console.log('Error storing user data:', error);
    }
  };

  const signIn = async (email, password) => {
    try {
      setIsLoading(true);
      
      // Simulação de autenticação (em um app real, isso seria uma chamada de API)
      if (email && password) {
        // Simular atraso de rede
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const userData = {
          id: '1',
          name: 'João da Silva',
          email: email,
        };
        
        setUser(userData);
        storeUser(userData);
        return true;
      } else {
        Alert.alert('Erro', 'Email ou senha incorretos');
        return false;
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao fazer login. Tente novamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name, email, password) => {
    try {
      setIsLoading(true);
      
      // Simulação de registro (em um app real, isso seria uma chamada de API)
      if (name && email && password) {
        // Simular atraso de rede
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const userData = {
          id: '1',
          name: name,
          email: email,
        };
        
        setUser(userData);
        storeUser(userData);
        Alert.alert('Sucesso', 'Conta criada com sucesso!');
        return true;
      } else {
        Alert.alert('Erro', 'Preencha todos os campos');
        return false;
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar conta. Tente novamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      
      // Simulação de login com Google (em um app real, isso usaria expo-auth-session)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: '2',
        name: 'Usuário Google',
        email: 'usuario.google@gmail.com',
      };
      
      setUser(userData);
      storeUser(userData);
      return true;
    } catch (error) {
      Alert.alert('Erro', 'Falha ao fazer login com Google. Tente novamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithApple = async () => {
    try {
      setIsLoading(true);
      
      // Simulação de login com Apple (em um app real, isso usaria expo-auth-session)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: '3',
        name: 'Usuário Apple',
        email: 'usuario.apple@icloud.com',
      };
      
      setUser(userData);
      storeUser(userData);
      return true;
    } catch (error) {
      Alert.alert('Erro', 'Falha ao fazer login com Apple. Tente novamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await SecureStore.deleteItemAsync('user');
      setUser(null);
    } catch (error) {
      console.log('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signInWithGoogle,
        signInWithApple,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};