import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { colors } from '@/lib/theme';

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
      </View>
    );
  }
);

MapScreenComponent.displayName = 'MapScreen';
export default MapScreenComponent;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
