import { StyleSheet, View, Pressable } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { forwardRef, useImperativeHandle, useRef, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { getCurrentLocation } from '@/lib/location';
import { colors, shadows } from '@/lib/theme';

interface MapScreenProps {
  initialRegion?: Region;
  children?: React.ReactNode;
  onRegionChange?: (region: Region) => void;
  showsUserLocation?: boolean;
  style?: object;
}

const DEFAULT_REGION: Region = {
  latitude: 43.0718,
  longitude: -70.7626,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

const MapScreenComponent = forwardRef<MapView, MapScreenProps>(
  ({ initialRegion, children, onRegionChange, showsUserLocation = true, style }, ref) => {
    const mapRef = useRef<MapView>(null);

    useImperativeHandle(ref, () => mapRef.current!);

    const handleRecenter = useCallback(async () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const loc = await getCurrentLocation();
      if (loc && mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: loc.lat,
          longitude: loc.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }, 500);
      } else if (mapRef.current) {
        mapRef.current.animateToRegion(initialRegion ?? DEFAULT_REGION, 500);
      }
    }, [initialRegion]);

    return (
      <View style={[styles.container, style]}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion ?? DEFAULT_REGION}
          showsUserLocation={showsUserLocation}
          showsMyLocationButton={false}
          onRegionChangeComplete={onRegionChange}
          mapPadding={{ top: 0, right: 0, bottom: 80, left: 0 }}
        >
          {children}
        </MapView>

        {/* Recenter button */}
        <Pressable
          onPress={handleRecenter}
          style={({ pressed }) => [styles.recenterButton, pressed && styles.recenterPressed]}
        >
          <Ionicons name="locate" size={22} color={colors.primary} />
        </Pressable>
      </View>
    );
  }
);

MapScreenComponent.displayName = 'MapScreen';
export default MapScreenComponent;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  recenterButton: {
    position: 'absolute',
    bottom: 140,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  recenterPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
});
