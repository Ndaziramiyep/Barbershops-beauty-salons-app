import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { salonService, Salon } from '../../services/salonService';

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(false);
  const [allSalons, setAllSalons] = useState<Salon[]>([]);

  useEffect(() => {
    loadAllSalons();
  }, []);

  const loadAllSalons = async () => {
    try {
      setLoading(true);
      const data = await salonService.getAllSalons();
      setAllSalons(data);
      setSalons(data);
    } catch (error) {
      console.error('Error loading salons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSalons(allSalons);
    } else {
      const filtered = allSalons.filter(salon =>
        salon.name.toLowerCase().includes(query.toLowerCase()) ||
        salon.address.toLowerCase().includes(query.toLowerCase())
      );
      setSalons(filtered);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Salons</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search salons by name or location"
          value={searchQuery}
          onChangeText={handleSearch}
          autoFocus
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
          </View>
        ) : salons.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No salons found' : 'Start typing to search'}
            </Text>
          </View>
        ) : (
          salons.map((salon) => (
            <TouchableOpacity
              key={salon._id}
              style={styles.salonCard}
              onPress={() => router.push(`/salon-detail?salonId=${salon._id}`)}
            >
              <Image
                source={require('../../../assets/images/salon-image1.png')}
                style={styles.salonImage}
              />
              <View style={styles.salonInfo}>
                <Text style={styles.salonName}>{salon.name}</Text>
                <Text style={styles.salonAddress}>{salon.address}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  salonCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  salonImage: {
    width: '100%',
    height: 160,
  },
  salonInfo: {
    padding: 16,
  },
  salonName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  salonAddress: {
    fontSize: 14,
    color: '#666',
  },
});