import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput, ScrollView, ImageBackground, Alert } from 'react-native';
import { backgroundImage } from '@/assets/background';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { User, Edit, ChevronRight, LogOut, Heart, Clock, FileText, Settings, Moon, Info, Shield } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'João da Silva',
    email: 'joao.silva@email.com',
    phone: '(38) 99999-8888',
    address: 'Rua dos Exemplos, 123 - Centro, Montes Claros - MG',
    bloodType: 'O+',
    allergies: 'Penicilina',
    emergencyContact: 'Maria (esposa) - (38) 99999-7777',
  });
  const [editedData, setEditedData] = useState({...profileData});
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleEdit = () => {
    if (isEditing) {
      // Salvar alterações
      setProfileData(editedData);
      setIsEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } else {
      // Entrar no modo de edição
      setEditedData({...profileData});
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({...profileData});
  };

  const handleInputChange = (field, value) => {
    setEditedData({
      ...editedData,
      [field]: value
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const confirmSignOut = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: signOut }
      ]
    );
  };

  const renderProfileField = (label, value, field) => {
    if (isEditing) {
      return (
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>{label}</Text>
          <TextInput
            style={styles.input}
            value={editedData[field]}
            onChangeText={(text) => handleInputChange(field, text)}
          />
        </View>
      );
    }
    
    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.fieldValue}>{value}</Text>
      </View>
    );
  };

  return (
    <ImageBackground
      source={{ uri: backgroundImage }}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
          
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            {isEditing ? (
              <Text style={styles.editButtonText}>Salvar</Text>
            ) : (
              <>
                <Edit size={16} color={COLORS.primary.medium} />
                <Text style={styles.editButtonText}>Editar</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        
        {isEditing && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={40} color={COLORS.neutral.white} />
            </View>
            {isEditing && (
              <TouchableOpacity style={styles.changeAvatarButton}>
                <Text style={styles.changeAvatarText}>Alterar</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profileData.name}</Text>
            <Text style={styles.profileEmail}>{profileData.email}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          
          {renderProfileField('Nome Completo', profileData.name, 'name')}
          {renderProfileField('Email', profileData.email, 'email')}
          {renderProfileField('Telefone', profileData.phone, 'phone')}
          {renderProfileField('Endereço', profileData.address, 'address')}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Médicas</Text>
          
          {renderProfileField('Tipo Sanguíneo', profileData.bloodType, 'bloodType')}
          {renderProfileField('Alergias', profileData.allergies, 'allergies')}
          {renderProfileField('Contato de Emergência', profileData.emergencyContact, 'emergencyContact')}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Heart size={20} color={COLORS.primary.medium} />
              <Text style={styles.settingItemText}>Hospitais favoritos</Text>
            </View>
            <ChevronRight size={18} color={COLORS.neutral.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Clock size={20} color={COLORS.primary.medium} />
              <Text style={styles.settingItemText}>Histórico de atendimentos</Text>
            </View>
            <ChevronRight size={18} color={COLORS.neutral.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <FileText size={20} color={COLORS.primary.medium} />
              <Text style={styles.settingItemText}>Documentos médicos</Text>
            </View>
            <ChevronRight size={18} color={COLORS.neutral.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Settings size={20} color={COLORS.primary.medium} />
              <Text style={styles.settingItemText}>Preferências do app</Text>
            </View>
            <ChevronRight size={18} color={COLORS.neutral.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={toggleDarkMode}>
            <View style={styles.settingItemLeft}>
              <Moon size={20} color={COLORS.primary.medium} />
              <Text style={styles.settingItemText}>Modo escuro</Text>
            </View>
            <View style={[styles.toggle, isDarkMode && styles.toggleActive]}>
              <View style={[styles.toggleCircle, isDarkMode && styles.toggleCircleActive]} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Info size={20} color={COLORS.primary.medium} />
              <Text style={styles.settingItemText}>Sobre o app</Text>
            </View>
            <ChevronRight size={18} color={COLORS.neutral.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Shield size={20} color={COLORS.primary.medium} />
              <Text style={styles.settingItemText}>Política de privacidade</Text>
            </View>
            <ChevronRight size={18} color={COLORS.neutral.darkGray} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={confirmSignOut}>
          <LogOut size={20} color={COLORS.secondary.main} />
          <Text style={styles.logoutButtonText}>Sair da conta</Text>
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Saúde na palma da mão v1.0.0</Text>
        </View>
      </ScrollView>
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
    padding: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: COLORS.text.primary,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary.light,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: COLORS.primary.medium,
    marginLeft: 4,
  },
  cancelButton: {
    marginBottom: 16,
    alignSelf: 'flex-end',
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: COLORS.text.secondary,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  changeAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 16,
    backgroundColor: COLORS.neutral.white,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary.medium,
  },
  changeAvatarText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: COLORS.primary.medium,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
  },
  section: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.neutral.mediumGray,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.primary,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral.lightGray,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.primary,
    marginLeft: 12,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.neutral.mediumGray,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: COLORS.primary.medium,
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.neutral.white,
  },
  toggleCircleActive: {
    alignSelf: 'flex-end',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary.light,
    padding: 14,
    borderRadius: 8,
    marginBottom: 24,
  },
  logoutButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: COLORS.secondary.main,
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.muted,
  },
});