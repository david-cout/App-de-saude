import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { backgroundImage } from '@/assets/background';
import { COLORS } from '@/constants/colors';
import { router } from 'expo-router';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react-native';

export default function Recovery() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleRecovery = () => {
    if (!email) {
      setError('Por favor, digite seu email');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email inválido');
      return;
    }
    
    // Simulação de envio de email de recuperação
    setIsSubmitted(true);
    setError('');
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
          
          {!isSubmitted ? (
            <>
              <View style={styles.header}>
                <View style={styles.iconContainer}>
                  <Mail color={COLORS.primary.medium} size={32} />
                </View>
                <Text style={styles.title}>Recuperar senha</Text>
                <Text style={styles.subtitle}>Digite seu email para recuperar sua senha</Text>
              </View>

              <View style={styles.formContainer}>
                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  placeholder="Email"
                  placeholderTextColor={COLORS.text.muted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError('');
                  }}
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                
                <TouchableOpacity style={styles.button} onPress={handleRecovery}>
                  <Text style={styles.buttonText}>Enviar link de recuperação</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.successContainer}>
              <View style={styles.successIconContainer}>
                <CheckCircle color={COLORS.accent.green} size={64} />
              </View>
              <Text style={styles.successTitle}>Email enviado!</Text>
              <Text style={styles.successText}>
                Enviamos instruções de recuperação de senha para o email:
              </Text>
              <Text style={styles.emailText}>{email}</Text>
              <Text style={styles.instructionText}>
                Por favor, verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
              </Text>
              
              <TouchableOpacity style={styles.button} onPress={() => router.push('/(auth)')}>
                <Text style={styles.buttonText}>Voltar para o login</Text>
              </TouchableOpacity>
            </View>
          )}
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
    marginBottom: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: COLORS.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    textAlign: 'center',
    maxWidth: '80%',
  },
  formContainer: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 12,
    padding: 20,
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.neutral.mediumGray,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
    backgroundColor: COLORS.neutral.white,
  },
  inputError: {
    borderColor: COLORS.secondary.main,
  },
  errorText: {
    color: COLORS.secondary.main,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
    marginTop: -8,
  },
  button: {
    height: 50,
    backgroundColor: COLORS.neutral.black,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.neutral.white,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  successText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.primary.medium,
    marginBottom: 16,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
  },
});