import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { backgroundImage } from '@/assets/background';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { Heart, ArrowLeft } from 'lucide-react-native';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { signUp } = useAuth();

  const validate = () => {
    const newErrors = {};
    
    if (!name) newErrors.name = 'Nome é obrigatório';
    if (!email) newErrors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email inválido';
    
    if (!password) newErrors.password = 'Senha é obrigatória';
    else if (password.length < 6) newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    
    if (password !== confirmPassword) newErrors.confirmPassword = 'Senhas não conferem';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = () => {
    if (validate()) {
      signUp(name, email, password);
    }
  };

  return (
    <ImageBackground
      source={{ uri: backgroundImage }}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft color={COLORS.text.primary} size={24} />
          </TouchableOpacity>
          
          <View style={styles.header}>
            <Heart color={COLORS.secondary.main} size={36} />
            <Text style={styles.title}>Saúde na palma da mão</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>Crie sua conta</Text>
            
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Nome completo"
              placeholderTextColor={COLORS.text.muted}
              value={name}
              onChangeText={setName}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Email"
              placeholderTextColor={COLORS.text.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Senha"
              placeholderTextColor={COLORS.text.muted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            
            <TextInput
              style={[styles.input, errors.confirmPassword && styles.inputError]}
              placeholder="Confirmar senha"
              placeholderTextColor={COLORS.text.muted}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)')}>
                <Text style={styles.footerLink}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              Ao se cadastrar, você concorda com nossos{' '}
              <Text style={styles.termsLink}>Termos de Serviço</Text> e{' '}
              <Text style={styles.termsLink}>Política de Privacidade</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.2,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    marginTop: 40,
    marginBottom: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: COLORS.text.primary,
    marginTop: 10,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.neutral.mediumGray,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
    backgroundColor: COLORS.neutral.white,
  },
  inputError: {
    borderColor: COLORS.secondary.main,
  },
  errorText: {
    color: COLORS.secondary.main,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
    marginTop: -8,
  },
  button: {
    height: 50,
    backgroundColor: COLORS.neutral.black,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: COLORS.neutral.white,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
  },
  footerLink: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: COLORS.primary.medium,
  },
  termsContainer: {
    marginBottom: 20,
  },
  termsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  termsLink: {
    color: COLORS.primary.medium,
  },
});