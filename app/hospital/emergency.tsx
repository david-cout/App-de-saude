import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ImageBackground, Alert, Linking, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { backgroundImage } from '@/assets/background';
import { COLORS } from '@/constants/colors';
import { hospitals } from '@/constants/hospitals';
import { ArrowLeft, MapPin, Phone, AlertTriangle, ChevronRight } from 'lucide-react-native';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function EmergencyScreen() {
  const [loading, setLoading] = useState(true);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');
      
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
        findNearbyHospitals(location.coords);
      } else {
        setLoading(false);
        Alert.alert(
          'Permissão de localização',
          'Precisamos da sua localização para encontrar hospitais próximos. Por favor, conceda permissão nas configurações.',
          [{ text: 'OK' }]
        );
      }
    })();
  }, []);

  const findNearbyHospitals = (location) => {
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

    // Filtrando apenas hospitais com emergência e calculando distâncias
    const emergencyHospitals = hospitals
      .filter(h => h.emergency)
      .map(hospital => {
        const distance = calculateDistance(
          location.latitude, 
          location.longitude,
          hospital.coordinates.latitude,
          hospital.coordinates.longitude
        );
        
        return {
          ...hospital,
          distance
        };
      })
      .sort((a, b) => a.distance - b.distance);
    
    setNearbyHospitals(emergencyHospitals);
    if (emergencyHospitals.length > 0) {
      setSelectedHospital(emergencyHospitals[0]);
    }
    
    setLoading(false);
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

  const callHospital = (phone) => {
    Linking.openURL(`tel:${phone.replace(/\D/g, '')}`);
  };

  const openMap = (hospital) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates.latitude},${hospital.coordinates.longitude}`;
    Linking.openURL(url);
  };

  const handleSelectHospital = (hospital) => {
    setSelectedHospital(hospital);
  };

  const navigateToHospitalDetail = (hospitalId) => {
    router.push(`/hospital/${hospitalId}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary.medium} />
        <Text style={styles.loadingText}>Localizando hospitais próximos...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={{ uri: backgroundImage }}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Emergência</Text>
        </View>
        
        <View style={styles.emergencyServices}>
          <Text style={styles.sectionTitle}>Serviços de Emergência</Text>
          
          <View style={styles.emergencyButtons}>
            <TouchableOpacity 
              style={[styles.emergencyButton, styles.samuButton]} 
              onPress={() => callEmergency('samu')}
            >
              <View style={styles.emergencyButtonContent}>
                <AlertTriangle size={32} color={COLORS.neutral.white} />
                <Text style={styles.emergencyButtonTitle}>SAMU</Text>
                <Text style={styles.emergencyButtonNumber}>192</Text>
              </View>
              <Text style={styles.emergencyButtonText}>Toque para ligar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.emergencyButton, styles.bombeirosButton]} 
              onPress={() => callEmergency('bombeiros')}
            >
              <View style={styles.emergencyButtonContent}>
                <AlertTriangle size={32} color={COLORS.neutral.white} />
                <Text style={styles.emergencyButtonTitle}>Bombeiros</Text>
                <Text style={styles.emergencyButtonNumber}>193</Text>
              </View>
              <Text style={styles.emergencyButtonText}>Toque para ligar</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.hospitalSection}>
          <Text style={styles.sectionTitle}>Hospitais com Emergência Próximos</Text>
          
          {userLocation && selectedHospital && (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                  }}
                  title="Sua localização"
                  pinColor="blue"
                />
                
                <Marker
                  coordinate={{
                    latitude: selectedHospital.coordinates.latitude,
                    longitude: selectedHospital.coordinates.longitude,
                  }}
                  title={selectedHospital.name}
                  description={`${selectedHospital.distance.toFixed(2)} km de distância`}
                  pinColor="red"
                />
              </MapView>
            </View>
          )}
          
          {selectedHospital && (
            <View style={styles.selectedHospital}>
              <Text style={styles.selectedHospitalTitle}>Hospital mais próximo:</Text>
              <Text style={styles.selectedHospitalName}>{selectedHospital.name}</Text>
              <Text style={styles.selectedHospitalDistance}>
                {selectedHospital.distance.toFixed(2)} km de distância
              </Text>
              
              <View style={styles.hospitalActions}>
                <TouchableOpacity 
                  style={styles.hospitalActionButton}
                  onPress={() => callHospital(selectedHospital.phone)}
                >
                  <Phone size={20} color={COLORS.neutral.white} />
                  <Text style={styles.hospitalActionText}>Ligar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.hospitalActionButton}
                  onPress={() => openMap(selectedHospital)}
                >
                  <MapPin size={20} color={COLORS.neutral.white} />
                  <Text style={styles.hospitalActionText}>Rotas</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.hospitalActionButton}
                  onPress={() => navigateToHospitalDetail(selectedHospital.id)}
                >
                  <Text style={styles.hospitalActionText}>Detalhes</Text>
                  <ChevronRight size={16} color={COLORS.neutral.white} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          <ScrollView style={styles.hospitalList}>
            {nearbyHospitals.map((hospital) => (
              <TouchableOpacity
                key={hospital.id}
                style={[
                  styles.hospitalItem,
                  selectedHospital && selectedHospital.id === hospital.id && styles.selectedHospitalItem
                ]}
                onPress={() => handleSelectHospital(hospital)}
              >
                <View style={styles.hospitalItemContent}>
                  <Text style={styles.hospitalItemName}>{hospital.name}</Text>
                  <Text style={styles.hospitalItemDistance}>
                    {hospital.distance.toFixed(2)} km
                  </Text>
                </View>
                
                <View style={styles.hospitalItemActions}>
                  <TouchableOpacity
                    style={styles.hospitalItemAction}
                    onPress={() => callHospital(hospital.phone)}
                  >
                    <Phone size={16} color={COLORS.primary.medium} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.hospitalItemAction}
                    onPress={() => openMap(hospital)}
                  >
                    <MapPin size={16} color={COLORS.primary.medium} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background.main,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: COLORS.text.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: COLORS.text.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  emergencyServices: {
    marginBottom: 16,
  },
  emergencyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emergencyButton: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  samuButton: {
    backgroundColor: COLORS.secondary.main,
  },
  bombeirosButton: {
    backgroundColor: '#FF9500', // Orange
  },
  emergencyButtonContent: {
    alignItems: 'center',
    marginBottom: 8,
  },
  emergencyButtonTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: COLORS.neutral.white,
    marginTop: 8,
  },
  emergencyButtonNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: COLORS.neutral.white,
  },
  emergencyButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral.white,
    opacity: 0.8,
  },
  hospitalSection: {
    flex: 1,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  selectedHospital: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedHospitalTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  selectedHospitalName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  selectedHospitalDistance: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: COLORS.primary.medium,
    marginBottom: 12,
  },
  hospitalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hospitalActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary.medium,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  hospitalActionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: COLORS.neutral.white,
    marginLeft: 6,
  },
  hospitalList: {
    flex: 1,
  },
  hospitalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.neutral.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedHospitalItem: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary.medium,
  },
  hospitalItemContent: {
    flex: 1,
  },
  hospitalItemName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  hospitalItemDistance: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
  },
  hospitalItemActions: {
    flexDirection: 'row',
  },
  hospitalItemAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});