import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getCurrentLocation, LocationData } from '../../services/locationService';
import { useAuth } from '../../services/authContext';
import { salonService, Salon } from '../../services/salonService';
import { bookingService, Booking } from '../../services/bookingService';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [userLocation, setUserLocation] = useState('Fetching location...');
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [nearestSalon, setNearestSalon] = useState<Salon | null>(null);
  const [nextBooking, setNextBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEnableLocation = async () => {
    setShowLocationModal(false);
    const location = await getCurrentLocation();
    if (location) {
      setLocationData(location);
      setUserLocation(location.address);
      loadNearestSalon(location.latitude, location.longitude);
    } else {
      setUserLocation('Location unavailable');
      // Load all salons if location is unavailable
      loadAllSalons();
    }
  };

  const loadAllSalons = async () => {
    try {
      setLoading(true);
      const salons = await salonService.getAllSalons();
      if (salons.length > 0) {
        setNearestSalon(salons[0]);
      }
    } catch (error) {
      console.error('Error loading salons:', error);
      // Keep fallback salon
      setNearestSalon({
        _id: '1',
        name: 'Bella Rinova',
        address: '123 Lygon St, Carlton Melbourne 3053',
        location: { latitude: -37.8136, longitude: 144.9631 },
        phone: '+61 3 9347 1234',
        email: 'info@bellarinova.com',
        rating: 4.8,
        image: 'salon-image1.png',
        services: [],
        workingHours: {},
        isApproved: true,
        isActive: true
      });
    } finally {
      setLoading(false);
    }
  };

  const loadNearestSalon = async (latitude: number, longitude: number) => {
    try {
      setLoading(true);
      const salons = await salonService.getNearbySalons(latitude, longitude, 10);
      if (salons.length > 0) {
        setNearestSalon(salons[0]);
      } else {
        // If no nearby salons, load all salons
        loadAllSalons();
      }
    } catch (error) {
      console.error('Error loading nearest salon:', error);
      // Fallback to loading all salons
      loadAllSalons();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Skip location modal and load salons directly
    setShowLocationModal(false);
    handleEnableLocation();
    loadNextBooking();
  }, []);

  const loadNextBooking = async () => {
    try {
      const bookings = await bookingService.getMyBookings();
      const upcomingBookings = bookings.filter(b => 
        b.status === 'confirmed' && new Date(b.date) >= new Date()
      );
      if (upcomingBookings.length > 0) {
        setNextBooking(upcomingBookings[0]);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const services = [
    { id: 1, name: 'Haircuts', image: require('../../../assets/images/haircut-style.jpg') },
    { id: 2, name: 'Make up', image: require('../../../assets/images/bridal-makeup-4.jpg') },
    { id: 3, name: 'Manicure', image: require('../../../assets/images/bridal-makeup-5.jpg') },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../../../assets/images/specialist-profile1.jpg')}
            style={styles.profileImage}
          />
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => {
                console.log('Search button pressed');
                router.push('/search');
              }}
            >
              <Ionicons name="search-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.greeting}>Hi, {user?.name || 'User'}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color="#666" />
            <Text style={styles.date}>{userLocation}</Text>
          </View>
        </View>

        {/* Appointment */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Appointment</Text>
            <TouchableOpacity onPress={() => router.push('/booking')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {nextBooking ? (
            <TouchableOpacity 
              style={styles.appointmentCard}
              onPress={() => router.push('/booking')}
            >
              <View style={styles.appointmentIcon}>
                <Ionicons name="calendar" size={20} color="#fff" />
              </View>
              <View style={styles.appointmentInfo}>
                <Text style={styles.appointmentTitle}>{nextBooking.salonId.name}</Text>
                <Text style={styles.appointmentService}>{nextBooking.serviceName}</Text>
              </View>
              <View style={styles.appointmentTime}>
                <Text style={styles.appointmentTimeText}>{nextBooking.time}</Text>
                <Text style={styles.appointmentDate}>
                  {new Date(nextBooking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.appointmentCard, styles.noAppointmentCard]}
              onPress={() => router.push('/location')}
            >
              <View style={styles.appointmentIcon}>
                <Ionicons name="calendar-outline" size={20} color="#666" />
              </View>
              <View style={styles.appointmentInfo}>
                <Text style={styles.noAppointmentTitle}>No upcoming appointments</Text>
                <Text style={styles.noAppointmentSubtitle}>Book your next appointment</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Services</Text>
            <TouchableOpacity onPress={() => router.push('/location')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.servicesContainer}>
            {services.map((service) => (
              <TouchableOpacity 
                key={service.id} 
                style={styles.serviceCard}
                onPress={() => router.push('/location')}
              >
                <Image source={service.image} style={styles.serviceImage} />
                <Text style={styles.serviceName}>{service.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Nearest Salon */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearest salon</Text>
            <TouchableOpacity onPress={() => router.push('/location')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6366f1" />
            </View>
          ) : nearestSalon ? (
            <TouchableOpacity 
              style={styles.salonCard}
              onPress={() => router.push(`/salon-detail?salonId=${nearestSalon._id}`)}
            >
              <Image
                source={require('../../../assets/images/salon-image1.png')}
                style={styles.salonImage}
              />
              <View style={styles.salonInfo}>
                <View style={styles.salonHeader}>
                  <Text style={styles.salonName}>{nearestSalon.name}</Text>
                  <View style={styles.rating}>
                    {[1,2,3,4,5].map((star) => (
                      <Ionicons 
                        key={star} 
                        name={star <= Math.floor(nearestSalon.rating || 0) ? "star" : "star-outline"} 
                        size={14} 
                        color="#FFD700" 
                      />
                    ))}
                  </View>
                </View>
                <View style={styles.addressRow}>
                  <Text style={styles.salonAddress}>{nearestSalon.address}</Text>
                  <View style={styles.distanceContainer}>
                    <Ionicons name="location" size={14} color="#666" />
                    <Text style={styles.distance}>Available</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.noSalonCard}
              onPress={() => router.push('/location')}
            >
              <Text style={styles.noDataText}>No salons found nearby</Text>
              <Text style={styles.noDataSubtext}>Tap to browse all salons</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#6366f1" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/location')}
        >
          <Ionicons name="location-outline" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/booking')}
        >
          <Ionicons name="calendar-outline" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/chat')}
        >
          <Ionicons name="chatbubble-outline" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/profile')}
        >
          <Ionicons name="person-outline" size={24} color="#999" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  userInfo: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 24,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    lineHeight: 18,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  lastSection: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAll: {
    fontSize: 14,
    color: '#999',
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
  },
  appointmentIcon: {
    marginRight: 12,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  appointmentTime: {
    alignItems: 'flex-end',
  },
  appointmentTimeText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  appointmentDate: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  appointmentService: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  noAppointmentCard: {
    backgroundColor: '#f8f9fa',
  },
  noAppointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  noAppointmentSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  noSalonCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  noDataSubtext: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
  servicesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  serviceCard: {
    alignItems: 'center',
    flex: 1,
    maxWidth: 100,
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  salonCard: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
  },
  salonImage: {
    width: '100%',
    height: 180,
  },
  salonInfo: {
    padding: 12,
  },
  salonName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  addressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  salonAddress: {
    fontSize: 12,
    color: '#666',
    flex: 1,
    marginRight: 8,
  },
  salonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  salonDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  leftContent: {
    flex: 1,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  rating: {
    flexDirection: 'row',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  navItem: {
    padding: 8,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    padding: 20,
  },
});