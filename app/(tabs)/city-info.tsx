import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ImageBackground, Linking } from 'react-native';
import { backgroundImage } from '@/assets/background';
import { COLORS } from '@/constants/colors';
import { MapPin, Phone, Clock, Info, AlertTriangle, Bus, Building2, Landmark } from 'lucide-react-native';

export default function CityInfoScreen() {
  const openMap = (location: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    Linking.openURL(url);
  };

  const callNumber = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <ImageBackground
      source={{ uri: backgroundImage }}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Montes Claros - MG</Text>
          <Text style={styles.headerSubtitle}>Guia da Cidade</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={24} color={COLORS.primary.medium} />
            <Text style={styles.sectionTitle}>Sobre a Cidade</Text>
          </View>
          <Text style={styles.sectionText}>
            Montes Claros é uma cidade localizada no norte de Minas Gerais, com população estimada de 413.487 habitantes. 
            É um importante centro regional de saúde, educação e comércio.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertTriangle size={24} color={COLORS.secondary.main} />
            <Text style={styles.sectionTitle}>Números de Emergência</Text>
          </View>
          <TouchableOpacity 
            style={styles.emergencyItem}
            onPress={() => callNumber('192')}
          >
            <Text style={styles.emergencyTitle}>SAMU</Text>
            <Text style={styles.emergencyNumber}>192</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.emergencyItem}
            onPress={() => callNumber('193')}
          >
            <Text style={styles.emergencyTitle}>Corpo de Bombeiros</Text>
            <Text style={styles.emergencyNumber}>193</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.emergencyItem}
            onPress={() => callNumber('190')}
          >
            <Text style={styles.emergencyTitle}>Polícia Militar</Text>
            <Text style={styles.emergencyNumber}>190</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Building2 size={24} color={COLORS.primary.medium} />
            <Text style={styles.sectionTitle}>Principais Hospitais</Text>
          </View>
          <TouchableOpacity 
            style={styles.infoItem}
            onPress={() => openMap('Hospital Aroldo Tourinho Montes Claros')}
          >
            <MapPin size={20} color={COLORS.primary.medium} />
            <Text style={styles.infoText}>Hospital Aroldo Tourinho</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.infoItem}
            onPress={() => openMap('Hospital Universitário Clemente de Faria Montes Claros')}
          >
            <MapPin size={20} color={COLORS.primary.medium} />
            <Text style={styles.infoText}>Hospital Universitário (HUCF)</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.infoItem}
            onPress={() => openMap('Santa Casa Montes Claros')}
          >
            <MapPin size={20} color={COLORS.primary.medium} />
            <Text style={styles.infoText}>Santa Casa de Montes Claros</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bus size={24} color={COLORS.primary.medium} />
            <Text style={styles.sectionTitle}>Transporte</Text>
          </View>
          <View style={styles.infoItem}>
            <Clock size={20} color={COLORS.primary.medium} />
            <Text style={styles.infoText}>Ônibus: 05:00 - 23:00</Text>
          </View>
          <TouchableOpacity 
            style={styles.infoItem}
            onPress={() => callNumber('38999999999')}
          >
            <Phone size={20} color={COLORS.primary.medium} />
            <Text style={styles.infoText}>Central de Táxi: (38) 9999-9999</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Landmark size={24} color={COLORS.primary.medium} />
            <Text style={styles.sectionTitle}>Pontos Importantes</Text>
          </View>
          <TouchableOpacity 
            style={styles.infoItem}
            onPress={() => openMap('Prefeitura Municipal de Montes Claros')}
          >
            <MapPin size={20} color={COLORS.primary.medium} />
            <Text style={styles.infoText}>Prefeitura Municipal</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.infoItem}
            onPress={() => openMap('Rodoviária de Montes Claros')}
          >
            <MapPin size={20} color={COLORS.primary.medium} />
            <Text style={styles.infoText}>Terminal Rodoviário</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.infoItem}
            onPress={() => openMap('Aeroporto de Montes Claros')}
          >
            <MapPin size={20} color={COLORS.primary.medium} />
            <Text style={styles.infoText}>Aeroporto</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
  },
  section: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.text.primary,
    marginLeft: 8,
  },
  sectionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  emergencyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral.lightGray,
  },
  emergencyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: COLORS.text.primary,
  },
  emergencyNumber: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: COLORS.secondary.main,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral.lightGray,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    marginLeft: 8,
    flex: 1,
  },
});