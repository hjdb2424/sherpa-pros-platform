import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, shadows, spacing } from '@/lib/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'outlined' | 'elevated';
}

export default function Card({ children, style, variant = 'default' }: CardProps) {
  const variantStyles: Record<string, ViewStyle> = {
    default: { ...shadows.sm, borderWidth: 1, borderColor: colors.border },
    outlined: { borderWidth: 1, borderColor: colors.borderMedium },
    elevated: { ...shadows.md },
  };

  return (
    <View style={[styles.base, variantStyles[variant], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
});
