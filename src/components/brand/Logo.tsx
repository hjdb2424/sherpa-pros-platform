import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  /** When provided, the logo links to this path. Defaults to "/" */
  href?: string;
  /** Set to false to render the logo without a link wrapper */
  asLink?: boolean;
}

const SIZES = {
  sm: { width: 120, height: 24 },
  md: { width: 160, height: 32 },
  lg: { width: 200, height: 40 },
  xl: { width: 260, height: 52 },
};

export default function Logo({ size = 'md', className = '', href = '/', asLink = true }: LogoProps) {
  const s = SIZES[size];
  const img = (
    <Image
      src="/logo.png"
      alt="Sherpa Pros"
      width={s.width}
      height={s.height}
      className={className}
      priority
    />
  );

  if (!asLink) return img;

  return (
    <Link href={href} className="inline-flex items-center" aria-label="Go to home">
      {img}
    </Link>
  );
}
