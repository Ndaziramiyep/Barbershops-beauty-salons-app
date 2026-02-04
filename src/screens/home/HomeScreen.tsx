import * as Location from 'expo-location';
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
import LocationPermissionModal from '../../components/LocationPermissionModal';
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
  const [nearbySalons, setNearbySalons] = useState<Salon[]>([]);
  const [showAllSalons, setShowAllSalons] = useState(false);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
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
        setNearbySalons(salons.slice(0, 5)); // Show first 5 salons
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
        setNearbySalons(salons.slice(0, 5)); // Show top 5 nearby salons
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
    checkLocationAndLoad();
    loadNextBooking();
  }, []);

  const checkLocationAndLoad = async () => {
    try {
      // Check if location services are enabled
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        setShowLocationModal(true);
        loadAllSalons();
        return;
      }

      // Check permission status
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        setShowLocationModal(true);
        loadAllSalons();
        return;
      }

      // Location is available, get it directly
      handleEnableLocation();
    } catch (error) {
      console.error('Error checking location:', error);
      loadAllSalons();
    }
  };

  const loadNextBooking = async () => {
    try {
      const bookings = await bookingService.getMyBookings();
      setAllBookings(bookings);
      
      const upcomingBookings = bookings.filter(b => 
        (b.status === 'confirmed' || b.status === 'pending') && 
        new Date(b.date) >= new Date()
      ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'confirmed': return '#28a745';
      case 'completed': return '#6c757d';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

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

        {/* Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Appointments</Text>
            <TouchableOpacity onPress={() => router.push('/booking')}>
              <Text style={styles.viewAll}>View All ({allBookings.length})</Text>
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
          
          {/* Recent Appointments */}
          {allBookings.length > 0 && (
            <View style={styles.recentAppointments}>
              <Text style={styles.recentTitle}>Recent Appointments</Text>
              {allBookings.slice(0, 3).map((booking) => (
                <TouchableOpacity 
                  key={booking._id} 
                  style={styles.recentAppointmentItem}
                  onPress={() => router.push('/booking')}
                >
                  <View style={styles.recentAppointmentInfo}>
                    <Text style={styles.recentSalonName}>{booking.salonId.name}</Text>
                    <Text style={styles.recentServiceName}>{booking.serviceName}</Text>
                  </View>
                  <View style={styles.recentAppointmentMeta}>
                    <Text style={styles.recentDate}>
                      {new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                      <Text style={styles.statusText}>{booking.status}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
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

        {/* Nearby Salons */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Salons</Text>
            <TouchableOpacity onPress={() => setShowAllSalons(!showAllSalons)}>
              <Text style={styles.viewAll}>
                {showAllSalons ? 'Show Less' : `View All (${nearbySalons.length})`}
              </Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6366f1" />
            </View>
          ) : nearbySalons.length > 0 ? (
            <View>
              {/* First Salon - Always Visible */}
              <TouchableOpacity 
                style={styles.salonCard}
                onPress={() => router.push(`/salon-detail?salonId=${nearbySalons[0]._id}`)}
              >
                <Image
                  source={require('../../../assets/images/salon-image1.png')}
                  style={styles.salonImage}
                />
                <View style={styles.salonInfo}>
                  <View style={styles.salonHeader}>
                    <Text style={styles.salonName}>{nearbySalons[0].name}</Text>
                    <View style={styles.rating}>
                      {[1,2,3,4,5].map((star) => (
                        <Ionicons 
                          key={star} 
                          name={star <= Math.floor(nearbySalons[0].rating || 0) ? "star" : "star-outline"} 
                          size={14} 
                          color="#FFD700" 
                        />
                      ))}
                    </View>
                  </View>
                  <View style={styles.addressRow}>
                    <Text style={styles.salonAddress}>{nearbySalons[0].address}</Text>
                    <View style={styles.distanceContainer}>
                      <Ionicons name="location" size={14} color="#666" />
                      <Text style={styles.distance}>Available</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              
              {/* Additional Salons - Show in Column when expanded */}
              {showAllSalons && nearbySalons.slice(1).map((salon) => (
                <TouchableOpacity 
                  key={salon._id}
                  style={[styles.salonCard, styles.additionalSalonCard]}
                  onPress={() => router.push(`/salon-detail?salonId=${salon._id}`)}
                >
                  <Image
                    source={require('../../../assets/images/salon-image1.png')}
                    style={styles.salonImage}
                  />
                  <View style={styles.salonInfo}>
                    <View style={styles.salonHeader}>
                      <Text style={styles.salonName}>{salon.name}</Text>
                      <View style={styles.rating}>
                        {[1,2,3,4,5].map((star) => (
                          <Ionicons 
                            key={star} 
                            name={star <= Math.floor(salon.rating || 0) ? "star" : "star-outline"} 
                            size={14} 
                            color="#FFD700" 
                          />
                        ))}
                      </View>
                    </View>
                    <View style={styles.addressRow}>
                      <Text style={styles.salonAddress}>{salon.address}</Text>
                      <View style={styles.distanceContainer}>
                        <Ionicons name="location" size={14} color="#666" />
                        <Text style={styles.distance}>Available</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
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
      <LocationPermissionModal
        visible={showLocationModal}
        onEnable={handleEnableLocation}
        onClose={() => setShowLocationModal(false)}
      />
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
  recentAppointments: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  recentAppointmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  recentAppointmentInfo: {
    flex: 1,
  },
  recentSalonName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  recentServiceName: {
    fontSize: 12,
    color: '#666',
  },
  recentAppointmentMeta: {
    alignItems: 'flex-end',
  },
  recentDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
  },
  salonsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 20,
  },
  salonCardHorizontal: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  salonImageHorizontal: {
    width: '100%',
    height: 100,
  },
  salonInfoHorizontal: {
    padding: 8,
  },
  salonNameHorizontal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  salonAddressHorizontal: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  additionalSalonCard: {
    marginTop: 12,
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