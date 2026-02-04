import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  RTCView,
  MediaStream,
} from 'react-native-webrtc';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { callService } from '../services/callService';

interface CallScreenProps {
  callId: string;
  isVideo: boolean;
  isIncoming: boolean;
  contactName: string;
  onEndCall: () => void;
}

const CallScreen: React.FC<CallScreenProps> = ({
  callId,
  isVideo,
  isIncoming,
  contactName,
  onEndCall,
}) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(isVideo);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setLocalStream(callService.getLocalStream());
    setRemoteStream(callService.getRemoteStream());
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const handleEndCall = () => {
    callService.endCall();
    onEndCall();
  };

  return (
    <View style={styles.container}>
      {isVideo && remoteStream && (
        <RTCView
          style={styles.remoteVideo}
          streamURL={remoteStream.toURL()}
          objectFit="cover"
        />
      )}

      {isVideo && localStream && (
        <RTCView
          style={styles.localVideo}
          streamURL={localStream.toURL()}
          objectFit="cover"
          mirror={true}
        />
      )}

      {!isVideo && (
        <View style={styles.audioCallContainer}>
          <Text style={styles.contactName}>{contactName}</Text>
          <Text style={styles.callStatus}>
            {isIncoming ? 'Incoming call...' : 'Calling...'}
          </Text>
        </View>
      )}

      <View style={styles.callInfo}>
        <Text style={styles.duration}>{formatDuration(callDuration)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.activeButton]}
          onPress={toggleMute}
        >
          <Icon name={isMuted ? 'mic-off' : 'mic'} size={24} color="white" />
        </TouchableOpacity>

        {isVideo && (
          <TouchableOpacity
            style={[styles.controlButton, !isVideoEnabled && styles.activeButton]}
            onPress={toggleVideo}
          >
            <Icon 
              name={isVideoEnabled ? 'videocam' : 'videocam-off'} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.controlButton, styles.endCallButton]}
          onPress={handleEndCall}
        >
          <Icon name="call-end" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  remoteVideo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  localVideo: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 10,
    zIndex: 1,
  },
  audioCallContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  callStatus: {
    fontSize: 16,
    color: '#ccc',
  },
  callInfo: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
  duration: {
    color: 'white',
    fontSize: 16,
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 50,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#ff4444',
  },
  endCallButton: {
    backgroundColor: '#ff4444',
  },
});

export default CallScreen;