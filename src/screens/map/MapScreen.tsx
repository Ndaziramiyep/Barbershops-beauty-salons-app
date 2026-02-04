import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { mapService, Location, Barbershop } from '../../services/mapService';

const MapScreen: React.FC = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const location = await mapService.getCurrentLocation();
      setUserLocation(location);
      setRegion({
        ...region,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      
      const nearbyShops = await mapService.searchNearbyBarbershops(location);
      setBarbershops(nearbyShops);
    } catch (error) {
      Alert.alert('Location Error', 'Unable to get your location');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Your Location"
            pinColor="blue"
          />
        )}
        
        {barbershops.map((shop) => (
          <Marker
            key={shop.id}
            coordinate={shop.location}
            title={shop.name}
            description={`${shop.address} • ⭐ ${shop.rating}`}
            pinColor="red"
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;