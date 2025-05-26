import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ImageBackground, Switch } from 'react-native';
import { backgroundImage } from '@/assets/background';
import { COLORS } from '@/constants/colors';
import { Bell, Calendar, Clock, ChevronLeft, ChevronRight, Settings } from 'lucide-react-native';

// Dados de exemplo para notificações e lembretes
const sampleNotifications = [
  {
    id: '1',
    title: 'Lembrete de Consulta',
    message: 'Consulta com Dr. Silva (Cardiologista) amanhã às 14:00.',
    date: '2023-10-15T14:00:00',
    read: false,
    type: 'appointment'
  },
  {
    id: '2',
    title: 'Resultado de Exame',
    message: 'Seus exames de sangue estão disponíveis para visualização.',
    date: '2023-10-14T10:30:00',
    read: true,
    type: 'exam'
  },
  {
    id: '3',
    title: 'Vacinação',
    message: 'Campanha de vacinação contra gripe no Hospital Aroldo Tourinho.',
    date: '2023-10-13T09:15:00',
    read: true,
    type: 'info'
  },
  {
    id: '4',
    title: 'Lembrete de Medicação',
    message: 'Hora de tomar seu medicamento para pressão arterial.',
    date: '2023-10-12T20:00:00',
    read: true,
    type: 'medication'
  },
  {
    id: '5',
    title: 'Atualização de Serviços',
    message: 'UPA Norte ampliou horário de atendimento para especialidades.',
    date: '2023-10-10T11:20:00',
    read: true,
    type: 'info'
  }
];

const sampleAppointments = [
  {
    id: '1',
    doctor: 'Dr. Ricardo Silva',
    specialty: 'Cardiologia',
    location: 'Hospital Aroldo Tourinho',
    date: '2023-10-16T14:30:00',
    notifyBefore: 60 // minutos
  },
  {
    id: '2',
    doctor: 'Dra. Márcia Oliveira',
    specialty: 'Dermatologia',
    location: 'Clínica Dermatológica',
    date: '2023-10-20T10:00:00',
    notifyBefore: 60
  },
  {
    id: '3',
    doctor: 'Dr. Paulo Mendes',
    specialty: 'Ortopedia',
    location: 'Santa Casa de Montes Claros',
    date: '2023-10-25T15:45:00',
    notifyBefore: 60
  }
];

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [notificationSettings, setNotificationSettings] = useState({
    appointments: true,
    medications: true,
    exams: true,
    general: true
  });

  const toggleSetting = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment':
        return <Calendar size={24} color={COLORS.primary.medium} />;
      case 'exam':
        return <Calendar size={24} color={COLORS.accent.green} />;
      case 'medication':
        return <Clock size={24} color={COLORS.secondary.main} />;
      case 'info':
      default:
        return <Bell size={24} color={COLORS.primary.medium} />;
    }
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, !item.read && styles.unreadNotification]}
    >
      <View style={styles.notificationIcon}>
        {getNotificationIcon(item.type)}
      </View>
      
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationDate}>
          {formatDate(item.date)} às {formatTime(item.date)}
        </Text>
      </View>
      
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  const renderAppointmentItem = ({ item }) => (
    <View style={styles.appointmentItem}>
      <View style={styles.appointmentHeader}>
        <Text style={styles.appointmentDoctor}>{item.doctor}</Text>
        <Text style={styles.appointmentSpecialty}>{item.specialty}</Text>
      </View>
      
      <View style={styles.appointmentDetails}>
        <View style={styles.appointmentDetailItem}>
          <Calendar size={16} color={COLORS.primary.medium} />
          <Text style={styles.appointmentDetailText}>{formatDate(item.date)}</Text>
        </View>
        
        <View style={styles.appointmentDetailItem}>
          <Clock size={16} color={COLORS.primary.medium} />
          <Text style={styles.appointmentDetailText}>{formatTime(item.date)}</Text>
        </View>
        
        <View style={styles.appointmentDetailItem}>
          <Bell size={16} color={COLORS.primary.medium} />
          <Text style={styles.appointmentDetailText}>
            Lembrete: {item.notifyBefore} min antes
          </Text>
        </View>
      </View>
      
      <Text style={styles.appointmentLocation}>{item.location}</Text>
      
      <View style={styles.appointmentActions}>
        <TouchableOpacity style={styles.appointmentButton}>
          <Text style={styles.appointmentButtonText}>Reagendar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.appointmentButton, styles.appointmentCancelButton]}>
          <Text style={styles.appointmentCancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSettingsContent = () => (
    <View style={styles.settingsContainer}>
      <Text style={styles.settingsTitle}>Configurações de Notificações</Text>
      
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Lembretes de Consultas</Text>
        <Switch
          value={notificationSettings.appointments}
          onValueChange={() => toggleSetting('appointments')}
          trackColor={{ false: COLORS.neutral.mediumGray, true: COLORS.primary.light }}
          thumbColor={notificationSettings.appointments ? COLORS.primary.medium : COLORS.neutral.white}
        />
      </View>
      
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Lembretes de Medicações</Text>
        <Switch
          value={notificationSettings.medications}
          onValueChange={() => toggleSetting('medications')}
          trackColor={{ false: COLORS.neutral.mediumGray, true: COLORS.primary.light }}
          thumbColor={notificationSettings.medications ? COLORS.primary.medium : COLORS.neutral.white}
        />
      </View>
      
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Resultados de Exames</Text>
        <Switch
          value={notificationSettings.exams}
          onValueChange={() => toggleSetting('exams')}
          trackColor={{ false: COLORS.neutral.mediumGray, true: COLORS.primary.light }}
          thumbColor={notificationSettings.exams ? COLORS.primary.medium : COLORS.neutral.white}
        />
      </View>
      
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Notificações Gerais</Text>
        <Switch
          value={notificationSettings.general}
          onValueChange={() => toggleSetting('general')}
          trackColor={{ false: COLORS.neutral.mediumGray, true: COLORS.primary.light }}
          thumbColor={notificationSettings.general ? COLORS.primary.medium : COLORS.neutral.white}
        />
      </View>
      
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Salvar Preferências</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground
      source={{ uri: backgroundImage }}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notificações</Text>
          <TouchableOpacity onPress={() => setActiveTab('settings')}>
            <Settings size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'notifications' && styles.activeTabButton]}
            onPress={() => setActiveTab('notifications')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'notifications' && styles.activeTabButtonText]}>
              Notificações
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'appointments' && styles.activeTabButton]}
            onPress={() => setActiveTab('appointments')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'appointments' && styles.activeTabButtonText]}>
              Consultas
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'settings' && styles.activeTabButton]}
            onPress={() => setActiveTab('settings')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'settings' && styles.activeTabButtonText]}>
              Configurações
            </Text>
          </TouchableOpacity>
        </View>
        
        {activeTab === 'notifications' && (
          <FlatList
            data={sampleNotifications}
            renderItem={renderNotificationItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
        
        {activeTab === 'appointments' && (
          <FlatList
            data={sampleAppointments}
            renderItem={renderAppointmentItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <TouchableOpacity style={styles.addAppointmentButton}>
                <Text style={styles.addAppointmentButtonText}>+ Adicionar Nova Consulta</Text>
              </TouchableOpacity>
            }
          />
        )}
        
        {activeTab === 'settings' && renderSettingsContent()}
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: COLORS.text.primary,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: COLORS.neutral.lightGray,
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTabButton: {
    backgroundColor: COLORS.neutral.white,
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  activeTabButtonText: {
    color: COLORS.text.primary,
  },
  listContent: {
    paddingBottom: 16,
  },
  notificationItem: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary.medium,
  },
  notificationIcon: {
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  notificationDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.muted,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary.medium,
    marginLeft: 8,
  },
  addAppointmentButton: {
    backgroundColor: COLORS.primary.medium,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  addAppointmentButtonText: {
    color: COLORS.neutral.white,
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  appointmentItem: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  appointmentHeader: {
    marginBottom: 12,
  },
  appointmentDoctor: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  appointmentSpecialty: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.primary.medium,
  },
  appointmentDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  appointmentDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  appointmentDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    marginLeft: 6,
  },
  appointmentLocation: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    marginBottom: 12,
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appointmentButton: {
    flex: 1,
    backgroundColor: COLORS.primary.light,
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
    marginRight: 8,
  },
  appointmentButtonText: {
    color: COLORS.primary.medium,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  appointmentCancelButton: {
    backgroundColor: COLORS.secondary.light,
    marginRight: 0,
  },
  appointmentCancelButtonText: {
    color: COLORS.secondary.main,
  },
  settingsContainer: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 8,
    padding: 16,
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral.lightGray,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.primary,
  },
  saveButton: {
    backgroundColor: COLORS.primary.medium,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: COLORS.neutral.white,
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
});