'use client';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeConfig = {
  sm: { height: 24, fontSize: 10, px: 6, diag: 6 },
  md: { height: 32, fontSize: 13, px: 8, diag: 7 },
  lg: { height: 48, fontSize: 20, px: 12, diag: 10 },
  xl: { height: 64, fontSize: 26, px: 16, diag: 12 },
} as const;

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const { height, fontSize, px, diag } = sizeConfig[size];

  return (
    <div
      className={`inline-flex items-stretch overflow-hidden rounded-sm ${className}`}
      style={{ height }}
      role="img"
      aria-label="Sherpa Pros"
    >
      {/* SHERPA block — sky blue with diagonal right edge */}
      <div
        className="relative flex items-center bg-[#00a9e0]"
        style={{
          paddingLeft: px,
          paddingRight: px + diag,
          clipPath: `polygon(0 0, 100% 0, calc(100% - ${diag}px) 100%, 0 100%)`,
        }}
      >
        <span
          className="font-black uppercase leading-none tracking-tight text-white"
          style={{ fontSize }}
        >
          SHERPA
        </span>
      </div>
      {/* PROS block — orange-red */}
      <div
        className="flex items-center bg-[#ff4500]"
        style={{
          paddingLeft: px - Math.round(diag / 2),
          paddingRight: px,
          marginLeft: `-${Math.round(diag / 2)}px`,
        }}
      >
        <span
          className="font-black uppercase leading-none tracking-tight text-white"
          style={{ fontSize }}
        >
          PROS
        </span>
      </div>
    </div>
  );
}
