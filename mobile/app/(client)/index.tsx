import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapScreen from '@/components/maps/MapScreen';
import ProMarker from '@/components/maps/ProMarker';
import ProSheet from '@/components/sheets/ProSheet';
import { MOCK_PROS } from '@/lib/types';
import { colors } from '@/lib/theme';

export default function ClientMapScreen() {
  const insets = useSafeAreaInsets();
  const [selectedProId, setSelectedProId] = useState<string | null>(null);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <MapScreen>
        {MOCK_PROS.map((pro) => (
          <ProMarker
            key={pro.id}
            pro={pro}
            onPress={() => setSelectedProId(pro.id)}
          />
        ))}
      </MapScreen>
      <ProSheet
        pros={MOCK_PROS}
        selectedId={selectedProId}
        onProSelect={(pro) => setSelectedProId(pro.id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});
