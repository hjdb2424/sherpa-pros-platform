import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZES = {
  sm: { width: 120, height: 24 },
  md: { width: 160, height: 32 },
  lg: { width: 200, height: 40 },
  xl: { width: 260, height: 52 },
};

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const s = SIZES[size];
  return (
    <Image
      src="/logo.png"
      alt="Sherpa Pros"
      width={s.width}
      height={s.height}
      className={className}
      priority
    />
  );
}
