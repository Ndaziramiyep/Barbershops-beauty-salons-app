import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function VideoCallScreen() {
  const router = useRouter();
  const { contactName } = useLocalSearchParams();
  const [callDuration, setCallDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsConnected(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const endCall = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Main Video Area */}
      <View style={styles.videoContainer}>
        <Image
          source={require('../assets/images/specialist-profile1.jpg')}
          style={styles.mainVideo}
        />
        
        {/* Self Video */}
        <View style={styles.selfVideoContainer}>
          <Image
            source={require('../assets/images/specialist-profile2.jpg')}
            style={styles.selfVideo}
          />
        </View>

        {/* Call Info Overlay */}
        <View style={styles.callInfoOverlay}>
          <Text style={styles.contactName}>{contactName || 'Angela Young'}</Text>
          <Text style={styles.callStatus}>
            {isConnected ? formatTime(callDuration) : 'Connecting...'}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={[styles.controlButton, isMuted && styles.activeButton]} 
          onPress={() => setIsMuted(!isMuted)}
        >
          <Ionicons name={isMuted ? "mic-off" : "mic"} size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, styles.endCallButton]} 
          onPress={endCall}
        >
          <Ionicons name="call" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, isVideoOff && styles.activeButton]} 
          onPress={() => setIsVideoOff(!isVideoOff)}
        >
          <Ionicons name={isVideoOff ? "videocam-off" : "videocam"} size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  mainVideo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  selfVideoContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  selfVideo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  callInfoOverlay: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  contactName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  callStatus: {
    fontSize: 14,
    color: '#ccc',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 60,
    paddingVertical: 40,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  endCallButton: {
    backgroundColor: '#ef4444',
  },
});