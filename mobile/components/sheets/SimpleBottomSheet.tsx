import { useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { View, Animated, PanResponder, Pressable, Dimensions, StyleSheet } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

// Snap points as distance from TOP of screen
const SNAP_POINTS = {
  peek: SCREEN_HEIGHT - 120,    // only 120px visible at bottom
  half: SCREEN_HEIGHT * 0.5,    // half screen
  full: 80,                      // nearly full screen
};

type SnapPoint = 'peek' | 'half' | 'full';

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
    // Height of visible sheet (animated)
    const sheetHeight = useRef(new Animated.Value(120)).current;
    const currentSnap = useRef<SnapPoint>('peek');

    const getHeightForSnap = (snap: SnapPoint) => {
      return SCREEN_HEIGHT - SNAP_POINTS[snap];
    };

    const animateTo = useCallback((point: SnapPoint) => {
      currentSnap.current = point;
      Animated.spring(sheetHeight, {
        toValue: getHeightForSnap(point),
        useNativeDriver: false, // height animation can't use native driver
        damping: 20,
        stiffness: 200,
      }).start();
    }, [sheetHeight]);

    useImperativeHandle(ref, () => ({
      snapTo: animateTo,
    }));

    const handleTapToggle = useCallback(() => {
      const order: SnapPoint[] = ['peek', 'half', 'full'];
      const idx = order.indexOf(currentSnap.current);
      const next = order[(idx + 1) % order.length];
      animateTo(next);
    }, [animateTo]);

    const dragStartHeight = useRef(120);

    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 10,
        onPanResponderGrant: () => {
          dragStartHeight.current = getHeightForSnap(currentSnap.current);
        },
        onPanResponderMove: (_, gesture) => {
          // Dragging up = negative dy = increase height
          const newHeight = dragStartHeight.current - gesture.dy;
          const clamped = Math.max(120, Math.min(SCREEN_HEIGHT - 80, newHeight));
          sheetHeight.setValue(clamped);
        },
        onPanResponderRelease: (_, gesture) => {
          const finalHeight = dragStartHeight.current - gesture.dy;
          // Find nearest snap
          let closest: SnapPoint = 'peek';
          let minDist = Infinity;
          for (const [key, topY] of Object.entries(SNAP_POINTS)) {
            const h = SCREEN_HEIGHT - topY;
            const dist = Math.abs(finalHeight - h);
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
        style={[
          styles.sheet,
          backgroundStyle,
          { height: sheetHeight },
        ]}
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
    bottom: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    overflow: 'hidden',
  },
  handle: { alignItems: 'center', paddingVertical: 14 },
  handleBar: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#d4d4d8' },
  content: { flex: 1 },
});
