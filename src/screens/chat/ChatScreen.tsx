import { Ionicons } from "@expo/vector-icons";
import React from "react";
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

export default function ChatScreen() {
  const messages = [
    {
      id: 1,
      name: "Angela Young",
      message: "Don't forget to take your medicine",
      time: "9:36",
      avatar: require("../../../assets/images/specialist-profile1.jpg"),
      unread: 1,
      online: true
    },
    {
      id: 2,
      name: "Steve Didko",
      message: "What time will you pick me up today?",
      time: "8:15",
      avatar: require("../../../assets/images/specialist-profile1.jpg"),
      unread: 2,
      online: true
    },
    {
      id: 3,
      name: "Andrew Bolton",
      message: "Wow, awesome! Thank you...",
      time: "Yesterday",
      avatar: require("../../../assets/images/specialist-profile1.jpg"),
      unread: 0,
      online: false
    },
    {
      id: 4,
      name: "Jeremy Runner",
      message: "Yeah, how can I change the hair...",
      time: "2 Jun",
      avatar: require("../../../assets/images/specialist-profile1.jpg"),
      unread: 0,
      online: false
    },
    {
      id: 5,
      name: "Esther Howard",
      message: "I think it's better to have...",
      time: "24 May",
      avatar: require("../../../assets/images/specialist-profile1.jpg"),
      unread: 0,
      online: false
    },
    {
      id: 6,
      name: "Kathryn Murphy",
      message: "How are you today?",
      time: "12 May",
      avatar: require("../../../assets/images/specialist-profile1.jpg"),
      unread: 0,
      online: false
    },
    {
      id: 7,
      name: "Cody Fisher",
      message: "Which kind of package is offer",
      time: "8 May",
      avatar: require("../../../assets/images/specialist-profile1.jpg"),
      unread: 0,
      online: false
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>2 new message</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="settings-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Message Tab */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.activeTab}>
          <Text style={styles.activeTabText}>Message</Text>
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <ScrollView style={styles.messagesList} showsVerticalScrollIndicator={false}>
        {messages.map((message) => (
          <TouchableOpacity key={message.id} style={styles.messageItem}>
            <View style={styles.avatarContainer}>
              <Image source={message.avatar} style={styles.avatar} />
              {message.online && <View style={styles.onlineIndicator} />}
            </View>
            
            <View style={styles.messageContent}>
              <View style={styles.messageHeader}>
                <Text style={styles.senderName}>{message.name}</Text>
                <Text style={styles.messageTime}>{message.time}</Text>
              </View>
              <Text style={styles.messageText} numberOfLines={1}>
                {message.message}
              </Text>
            </View>

            {message.unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{message.unread}</Text>
              </View>
            )}
          </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#fff",
  },
  activeTab: {
    backgroundColor: "#2d3748",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  activeTabText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  messagesList: {
    flex: 1,
    backgroundColor: "#fff",
  },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    backgroundColor: "#10b981",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  senderName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  messageTime: {
    fontSize: 12,
    color: "#999",
  },
  messageText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  unreadBadge: {
    backgroundColor: "#ef4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  unreadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});