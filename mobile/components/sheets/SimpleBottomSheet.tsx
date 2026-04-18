import { useRef } from 'react';
import { View, Animated, PanResponder, Dimensions, StyleSheet } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SNAP_POINTS = { peek: SCREEN_HEIGHT - 120, half: SCREEN_HEIGHT * 0.5, full: 80 };

interface SimpleBottomSheetProps {
  children: React.ReactNode;
  backgroundStyle?: object;
  handleIndicatorStyle?: object;
}

export default function SimpleBottomSheet({ children, backgroundStyle, handleIndicatorStyle }: SimpleBottomSheetProps) {
  const translateY = useRef(new Animated.Value(SNAP_POINTS.peek)).current;
  const lastY = useRef(SNAP_POINTS.peek);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 10,
      onPanResponderMove: (_, gesture) => {
        const newY = lastY.current + gesture.dy;
        const clamped = Math.max(SNAP_POINTS.full, Math.min(SNAP_POINTS.peek, newY));
        translateY.setValue(clamped);
      },
      onPanResponderRelease: (_, gesture) => {
        const currentY = lastY.current + gesture.dy;
        let closest = SNAP_POINTS.peek;
        let minDist = Infinity;
        for (const val of Object.values(SNAP_POINTS)) {
          const dist = Math.abs(currentY - val);
          if (dist < minDist) {
            minDist = dist;
            closest = val;
          }
        }
        lastY.current = closest;
        Animated.spring(translateY, {
          toValue: closest,
          useNativeDriver: true,
          damping: 20,
          stiffness: 200,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      style={[styles.sheet, backgroundStyle, { transform: [{ translateY }] }]}
      {...panResponder.panHandlers}
    >
      <View style={styles.handle}>
        <View style={[styles.handleBar, handleIndicatorStyle]} />
      </View>
      <View style={styles.content}>{children}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  handle: { alignItems: 'center', paddingVertical: 10 },
  handleBar: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#d4d4d8' },
  content: { flex: 1 },
});
