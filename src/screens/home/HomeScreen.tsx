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
    { id: 1, name: 'Haircuts', image: require('../../../assets/images/haircut-style') },
    { id: 2, name: 'Make up', image: require('../../../assets/images/bridal-makeup-4.jpg') },
    { id: 3, name: 'Manicure', image: require('../../../assets/images/bridal-makeup-5.jpg') },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <Image
              source={require('../../../assets/images/specialist-profile1')}
              style={styles.profileImage}
            />
            <View>
              <Text style={styles.greeting}>Hi, Jenny Wilson</Text>
              <Text style={styles.date}>📍 123 Lygon St, Carlton Melbourne 3053</Text>
            </View>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="search-outline" size={24} color="#333" />
            </TouchableOpacity>
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
              <Text style={styles.appointmentTime}>9:00 AM</Text>
            </View>
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
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {services.map((service) => (
              <TouchableOpacity key={service.id} style={styles.serviceCard}>
                <Image source={service.image} style={styles.serviceImage} />
                <Text style={styles.serviceName}>{service.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Nearest Salon */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearest salon</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.salonCard}>
            <Image
              source={require('../../../assets/images/salon-image1')}
              style={styles.salonImage}
            />
            <View style={styles.salonInfo}>
              <Text style={styles.salonName}>Bella Rinova</Text>
              <Text style={styles.salonAddress}>123 Lygon St, Carlton Melbourne 3053</Text>
              <View style={styles.salonDetails}>
                <View style={styles.rating}>
                  {[1,2,3,4,5].map((star) => (
                    <Ionicons key={star} name="star" size={12} color="#FFD700" />
                  ))}
                </View>
                <Text style={styles.distance}>📍 5 km</Text>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
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
    opacity: 0.8,
    marginTop: 2,
  },
  serviceCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  serviceImage: {
    width: 64,
    height: 64,
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
    height: 120,
  },
  salonInfo: {
    padding: 12,
  },
  salonName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  salonAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  salonDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
  },
  distance: {
    fontSize: 12,
    color: '#666',
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