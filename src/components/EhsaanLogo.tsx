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
    <img
      src="/assets/aistudio/logo-transparent.png?v=5.0.0"
      alt="Ehsaan QR Logo"
      width={size}
      height={size}
      className={`shrink-0 rounded-full shadow-2xs object-contain transition-transform duration-200 select-none ${className}`}
      style={{ width: size, height: size }}
      loading="eager"
    />
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
      <div className="relative flex items-center justify-center shrink-0">
        <EhsaanFlameIcon size={size} />
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-lg leading-tight text-zinc-900 dark:text-zinc-100">
            <span>Ehsaan</span>
            <span className="px-1.5 py-0.5 text-xs font-black uppercase tracking-wider rounded-md bg-[#e9fa00] text-black border border-[#d2e200] shadow-2xs flex items-center gap-1">
              <span>QR</span>
              <span className="w-1.5 h-1.5 rounded-full bg-black shadow-xs" title="Deep black signature" />
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
