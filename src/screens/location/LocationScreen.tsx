import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavBar from "../../components/BottomNavBar";
import {
  getCurrentLocation,
  LocationData,
} from "../../services/locationService";

export default function LocationScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLocation, setCurrentLocation] = useState(
    "Fetching location...",
  );
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  const fetchLocation = async () => {
    const location = await getCurrentLocation();
    if (location) {
      setLocationData(location);
      setCurrentLocation(location.address);
    } else {
      setCurrentLocation("Location unavailable");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchLocation();
    }, []),
  );

  const nearbyPlaces = [
    {
      id: 1,
      name: "Bella Rinova",
      address: "2972 Westheimer Rd. Santa Ana",
      rating: 4.8,
      distance: "25 km",
      image: require("../../../assets/images/salon-image1.png"),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationInfo}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.locationText}>{currentLocation}</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by location"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Map Area */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: locationData?.latitude || 37.78825,
            longitude: locationData?.longitude || -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {/* Salon markers */}
          <Marker
            coordinate={{
              latitude: (locationData?.latitude || 37.78825) + 0.01,
              longitude: (locationData?.longitude || -122.4324) + 0.01,
            }}
            title="Bella Rinova"
            description="Beauty Salon"
          >
            <View style={styles.customMarker}>
              <Ionicons name="location" size={30} color="#6366f1" />
            </View>
          </Marker>

          <Marker
            coordinate={{
              latitude: (locationData?.latitude || 37.78825) - 0.01,
              longitude: (locationData?.longitude || -122.4324) + 0.015,
            }}
            title="Hair Specialist"
            description="Hair Salon"
          >
            <View style={styles.avatarMarker}>
              <Image
                source={require("../../../assets/images/specialist-profile1.jpg")}
                style={styles.markerAvatar}
              />
            </View>
          </Marker>
        </MapView>
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.bottomSheetHandle} />

        <View style={styles.cardContainer}>
          {nearbyPlaces.map((place) => (
            <TouchableOpacity key={place.id} style={styles.placeCard}>
              <Image source={place.image} style={styles.placeImage} />
              <View style={styles.placeInfo}>
                <Text style={styles.placeName}>{place.name}</Text>
                <Text style={styles.placeAddress}>{place.address}</Text>
                <View style={styles.placeDetails}>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.rating}>{place.rating}</Text>
                  </View>
                  <Text style={styles.distance}>{place.distance}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  filterButton: {
    marginLeft: 12,
  },
  mapContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  customMarker: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#fff",
    overflow: "hidden",
  },
  markerAvatar: {
    width: "100%",
    height: "100%",
  },
  bottomSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  cardContainer: {
    alignItems: "center",
  },
  placeCard: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  placeInfo: {
    padding: 16,
  },
  placeName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  placeAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  placeDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  distance: {
    fontSize: 14,
    color: "#666",
  },
});
