import { useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { View, Animated, PanResponder, Pressable, Dimensions, StyleSheet } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SNAP_POINTS = { peek: SCREEN_HEIGHT - 120, half: SCREEN_HEIGHT * 0.5, full: 80 };
type SnapPoint = 'peek' | 'half' | 'full';
const SNAP_ORDER: SnapPoint[] = ['full', 'half', 'peek'];

export interface SimpleBottomSheetRef {
  snapTo: (point: SnapPoint) => void;
}

interface SimpleBottomSheetProps {
  children: React.ReactNode;
  backgroundStyle?: object;
  handleIndicatorStyle?: object;
}

const SimpleBottomSheet = forwardRef<SimpleBottomSheetRef, SimpleBottomSheetProps>(
  ({ children, backgroundStyle, handleIndicatorStyle }, ref) => {
    const translateY = useRef(new Animated.Value(SNAP_POINTS.peek)).current;
    const lastY = useRef(SNAP_POINTS.peek);
    const currentSnap = useRef<SnapPoint>('peek');

    const animateTo = useCallback((point: SnapPoint) => {
      const target = SNAP_POINTS[point];
      lastY.current = target;
      currentSnap.current = point;
      Animated.spring(translateY, {
        toValue: target,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }).start();
    }, [translateY]);

    useImperativeHandle(ref, () => ({
      snapTo: animateTo,
    }));

    const handleTapToggle = useCallback(() => {
      // Cycle: peek → half → full → peek
      const idx = SNAP_ORDER.indexOf(currentSnap.current);
      const nextIdx = (idx + 1) % SNAP_ORDER.length;
      animateTo(SNAP_ORDER[nextIdx]);
    }, [animateTo]);

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
          let closest: SnapPoint = 'peek';
          let minDist = Infinity;
          for (const [key, val] of Object.entries(SNAP_POINTS)) {
            const dist = Math.abs(currentY - val);
            if (dist < minDist) {
              minDist = dist;
              closest = key as SnapPoint;
            }
          }
          animateTo(closest);
        },
      })
    ).current;

    return (
      <Animated.View
        style={[styles.sheet, backgroundStyle, { transform: [{ translateY }] }]}
        {...panResponder.panHandlers}
      >
        <Pressable onPress={handleTapToggle} style={styles.handle}>
          <View style={[styles.handleBar, handleIndicatorStyle]} />
        </Pressable>
        <View style={styles.content}>{children}</View>
      </Animated.View>
    );
  }
);

SimpleBottomSheet.displayName = 'SimpleBottomSheet';
export default SimpleBottomSheet;

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
  handle: { alignItems: 'center', paddingVertical: 14 },
  handleBar: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#d4d4d8' },
  content: { flex: 1 },
});
