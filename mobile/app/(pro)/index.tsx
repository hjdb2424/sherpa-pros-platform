import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapScreen from '@/components/maps/MapScreen';
import JobMarker from '@/components/maps/JobMarker';
import JobSheet from '@/components/sheets/JobSheet';
import { MOCK_JOBS } from '@/lib/types';
import { colors } from '@/lib/theme';

export default function ProMapScreen() {
  const insets = useSafeAreaInsets();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <MapScreen>
        {MOCK_JOBS.map((job) => (
          <JobMarker
            key={job.id}
            job={job}
            onPress={() => setSelectedJobId(job.id)}
          />
        ))}
      </MapScreen>
      <JobSheet
        jobs={MOCK_JOBS}
        selectedId={selectedJobId}
        onJobSelect={(job) => setSelectedJobId(job.id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});
