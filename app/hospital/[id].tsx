import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ImageBackground, Linking, Share, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { backgroundImage } from '@/assets/background';
import { COLORS } from '@/constants/colors';
import { hospitals } from '@/constants/hospitals';
import { ArrowLeft, Phone, MapPin, Clock, Star, StarOff, Share2, MessageCircle } from 'lucide-react-native';
import MapView, { Marker } from 'react-native-maps';

export default function HospitalDetails() {
  const { id } = useLocalSearchParams();
  const [hospital, setHospital] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    const foundHospital = hospitals.find(h => h.id === id);
    if (foundHospital) {
      setHospital(foundHospital);
    }
  }, [id]);

  if (!hospital) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const callHospital = () => {
    Linking.openURL(`tel:${hospital.phone.replace(/\D/g, '')}`);
  };

  const openMap = () => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${hospital.coordinates.latitude},${hospital.coordinates.longitude}`;
    const label = hospital.name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });
    
    Linking.openURL(url);
  };

  const shareHospital = async () => {
    try {
      await Share.share({
        message: `Confira este estabelecimento de saúde: ${hospital.name}\nEndereço: ${hospital.address}\nTelefone: ${hospital.phone}`,
        title: 'Compartilhar estabelecimento de saúde',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const openWhatsApp = () => {
    // Simulação de número de WhatsApp para atendimento
    Linking.openURL(`https://wa.me/5538912345678?text=Olá, gostaria de informações sobre ${hospital.name}`);
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} size={16} color={COLORS.accent.yellow} fill={COLORS.accent.yellow} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<Star key={i} size={16} color={COLORS.accent.yellow} fill={COLORS.accent.yellow} />);
      } else {
        stars.push(<StarOff key={i} size={16} color={COLORS.neutral.mediumGray} />);
      }
    }
    
    return (
      <View style={styles.ratingContainer}>
        <View style={styles.starsContainer}>{stars}</View>
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
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
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerActionButton} onPress={shareHospital}>
              <Share2 size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.headerActionButton} onPress={toggleFavorite}>
              {isFavorite ? (
                <Star size={24} color={COLORS.accent.yellow} fill={COLORS.accent.yellow} />
              ) : (
                <StarOff size={24} color={COLORS.text.primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.hospitalHeader}>
          <Text style={styles.hospitalName}>{hospital.name}</Text>
          <Text style={styles.hospitalAddress}>{hospital.address}</Text>
          
          {renderRatingStars(hospital.rating)}
          
          <View style={styles.tagContainer}>
            {hospital.emergency && (
              <View style={[styles.tag, styles.emergencyTag]}>
                <Text style={styles.emergencyTagText}>Emergência 24h</Text>
              </View>
            )}
            
            {hospital.specialties.map((specialty, index) => (
              <View key={index} style={[styles.tag, styles.specialtyTag]}>
                <Text style={styles.specialtyTagText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={callHospital}>
            <Phone size={24} color={COLORS.neutral.white} />
            <Text style={styles.actionButtonText}>Ligar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={openMap}>
            <MapPin size={24} color={COLORS.neutral.white} />
            <Text style={styles.actionButtonText}>Rota</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={openWhatsApp}>
            <MessageCircle size={24} color={COLORS.neutral.white} />
            <Text style={styles.actionButtonText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informações</Text>
          
          <View style={styles.infoItem}>
            <Clock size={20} color={COLORS.primary.medium} />
            <Text style={styles.infoText}>{hospital.hours}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Phone size={20} color={COLORS.primary.medium} />
            <Text style={styles.infoText}>{hospital.phone}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <MapPin size={20} color={COLORS.primary.medium} />
            <Text style={styles.infoText}>{hospital.address}</Text>
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Especialidades</Text>
          
          <View style={styles.specialtiesList}>
            {hospital.specialties.map((specialty, index) => (
              <View key={index} style={styles.specialtyItem}>
                <Text style={styles.specialtyText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Localização</Text>
          
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: hospital.coordinates.latitude,
                longitude: hospital.coordinates.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: hospital.coordinates.latitude,
                  longitude: hospital.coordinates.longitude,
                }}
                title={hospital.name}
                description={hospital.address}
              />
            </MapView>
          </View>
          
          <TouchableOpacity style={styles.mapButton} onPress={openMap}>
            <Text style={styles.mapButtonText}>Ver no Google Maps</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Avaliações</Text>
          
          <View style={styles.reviewSummary}>
            <Text style={styles.reviewRating}>{hospital.rating.toFixed(1)}</Text>
            {renderRatingStars(hospital.rating)}
            <Text style={styles.reviewCount}>Baseado em avaliações de usuários</Text>
          </View>
          
          <TouchableOpacity style={styles.reviewButton}>
            <Text style={styles.reviewButtonText}>Escrever uma avaliação</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  hospitalHeader: {
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
  hospitalName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  hospitalAddress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: COLORS.text.primary,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  emergencyTag: {
    backgroundColor: COLORS.secondary.light,
  },
  emergencyTagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: COLORS.secondary.main,
  },
  specialtyTag: {
    backgroundColor: COLORS.primary.light,
  },
  specialtyTagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: COLORS.primary.medium,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.primary.medium,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: COLORS.neutral.white,
    marginTop: 4,
  },
  infoSection: {
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
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    marginLeft: 10,
    flex: 1,
  },
  specialtiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialtyItem: {
    backgroundColor: COLORS.primary.light,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  specialtyText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: COLORS.primary.medium,
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapButton: {
    backgroundColor: COLORS.primary.light,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  mapButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: COLORS.primary.medium,
  },
  reviewSummary: {
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewRating: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  reviewCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    marginTop: 8,
  },
  reviewButton: {
    backgroundColor: COLORS.primary.medium,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  reviewButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.neutral.white,
  },
});