import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Barbershop {
  id: string;
  name: string;
  address: string;
  location: Location;
  rating: number;
  distance?: number;
}

class MapService {
  constructor() {
    Geocoder.init('YOUR_GOOGLE_MAPS_API_KEY');
  }

  getCurrentLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  }

  async searchNearbyBarbershops(location: Location, radius: number = 5000): Promise<Barbershop[]> {
    // Mock data - replace with actual API call
    return [
      {
        id: '1',
        name: 'Elite Cuts',
        address: '123 Main St',
        location: { latitude: location.latitude + 0.001, longitude: location.longitude + 0.001 },
        rating: 4.5,
      },
      {
        id: '2',
        name: 'Style Studio',
        address: '456 Oak Ave',
        location: { latitude: location.latitude - 0.002, longitude: location.longitude + 0.002 },
        rating: 4.8,
      },
    ];
  }

  calculateDistance(loc1: Location, loc2: Location): number {
    const R = 6371; // Earth's radius in km
    const dLat = (loc2.latitude - loc1.latitude) * Math.PI / 180;
    const dLon = (loc2.longitude - loc1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(loc1.latitude * Math.PI / 180) * Math.cos(loc2.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}

export const mapService = new MapService();