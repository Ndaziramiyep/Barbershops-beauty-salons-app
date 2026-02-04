# Map Dependencies

## Required Packages
```bash
npm install react-native-maps
npm install @react-native-community/geolocation
npm install react-native-geocoding
npm install react-native-permissions
```

## Platform Setup

### Android (android/app/src/main/AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

<application>
  <meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
</application>
```

### iOS (ios/YourApp/Info.plist)
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs location access to find nearby barbershops</string>
```