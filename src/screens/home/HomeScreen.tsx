import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

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
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="search-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.greeting}>Hi, Jenny Wilson</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color="#666" />
            <Text style={styles.date}>123 Lygon St, Carlton Melbourne 3053</Text>
          </View>
        </View>

        {/* Appointment */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Appointment</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>Today, Morning</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.appointmentCard}>
            <View style={styles.appointmentIcon}>
              <Ionicons name="calendar" size={20} color="#fff" />
            </View>
            <View style={styles.appointmentInfo}>
              <Text style={styles.appointmentTitle}>At The Galleria Hair Salon</Text>
            </View>
            <Text style={styles.appointmentTime}>9:00 AM</Text>
          </TouchableOpacity>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Services</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.servicesContainer}>
            {services.map((service) => (
              <TouchableOpacity key={service.id} style={styles.serviceCard}>
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
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.salonCard}>
            <Image
              source={require('../../../assets/images/salon-image1.png')}
              style={styles.salonImage}
            />
            <View style={styles.salonInfo}>
              <View style={styles.salonHeader}>
                <Text style={styles.salonName}>Bella Rinova</Text>
                <View style={styles.rating}>
                  {[1,2,3,4,5].map((star) => (
                    <Ionicons key={star} name="star" size={14} color="#FFD700" />
                  ))}
                </View>
              </View>
              <View style={styles.addressRow}>
                <Text style={styles.salonAddress}>123 Lygon St, Carlton Melbourne 3053</Text>
                <View style={styles.distanceContainer}>
                  <Ionicons name="location" size={14} color="#666" />
                  <Text style={styles.distance}>5 km</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#6366f1" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="location-outline" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="calendar-outline" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="chatbubble-outline" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
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
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
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
});