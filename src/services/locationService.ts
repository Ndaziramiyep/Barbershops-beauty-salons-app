import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

export const getCurrentLocation = async (): Promise<LocationData | null> => {
  try {
    // Check if location services are enabled
    const enabled = await Location.hasServicesEnabledAsync();
    if (!enabled) {
      console.log('Location services are disabled');
      return null;
    }

    // Request permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Location permission denied');
      return null;
    }

    // Get current position with higher accuracy for emulator
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      timeout: 15000,
      maximumAge: 10000,
    });

    // Reverse geocode to get address
    const reverseGeocode = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    const address = reverseGeocode[0];
    const formattedAddress = address 
      ? `${address.street || ''} ${address.city || ''}, ${address.region || ''} ${address.postalCode || ''}`.trim()
      : `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`;

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      address: formattedAddress,
    };
  } catch (error) {
    console.log('Error getting location:', error);
    return null;
  }
};