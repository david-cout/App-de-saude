import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity, Image, ImageBackground, RefreshControl, Linking, Alert } from 'react-native';
import { router } from 'expo-router';
import { backgroundImage } from '@/assets/background';
import { COLORS } from '@/constants/colors';
import { hospitals } from '@/constants/hospitals';
import { useAuth } from '@/hooks/useAuth';
import { Star, StarOff, MapPin, Phone, Menu, Search, User, ChevronRight } from 'lucide-react-native';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHospitals, setFilteredHospitals] = useState(hospitals);
  const [favorites, setFavorites] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');
      
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
      }
    })();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = hospitals.filter(
        hospital => hospital.name.toLowerCase().includes(lowercasedQuery) ||
                   hospital.address.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredHospitals(filtered);
      setCurrentPage(1);
    } else {
      setFilteredHospitals(hospitals);
    }
  }, [searchQuery]);

  const toggleFavorite = (hospitalId) => {
    if (favorites.includes(hospitalId)) {
      setFavorites(favorites.filter(id => id !== hospitalId));
    } else {
      setFavorites([...favorites, hospitalId]);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulando uma atualização de dados
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const findNearestHospital = async () => {
    if (!hasLocationPermission) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Precisamos da sua localização para encontrar o hospital mais próximo.',
          [{ text: 'OK' }]
        );
        return;
      }
      setHasLocationPermission(true);
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
    }

    if (!userLocation) return;

    // Cálculo da distância usando a fórmula de Haversine
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Raio da Terra em km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    // Filtrando apenas hospitais com emergência
    const emergencyHospitals = hospitals.filter(h => h.emergency);
    
    // Encontrando o hospital mais próximo
    let nearestHospital = null;
    let minDistance = Infinity;
    
    emergencyHospitals.forEach(hospital => {
      const distance = calculateDistance(
        userLocation.latitude, 
        userLocation.longitude,
        hospital.coordinates.latitude,
        hospital.coordinates.longitude
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestHospital = hospital;
      }
    });
    
    if (nearestHospital) {
      Alert.alert(
        'Hospital mais próximo',
        `${nearestHospital.name} - ${minDistance.toFixed(2)} km de distância`,
        [
          { 
            text: 'Ver no mapa', 
            onPress: () => {
              const url = `https://www.google.com/maps/dir/?api=1&destination=${nearestHospital.coordinates.latitude},${nearestHospital.coordinates.longitude}`;
              Linking.openURL(url);
            }
          },
          { 
            text: 'Ligar', 
            onPress: () => {
              Linking.openURL(`tel:${nearestHospital.phone.replace(/\D/g, '')}`);
            }
          },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
    }
  };

  const callEmergency = (service) => {
    let number;
    switch(service) {
      case 'samu':
        number = '192';
        break;
      case 'bombeiros':
        number = '193';
        break;
      default:
        return;
    }
    
    Alert.alert(
      'Ligar para emergência',
      `Você está prestes a ligar para ${service.toUpperCase()} (${number})`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Ligar', onPress: () => Linking.openURL(`tel:${number}`) }
      ]
    );
  };

  const openWhatsApp = () => {
    // Simulação de número de WhatsApp para atendimento
    Linking.openURL('https://wa.me/5538912345678?text=Preciso%20de%20ajuda%20médica');
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredHospitals.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredHospitals.length / itemsPerPage);

  const renderHospitalItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.hospitalCard}
      onPress={() => router.push(`/hospital/${item.id}`)}
    >
      <View style={styles.hospitalHeader}>
        <Text style={styles.hospitalName}>{item.name}</Text>
        <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
          {favorites.includes(item.id) ? (
            <Star size={24} color={COLORS.accent.yellow} fill={COLORS.accent.yellow} />
          ) : (
            <StarOff size={24} color={COLORS.neutral.darkGray} />
          )}
        </TouchableOpacity>
      </View>
      
      <Text style={styles.hospitalDescription}>Menu description.</Text>
      
      <View style={styles.hospitalInfo}>
        <View style={styles.infoItem}>
          <MapPin size={16} color={COLORS.primary.medium} />
          <Text style={styles.infoText} numberOfLines={1}>
            {item.address.split(',')[0]}
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Phone size={16} color={COLORS.primary.medium} />
          <Text style={styles.infoText}>{item.phone}</Text>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={[styles.tagText, item.emergency ? styles.emergencyTag : styles.normalTag]}>
          {item.emergency ? 'Emergência 24h' : 'Horário Comercial'}
        </Text>
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>Detalhes</Text>
          <ChevronRight size={16} color={COLORS.primary.medium} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={{ uri: backgroundImage }}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Menu size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Saúde na palma da mão</Text>
          
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
            <User size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <Search size={20} color={COLORS.text.muted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar..."
            placeholderTextColor={COLORS.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <View style={styles.emergencyContainer}>
          <Text style={styles.sectionTitle}>Emergência</Text>
          
          <View style={styles.emergencyButtons}>
            <TouchableOpacity style={styles.emergencyButton} onPress={findNearestHospital}>
              <View style={[styles.emergencyButtonIcon, { backgroundColor: COLORS.primary.light }]}>
                <MapPin size={24} color={COLORS.primary.dark} />
              </View>
              <Text style={styles.emergencyButtonText}>Hospital mais próximo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.emergencyButton} onPress={() => callEmergency('samu')}>
              <View style={[styles.emergencyButtonIcon, { backgroundColor: COLORS.secondary.light }]}>
                <Phone size={24} color={COLORS.secondary.main} />
              </View>
              <Text style={styles.emergencyButtonText}>SAMU (192)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.emergencyButton} onPress={() => callEmergency('bombeiros')}>
              <View style={[styles.emergencyButtonIcon, { backgroundColor: COLORS.secondary.light }]}>
                <Phone size={24} color={COLORS.secondary.main} />
              </View>
              <Text style={styles.emergencyButtonText}>Bombeiros (193)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.emergencyButton} onPress={openWhatsApp}>
              <View style={[styles.emergencyButtonIcon, { backgroundColor: COLORS.accent.teal }]}>
                <Image 
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/124/124034.png' }} 
                  style={{ width: 24, height: 24 }} 
                />
              </View>
              <Text style={styles.emergencyButtonText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>
            Postos de Saúde/Hospitais e clínicas particulares disponíveis:
          </Text>
          
          <FlatList
            data={getPaginatedData()}
            renderItem={renderHospitalItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[COLORS.primary.medium]}
              />
            }
          />
          
          <View style={styles.pagination}>
            <TouchableOpacity 
              style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]} 
              disabled={currentPage === 1}
              onPress={() => setCurrentPage(1)}
            >
              <Text style={[styles.pageButtonText, currentPage === 1 && styles.pageButtonTextDisabled]}>1</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.pageButton, currentPage === 2 && styles.pageButtonDisabled]} 
              disabled={currentPage === 2 || totalPages < 2}
              onPress={() => setCurrentPage(2)}
            >
              <Text style={[styles.pageButtonText, currentPage === 2 && styles.pageButtonTextDisabled]}>2</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.pageButton, currentPage === 3 && styles.pageButtonDisabled]} 
              disabled={currentPage === 3 || totalPages < 3}
              onPress={() => setCurrentPage(3)}
            >
              <Text style={[styles.pageButtonText, currentPage === 3 && styles.pageButtonTextDisabled]}>3</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.nextButton, currentPage === totalPages && styles.pageButtonDisabled]} 
              disabled={currentPage === totalPages}
              onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
              <Text style={[styles.pageButtonText, currentPage === totalPages && styles.pageButtonTextDisabled]}>
                Next
              </Text>
              <ChevronRight size={16} color={currentPage === totalPages ? COLORS.neutral.mediumGray : COLORS.primary.medium} />
            </TouchableOpacity>
          </View>
        </View>
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
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: COLORS.text.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.primary,
  },
  emergencyContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  emergencyButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emergencyButton: {
    width: '48%',
    backgroundColor: COLORS.neutral.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emergencyButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  emergencyButtonText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: COLORS.text.primary,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  hospitalCard: {
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
  hospitalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hospitalName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.text.primary,
    flex: 1,
  },
  hospitalDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    marginBottom: 12,
  },
  hospitalInfo: {
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    marginLeft: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  emergencyTag: {
    backgroundColor: COLORS.secondary.light,
    color: COLORS.secondary.main,
  },
  normalTag: {
    backgroundColor: COLORS.primary.light,
    color: COLORS.primary.medium,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: COLORS.primary.medium,
    marginRight: 4,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  pageButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: COLORS.neutral.white,
  },
  pageButtonDisabled: {
    backgroundColor: COLORS.primary.light,
  },
  pageButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: COLORS.text.primary,
  },
  pageButtonTextDisabled: {
    color: COLORS.primary.medium,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 32,
    borderRadius: 16,
    marginLeft: 4,
    backgroundColor: COLORS.neutral.white,
  },
});