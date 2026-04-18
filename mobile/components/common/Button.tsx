import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors, borderRadius, shadows, spacing } from '@/lib/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const variantStyles: Record<string, { container: ViewStyle; text: TextStyle }> = {
    primary: {
      container: { backgroundColor: colors.primary, ...shadows.primaryGlow },
      text: { color: colors.textInverse },
    },
    secondary: {
      container: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderMedium },
      text: { color: colors.text },
    },
    ghost: {
      container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.borderMedium },
      text: { color: colors.textSecondary },
    },
    accent: {
      container: { backgroundColor: colors.accent },
      text: { color: colors.textInverse },
    },
  };

  const sizeStyles: Record<string, { container: ViewStyle; text: TextStyle }> = {
    sm: { container: { paddingVertical: 8, paddingHorizontal: 16 }, text: { fontSize: 13 } },
    md: { container: { paddingVertical: 12, paddingHorizontal: 24 }, text: { fontSize: 15 } },
    lg: { container: { paddingVertical: 16, paddingHorizontal: 32 }, text: { fontSize: 16 } },
  };

  const v = variantStyles[variant];
  const s = sizeStyles[size];

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.base,
        v.container,
        s.container,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        animatedStyle,
      ]}
    >
      <Text style={[styles.text, v.text, s.text, { fontWeight: '600' }]}>{title}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '600',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});
