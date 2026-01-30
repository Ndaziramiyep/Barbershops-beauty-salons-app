import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

export const getCurrentLocation = async (): Promise<LocationData | null> => {
  try {
    // Request permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Location permission denied');
      return null;
    }

    // Get current position
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    // Reverse geocode to get address
    const reverseGeocode = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    const address = reverseGeocode[0];
    const formattedAddress = address 
      ? `${address.street || ''} ${address.city || ''}, ${address.region || ''} ${address.postalCode || ''}`.trim()
      : 'Location not found';

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      address: formattedAddress,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
};