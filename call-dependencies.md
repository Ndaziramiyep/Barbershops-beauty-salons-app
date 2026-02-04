# Voice & Video Call Dependencies

## Install Required Packages

```bash
# Core WebRTC library
npm install react-native-webrtc

# Socket.io for signaling
npm install socket.io-client

# Permissions handling
npm install react-native-permissions

# Audio/Video controls
npm install react-native-sound
npm install react-native-video

# UI components for call interface
npm install react-native-vector-icons
npm install react-native-modal
```

## Platform-specific Setup

### Android (android/app/src/main/AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
```

### iOS (ios/YourApp/Info.plist)
```xml
<key>NSCameraUsageDescription</key>
<string>This app needs camera access for video calls</string>
<key>NSMicrophoneUsageDescription</key>
<string>This app needs microphone access for voice calls</string>
```