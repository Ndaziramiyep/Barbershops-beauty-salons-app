import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavBar from "../../components/BottomNavBar";

export default function BookingScreen() {
  const [activeTab, setActiveTab] = useState("Upcoming");

  const appointments = [
    {
      id: 1,
      date: "12 September 2021, 08:00",
      salon: "Bella Rinova",
      address: "6391 Elgin St. Celina, Delaware 10299",
      service: "Services: Regular haircut, Classic shaving",
      image: require("../../../assets/images/salon-image1.png"),
      reminder: "30 min before",
      status: "upcoming"
    },
    {
      id: 2,
      date: "24 September 2021, 16:30",
      salon: "Green Apple",
      address: "2972 Westheimer Rd. Santa Ana",
      service: "Services: Regular haircut, Classic shaving",
      image: require("../../../assets/images/salon-image1.png"),
      reminder: "Remind me",
      status: "upcoming"
    },
    {
      id: 3,
      date: "28 September 2021, 20:00",
      salon: "The Galleria",
      address: "8502 Preston Rd. Inglewood, Maine 98380",
      service: "",
      image: require("../../../assets/images/salon-image1.png"),
      reminder: "",
      status: "upcoming"
    }
  ];

  const upcomingAppointments = appointments.filter(apt => apt.status === "upcoming");

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Appointments</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="calendar-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="options-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Upcoming" && styles.activeTab]}
          onPress={() => setActiveTab("Upcoming")}
        >
          <Text style={[styles.tabText, activeTab === "Upcoming" && styles.activeTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Past" && styles.activeTab]}
          onPress={() => setActiveTab("Past")}
        >
          <Text style={[styles.tabText, activeTab === "Past" && styles.activeTabText]}>
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {/* Appointments List */}
      <ScrollView style={styles.appointmentsList} showsVerticalScrollIndicator={false}>
        {upcomingAppointments.map((appointment) => (
          <View key={appointment.id} style={styles.appointmentCard}>
            <Text style={styles.appointmentDate}>{appointment.date}</Text>
            
            <View style={styles.appointmentContent}>
              <Image source={appointment.image} style={styles.salonImage} />
              
              <View style={styles.appointmentInfo}>
                <Text style={styles.salonName}>{appointment.salon}</Text>
                <Text style={styles.salonAddress}>{appointment.address}</Text>
                {appointment.service && (
                  <Text style={styles.serviceText}>{appointment.service}</Text>
                )}
                
                <View style={styles.appointmentActions}>
                  {appointment.reminder && (
                    <View style={styles.reminderContainer}>
                      <View style={styles.reminderToggle}>
                        <View style={styles.toggleActive} />
                      </View>
                      <Text style={styles.reminderText}>{appointment.reminder}</Text>
                    </View>
                  )}
                  
                  <TouchableOpacity style={styles.cancelButton}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  headerIcons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 16,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  activeTab: {
    backgroundColor: "#2d3748",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "500",
  },
  appointmentsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  appointmentCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  appointmentContent: {
    flexDirection: "row",
  },
  salonImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  appointmentInfo: {
    flex: 1,
  },
  salonName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  salonAddress: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  serviceText: {
    fontSize: 12,
    color: "#6366f1",
    marginBottom: 12,
  },
  appointmentActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reminderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reminderToggle: {
    width: 40,
    height: 20,
    backgroundColor: "#6366f1",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 2,
    marginRight: 8,
  },
  toggleActive: {
    width: 16,
    height: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  reminderText: {
    fontSize: 12,
    color: "#333",
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelText: {
    fontSize: 12,
    color: "#666",
  },
});