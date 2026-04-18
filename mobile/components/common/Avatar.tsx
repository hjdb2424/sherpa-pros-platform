import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/lib/theme';

interface AvatarProps {
  initials: string;
  size?: number;
  color?: string;
}

export default function Avatar({ initials, size = 40, color = colors.primary }: AvatarProps) {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <Text style={[styles.text, { fontSize: size * 0.35 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
