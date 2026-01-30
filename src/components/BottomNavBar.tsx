import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { icon: "home-outline", activeIcon: "home", route: "/home" },
    { icon: "location-outline", activeIcon: "location", route: "/location" },
    { icon: "calendar-outline", activeIcon: "calendar", route: "/booking" },
    { icon: "chatbubble-outline", activeIcon: "chatbubble", route: "/chat" },
    { icon: "person-outline", activeIcon: "person", route: "/profile" },
  ];

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item, index) => {
        const isActive = pathname === item.route;
        return (
          <TouchableOpacity
            key={index}
            style={[styles.navItem, isActive && styles.activeNavItem]}
            onPress={() => {
              console.log('Navigating to:', item.route);
              router.push(item.route);
            }}
          >
            <Ionicons
              name={isActive ? item.activeIcon : item.icon}
              size={24}
              color={isActive ? "#6366f1" : "#999"}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  navItem: {
    padding: 8,
  },
  activeNavItem: {
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    borderRadius: 12,
    paddingVertical: 8,
  },
});