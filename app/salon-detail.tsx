import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { salonService, Salon } from '../src/services/salonService';

export default function SalonDetailScreen() {
  const router = useRouter();
  const { salonId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('About');
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (salonId) {
      loadSalonDetails(salonId as string);
    }
  }, [salonId]);

  const loadSalonDetails = async (id: string) => {
    try {
      setLoading(true);
      const salonData = await salonService.getSalonById(id);
      setSalon(salonData);
    } catch (error) {
      console.error('Error loading salon details:', error);
      // Fallback to static data
      setSalon({
        _id: id,
        name: 'Bella Rinova',
        address: '6391 Elgin St, Celina, Delaware 10299',
        location: { latitude: -37.8136, longitude: 144.9631 },
        phone: '+1 302 555 0199',
        email: 'info@bellarinova.com',
        rating: 4.5,
        image: 'salon-image2.jpg',
        services: [
          { name: 'Haircut', price: 45, duration: 60 },
          { name: 'Hair Styling', price: 35, duration: 45 }
        ],
        workingHours: {
          monday: { open: '8:30', close: '21:30' },
          tuesday: { open: '8:30', close: '21:30' },
          wednesday: { open: '8:30', close: '21:30' },
          thursday: { open: '8:30', close: '21:30' },
          friday: { open: '8:30', close: '21:30' },
          saturday: { open: '9:00', close: '13:00' },
          sunday: { open: '9:00', close: '13:00' }
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const specialists = [
    { id: 1, name: 'Lily', image: require('../assets/images/specialist-profile1.jpg') },
    { id: 2, name: 'Lee', image: require('../assets/images/specialist-profile2.jpg') },
    { id: 3, name: 'Connor', image: require('../assets/images/specialist-profile4.jpg') },
    { id: 4, name: 'Jason', image: require('../assets/images/specialist-profile5.jpg') },
  ];

  const tabs = ['About', 'Services', 'Gallery', 'Reviews'];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Ionicons 
          key={i} 
          name={i < fullStars ? "star" : "star-outline"} 
          size={16} 
          color="#FFD700" 
        />
      );
    }
    return stars;
  };

  const handleCall = () => {
    if (salon?.phone) {
      Linking.openURL(`tel:${salon.phone}`);
    }
  };

  const handleDirections = () => {
    if (salon?.address) {
      const url = `https://maps.google.com/?q=${encodeURIComponent(salon.address)}`;
      Linking.openURL(url);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading salon details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!salon) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Salon not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image source={require('../assets/images/salon-image2.jpg')} style={styles.headerImage} />
          <View style={styles.headerOverlay}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="heart-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          {/* Phone Status Bar */}
          <View style={styles.phoneStatusBar}>
            <View style={styles.statusLeft}>
              <Text style={styles.timeText}>9:41</Text>
            </View>
            <View style={styles.statusRight}>
              <Ionicons name="cellular" size={16} color="#fff" />
              <Ionicons name="wifi" size={16} color="#fff" />
              <Ionicons name="battery-full" size={16} color="#fff" />
            </View>
          </View>
        </View>

        {/* Salon Info */}
        <View style={styles.salonInfo}>
          <View style={styles.salonHeader}>
            <View style={styles.salonTitleContainer}>
              <Text style={styles.salonName}>{salon.name}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Open</Text>
              </View>
            </View>
            <Text style={styles.salonAddress}>{salon.address}</Text>
            
            <View style={styles.ratingContainer}>
              <View style={styles.stars}>
                {renderStars(salon.rating)}
              </View>
              <Text style={styles.ratingText}>(179 Reviews)</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="globe-outline" size={20} color="#666" />
              <Text style={styles.actionText}>Website</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
              <Ionicons name="call-outline" size={20} color="#666" />
              <Text style={styles.actionText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleDirections}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <Text style={styles.actionText}>Direction</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-outline" size={20} color="#666" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>

          {/* Specialists */}
          <View style={styles.specialistsSection}>
            <Text style={styles.sectionTitle}>Salon specialists</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {specialists.map((specialist) => (
                <TouchableOpacity key={specialist.id} style={styles.specialistCard}>
                  <Image source={specialist.image} style={styles.specialistImage} />
                  <Text style={styles.specialistName}>{specialist.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {activeTab === 'About' && (
            <View style={styles.tabContent}>
              <Text style={styles.description}>
                Ace Hair salon is located in Houston, Virginia was formed in 2003. Opened with the promise of exceptional service for a fair price. Good... Readmore
              </Text>
              
              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Opening Hours</Text>
                <View style={styles.hoursContainer}>
                  <View style={styles.hourRow}>
                    <Text style={styles.dayText}>Monday - Friday</Text>
                    <Text style={styles.timeText}>8:30 am - 9:30 pm</Text>
                  </View>
                  <View style={styles.hourRow}>
                    <Text style={styles.dayText}>Saturday - Sunday</Text>
                    <Text style={styles.timeText}>9:00 am - 1:00 pm</Text>
                  </View>
                </View>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Contact</Text>
                <TouchableOpacity onPress={handleCall}>
                  <Text style={styles.contactText}>{salon.phone}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Address</Text>
                <Text style={styles.addressText}>{salon.address}</Text>
                
                <View style={styles.mapContainer}>
                  <View style={styles.mapPlaceholder}>
                    <Ionicons name="location" size={40} color="#6366f1" />
                  </View>
                </View>
                
                <TouchableOpacity style={styles.directionsButton} onPress={handleDirections}>
                  <Ionicons name="navigate" size={20} color="#fff" />
                  <Text style={styles.directionsText}>Get directions - 4 km</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: 300,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  phoneStatusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    height: 40,
  },
  statusLeft: {
    flex: 1,
  },
  statusRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  salonInfo: {
    padding: 20,
  },
  salonHeader: {
    marginBottom: 20,
  },
  salonTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  salonName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 12,
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  salonAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  specialistsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  specialistCard: {
    alignItems: 'center',
    marginRight: 16,
  },
  specialistImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  specialistName: {
    fontSize: 12,
    color: '#333',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 16,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  activeTab: {
    backgroundColor: '#333',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  tabContent: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 24,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  hoursContainer: {
    gap: 8,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayText: {
    fontSize: 14,
    color: '#666',
  },
  timeText: {
    fontSize: 14,
    color: '#333',
  },
  contactText: {
    fontSize: 14,
    color: '#6366f1',
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  mapContainer: {
    marginBottom: 16,
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  directionsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '600',
  },
});