import { useRef } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, borderRadius, shadows, spacing } from '@/lib/theme';

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
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
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
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
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
        ]}
      >
        <Text style={[styles.text, v.text, s.text, { fontWeight: '600' }]}>{title}</Text>
      </Pressable>
    </Animated.View>
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
