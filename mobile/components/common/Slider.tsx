import { useState, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, shadows } from '@/lib/theme';

interface SliderProps {
  value: number;
  minimumValue: number;
  maximumValue: number;
  step?: number;
  onValueChange: (value: number) => void;
}

export default function Slider({
  value,
  minimumValue,
  maximumValue,
  step = 1,
  onValueChange,
}: SliderProps) {
  const trackWidth = useRef(0);
  const lastStepValue = useRef(value);

  const fraction = (value - minimumValue) / (maximumValue - minimumValue);

  const clampToStep = useCallback(
    (raw: number): number => {
      const clamped = Math.min(maximumValue, Math.max(minimumValue, raw));
      if (step > 0) {
        return Math.round((clamped - minimumValue) / step) * step + minimumValue;
      }
      return clamped;
    },
    [minimumValue, maximumValue, step],
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const x = evt.nativeEvent.locationX;
        const frac = x / trackWidth.current;
        const raw = minimumValue + frac * (maximumValue - minimumValue);
        const stepped = clampToStep(raw);
        lastStepValue.current = stepped;
        onValueChange(stepped);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      },
      onPanResponderMove: (evt) => {
        const x = evt.nativeEvent.locationX;
        const frac = Math.max(0, Math.min(1, x / trackWidth.current));
        const raw = minimumValue + frac * (maximumValue - minimumValue);
        const stepped = clampToStep(raw);
        if (stepped !== lastStepValue.current) {
          lastStepValue.current = stepped;
          onValueChange(stepped);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      },
    }),
  ).current;

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    trackWidth.current = e.nativeEvent.layout.width;
  }, []);

  return (
    <View
      style={styles.container}
      onLayout={handleLayout}
      {...panResponder.panHandlers}
    >
      <View style={styles.track}>
        <View style={[styles.trackFill, { width: `${fraction * 100}%` }]} />
      </View>
      <View
        style={[
          styles.thumb,
          {
            left: `${fraction * 100}%`,
            marginLeft: -12,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderMedium,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: colors.primary,
    ...shadows.md,
  },
});
