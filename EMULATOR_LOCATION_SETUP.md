# Enable Location in Android Emulator

## Method 1: Using Extended Controls (Recommended)

1. **Open Android Emulator**
2. **Click the "..." (More) button** in the emulator toolbar
3. **Go to Location tab**
4. **Set location manually:**
   - Latitude: `40.7128` (New York example)
   - Longitude: `-74.0060`
   - Click "Send"

## Method 2: Using Google Maps in Emulator

1. **Open Google Maps** in the emulator
2. **Search for your desired location**
3. **This will set the emulator's location**

## Method 3: Using ADB Commands

```bash
# Set location via ADB
adb emu geo fix -74.0060 40.7128

# Or use telnet
telnet localhost 5554
geo fix -74.0060 40.7128
```

## Method 4: Enable Location Services

1. **Open Settings** in emulator
2. **Go to Location**
3. **Turn on "Use location"**
4. **Enable "Google Location Accuracy"**

## For Testing the App:

1. **Start the emulator**
2. **Set location using Method 1**
3. **Open the app**
4. **Grant location permission when prompted**
5. **The app should now use the set location**

## Common Issues:

- **Location not working**: Restart emulator after setting location
- **Permission denied**: Check app permissions in Settings > Apps > YourApp > Permissions
- **No location services**: Enable location in emulator settings

## Test Coordinates:

- **New York**: `40.7128, -74.0060`
- **London**: `51.5074, -0.1278`
- **Tokyo**: `35.6762, 139.6503`
- **Sydney**: `-33.8688, 151.2093`