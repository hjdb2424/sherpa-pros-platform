import { Image, StyleSheet } from 'react-native';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZES = {
  sm: { width: 120, height: 24 },
  md: { width: 160, height: 32 },
  lg: { width: 200, height: 40 },
  xl: { width: 260, height: 52 },
};

export default function Logo({ size = 'md' }: LogoProps) {
  const s = SIZES[size];
  return (
    <Image
      source={require('@/assets/logo.png')}
      style={{ width: s.width, height: s.height }}
      resizeMode="contain"
    />
  );
}
