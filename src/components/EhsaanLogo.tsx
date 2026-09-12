import React from 'react';

interface EhsaanLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  subtitle?: boolean;
}

export const EhsaanFlameIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-200 ${className}`}
    >
      <defs>
        <linearGradient id="ehsaan-flame-main" x1="16" y1="4" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF4D4F" />
          <stop offset="55%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>
        <linearGradient id="ehsaan-flame-inner" x1="28" y1="24" x2="44" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFA39E" />
          <stop offset="100%" stopColor="#F87171" />
        </linearGradient>
      </defs>
      {/* Outer Flame body */}
      <path
        d="M32 4C32 4 39.5 15.5 39.5 24C39.5 26.3 38.8 28.5 37.6 30.3C36.6 27.5 34.6 25.1 32 23.5C30.4 22.5 29.5 20.8 29.5 19C29.5 16.5 30.5 14.2 31.8 12.3C22.6 15.7 16 24.6 16 35C16 46.6 25.4 56 37 56C48.6 56 58 46.6 58 35C58 22.8 47.5 11.8 32 4Z"
        fill="url(#ehsaan-flame-main)"
      />
      {/* Inner Flame tongue */}
      <path
        d="M34 32C34 29.5 32.5 27 30 25.5C28.2 29.5 26 33.2 26 37C26 43.1 30.9 48 37 48C43.1 48 48 43.1 48 37C48 29 41.5 22.5 34 32Z"
        fill="url(#ehsaan-flame-inner)"
      />
      {/* Core spark */}
      <path
        d="M36 41C36 43.2 37.8 45 40 45C42.2 45 44 43.2 44 41C44 37.5 40.5 34.5 38 37C36.8 38.2 36 39.5 36 41Z"
        fill="#FFF1F0"
      />
    </svg>
  );
};

export const EhsaanLogo: React.FC<EhsaanLogoProps> = ({
  size = 36,
  showText = true,
  subtitle = true,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div className="relative flex items-center justify-center p-1 rounded-xl bg-red-500/10 dark:bg-red-500/20">
        <EhsaanFlameIcon size={size} />
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-lg leading-tight text-zinc-900 dark:text-zinc-100">
            <span>Ehsaan</span>
            <span className="px-1.5 py-0.5 text-xs font-extrabold uppercase tracking-wider rounded-md bg-red-600 text-white shadow-xs">
              QR
            </span>
          </div>
          {subtitle && (
            <span className="hidden sm:inline text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">
              Beautiful QR codes. Made simple.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
