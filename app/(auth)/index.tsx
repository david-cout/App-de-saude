import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { backgroundImage } from '@/assets/background';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { Heart } from 'lucide-react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [isPasswordScreen, setIsPasswordScreen] = useState(false);
  const [password, setPassword] = useState('');
  const { signIn, signInWithGoogle, signInWithApple } = useAuth();

  const handleContinue = () => {
    if (!isPasswordScreen) {
      if (email && email.includes('@')) {
        setIsPasswordScreen(true);
      }
    } else {
      signIn(email, password);
    }
  };

  const handleSignUp = () => {
    router.push('/(auth)/signup');
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/recovery');
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
          <View style={styles.header}>
            <Heart color={COLORS.secondary.main} size={48} strokeWidth={1.5} />
            <Text style={styles.title}>Saúde na palma da mão</Text>
          </View>

          {!isPasswordScreen ? (
            <View style={styles.formContainer}>
              <Text style={styles.subtitle}>Bem-vindo de volta</Text>
              <Text style={styles.description}>Digite seu e-mail para continuar</Text>
              
              <TextInput
                style={styles.input}
                placeholder="email@domain.com"
                placeholderTextColor={COLORS.text.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              
              <TouchableOpacity 
                style={[styles.button, email.includes('@') && styles.buttonActive]} 
                onPress={handleContinue}
              >
                <Text style={styles.buttonText}>Continuar</Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity style={styles.socialButton} onPress={signInWithGoogle}>
                <Image 
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }} 
                  style={styles.socialIcon} 
                />
                <Text style={styles.socialButtonText}>Continuar com Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton} onPress={signInWithApple}>
                <Image 
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/0/747.png' }} 
                  style={styles.socialIcon} 
                />
                <Text style={styles.socialButtonText}>Continuar com Apple</Text>
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Não tem uma conta? </Text>
                <TouchableOpacity onPress={handleSignUp}>
                  <Text style={styles.footerLink}>Cadastre-se</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.formContainer}>
              <Text style={styles.subtitle}>Digite sua senha</Text>
              <Text style={styles.emailPreview}>{email}</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor={COLORS.text.muted}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              
              <TouchableOpacity 
                style={[styles.button, password.length >= 6 && styles.buttonActive]} 
                onPress={handleContinue}
              >
                <Text style={styles.buttonText}>Entrar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setIsPasswordScreen(false)} style={styles.backButton}>
                <Text style={styles.backButtonText}>Voltar</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              Ao continuar, você concorda com nossos{' '}
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
    opacity: 0.15,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: COLORS.text.primary,
    marginTop: 16,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  subtitle: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  emailPreview: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: COLORS.primary.medium,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 56,
    borderWidth: 1.5,
    borderColor: COLORS.neutral.mediumGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
    backgroundColor: COLORS.neutral.white,
  },
  button: {
    height: 56,
    backgroundColor: COLORS.neutral.mediumGray,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonActive: {
    backgroundColor: COLORS.primary.medium,
  },
  buttonText: {
    color: COLORS.neutral.white,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.neutral.mediumGray,
  },
  dividerText: {
    marginHorizontal: 16,
    color: COLORS.text.secondary,
    fontFamily: 'Inter-Regular',
  },
  socialButton: {
    height: 56,
    backgroundColor: COLORS.neutral.lightGray,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  socialButtonText: {
    color: COLORS.text.primary,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: COLORS.primary.medium,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  backButton: {
    alignItems: 'center',
  },
  backButtonText: {
    color: COLORS.text.secondary,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
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
    marginBottom: 24,
  },
  termsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: COLORS.primary.medium,
  },
});