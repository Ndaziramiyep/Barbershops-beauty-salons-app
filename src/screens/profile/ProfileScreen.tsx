import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavBar from "../../components/BottomNavBar";
import { useAuth } from "../../services/authContext";

export default function ProfileScreen() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/');
          },
        },
      ]
    );
  };
  const menuItems = [
    {
      id: 1,
      icon: "card-outline",
      title: "Payment Methods",
      hasArrow: true
    },
    {
      id: 2,
      icon: "time-outline",
      title: "Payment History",
      hasArrow: true
    },
    {
      id: 3,
      icon: "lock-closed-outline",
      title: "Change Password",
      hasArrow: true
    },
    {
      id: 4,
      icon: "people-outline",
      title: "Invites Friends",
      hasArrow: true
    },
    {
      id: 5,
      icon: "help-circle-outline",
      title: "FAQs",
      hasArrow: true
    },
    {
      id: 6,
      icon: "information-circle-outline",
      title: "About Us",
      hasArrow: true
    },
    {
      id: 7,
      icon: "log-out-outline",
      title: "Logout",
      hasArrow: true
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image
              source={require("../../../assets/images/specialist-profile1.jpg")}
              style={styles.profileImage}
            />
          </View>
          
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="notifications-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="heart-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.userName}>Robert Fox</Text>
            <TouchableOpacity style={styles.editIcon}>
              <Ionicons name="create-outline" size={16} color="#6366f1" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userEmail}>robert_fox@gmail.com</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.menuItem}
              onPress={item.title === 'Logout' ? handleLogout : undefined}
            >
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon} size={20} color="#333" />
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              {item.hasArrow && (
                <Ionicons name="chevron-forward" size={20} color="#999" />
              )}
            </TouchableOpacity>
          ))}
        </View>
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
  content: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  profileImageContainer: {
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  headerIcons: {
    flexDirection: "row",
  },
  headerIcon: {
    marginLeft: 16,
  },
  userInfo: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginRight: 8,
  },
  editIcon: {
    padding: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuTitle: {
    fontSize: 16,
    color: "#333",
    marginLeft: 16,
  },
});