import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('Salon');
  const router = useRouter();

  const popularArtists = [
    { id: 1, name: 'Lily', image: require('../assets/images/specialist-profile1.jpg') },
    { id: 2, name: 'Lee', image: require('../assets/images/specialist-profile2.jpg') },
    { id: 3, name: 'Connor', image: require('../assets/images/specialist-profile4.jpg') },
    { id: 4, name: 'Jason', image: require('../assets/images/specialist-profile5.jpg') },
  ];

  const searchResults = [
    {
      id: 1,
      name: 'Green Apple',
      address: '6391 Elgin St, Celina, Delaware',
      rating: 4.5,
      distance: '15 km',
      image: require('../assets/images/salon-image1.png'),
    },
    {
      id: 2,
      name: 'Bella Rinova',
      address: '2972 Westheimer Rd, Santa Ana',
      rating: 4.0,
      distance: '25 km',
      image: require('../assets/images/salon-image2.jpg'),
    },
    {
      id: 3,
      name: 'The Galleria',
      address: '8502 Preston Rd, Inglewood, Maine',
      rating: 3.7,
      distance: '48 km',
      image: require('../assets/images/salon-image4.jpg'),
    },
    {
      id: 4,
      name: 'Michael Saldana',
      address: '3891 Ranchview Dr, Richardson',
      rating: 4.6,
      distance: '59 km',
      image: require('../assets/images/salon-image5.jpg'),
    },
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={12} color="#FFD700" />);
    }
    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={12} color="#FFD700" />);
    }
    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search salons, services..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options" size={20} color="#333" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          <TouchableOpacity style={[styles.filterTab, styles.activeTab]}>
            <Text style={[styles.filterText, styles.activeFilterText]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterTab}>
            <Text style={styles.filterText}>Nearby</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterTab}>
            <Text style={styles.filterText}>Popular</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterTab}>
            <Text style={styles.filterText}>Trending</Text>
          </TouchableOpacity>
        </View>

        {/* Popular Artists */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular artist</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.artistsContainer}>
            {popularArtists.map((artist) => (
              <TouchableOpacity key={artist.id} style={styles.artistCard}>
                <Image source={artist.image} style={styles.artistImage} />
                <Text style={styles.artistName}>{artist.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Search Results */}
        <View style={styles.section}>
          <Text style={styles.resultsTitle}>Result found (248)</Text>
          {searchResults.map((salon) => (
            <TouchableOpacity key={salon.id} style={styles.salonCard}>
              <Image source={salon.image} style={styles.salonImage} />
              <View style={styles.salonInfo}>
                <Text style={styles.salonName}>{salon.name}</Text>
                <Text style={styles.salonAddress}>{salon.address}</Text>
                <View style={styles.salonDetails}>
                  <View style={styles.ratingContainer}>
                    {renderStars(salon.rating)}
                    <Text style={styles.ratingText}>{salon.rating}</Text>
                  </View>
                  <Text style={styles.distance}>{salon.distance}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookButtonText}>Book</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  filterButton: {
    padding: 4,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  activeTab: {
    backgroundColor: '#6366f1',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  artistsContainer: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  artistCard: {
    alignItems: 'center',
    marginRight: 16,
  },
  artistImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  artistName: {
    fontSize: 12,
    color: '#333',
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  salonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  salonImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  salonInfo: {
    flex: 1,
  },
  salonName: {
    fontSize: 16,
    fontWeight: '600',
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  distance: {
    fontSize: 12,
    color: '#666',
  },
  bookButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});