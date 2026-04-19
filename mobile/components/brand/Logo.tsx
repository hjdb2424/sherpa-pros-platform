import { Image } from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logoImage = require('../../assets/logo.png');

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZES = {
  sm: { width: 120, height: 24 },
  md: { width: 160, height: 32 },
  lg: { width: 200, height: 40 },
  xl: { width: 280, height: 56 },
};

export default function Logo({ size = 'md' }: LogoProps) {
  const s = SIZES[size];
  return (
    <Image
      source={logoImage}
      style={{ width: s.width, height: s.height }}
      resizeMode="contain"
    />
  );
}
