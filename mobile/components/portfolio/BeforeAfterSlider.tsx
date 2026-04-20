import React, { useRef, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  PanResponder,
  Dimensions,
  Text,
} from 'react-native';
import { colors, borderRadius, spacing } from '@/lib/theme';

interface BeforeAfterSliderProps {
  beforeUri: string;
  afterUri: string;
  height?: number;
}

const HANDLE_SIZE = 36;

export default function BeforeAfterSlider({
  beforeUri,
  afterUri,
  height = 300,
}: BeforeAfterSliderProps) {
  const containerWidth = Dimensions.get('window').width - spacing.lg * 2;
  const [sliderX, setSliderX] = useState(containerWidth / 2);
  const sliderXRef = useRef(containerWidth / 2);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Capture current position at start of gesture
      },
      onPanResponderMove: (_evt, gestureState) => {
        const newX = Math.max(
          0,
          Math.min(containerWidth, sliderXRef.current + gestureState.dx)
        );
        setSliderX(newX);
      },
      onPanResponderRelease: () => {
        sliderXRef.current = sliderX;
      },
    })
  ).current;

  // Keep ref in sync for the next gesture
  sliderXRef.current = sliderX;

  const beforeOpacity = 1 - sliderX / containerWidth;
  const afterOpacity = sliderX / containerWidth;

  return (
    <View style={[styles.container, { height, width: containerWidth }]}>
      {/* After image (full width, below) */}
      <Image
        source={{ uri: afterUri }}
        style={[styles.image, { height, width: containerWidth }]}
        resizeMode="cover"
      />

      {/* Before image (clipped to slider position) */}
      <View style={[styles.beforeClip, { width: sliderX, height }]}>
        <Image
          source={{ uri: beforeUri }}
          style={[styles.image, { height, width: containerWidth }]}
          resizeMode="cover"
        />
      </View>

      {/* Labels */}
      <View style={[styles.label, styles.labelLeft, { opacity: Math.max(0.3, beforeOpacity) }]}>
        <Text style={styles.labelText}>Before</Text>
      </View>
      <View style={[styles.label, styles.labelRight, { opacity: Math.max(0.3, afterOpacity) }]}>
        <Text style={styles.labelText}>After</Text>
      </View>

      {/* Divider line */}
      <View
        style={[styles.divider, { left: sliderX - 1, height }]}
      />

      {/* Drag handle */}
      <View
        style={[
          styles.handle,
          {
            left: sliderX - HANDLE_SIZE / 2,
            top: height / 2 - HANDLE_SIZE / 2,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Text style={styles.handleArrows}>{'\u25C0  \u25B6'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  beforeClip: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
  divider: {
    position: 'absolute',
    top: 0,
    width: 2,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  handle: {
    position: 'absolute',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: HANDLE_SIZE / 2,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  handleArrows: {
    fontSize: 10,
    color: colors.text,
    fontWeight: '700',
  },
  label: {
    position: 'absolute',
    bottom: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  labelLeft: {
    left: spacing.sm,
  },
  labelRight: {
    right: spacing.sm,
  },
  labelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
