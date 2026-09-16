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
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-200 ${className}`}
    >
      {/* Circular Green Background */}
      <circle cx="256" cy="256" r="248" fill="#9FB365" stroke="#879C4E" strokeWidth="8" />

      {/* Outer Red Flame Body */}
      <path
        d="M 270 58
           C 260 85, 248 115, 244 145
           C 240 178, 252 205, 268 228
           C 285 205, 320 185, 365 160
           C 350 200, 335 250, 355 290
           C 385 270, 410 260, 430 275
           C 420 330, 385 395, 345 425
           C 310 448, 270 455, 235 450
           C 175 440, 115 395, 88 335
           C 76 305, 75 275, 78 260
           C 95 275, 125 285, 148 275
           C 138 240, 140 190, 160 140
           C 175 105, 205 75, 235 60
           C 250 54, 265 54, 270 58 Z"
        fill="#FF3E3E"
      />

      {/* Middle Orange Flame Body */}
      <path
        d="M 212 205
           C 192 235, 170 275, 160 325
           C 152 365, 165 405, 195 430
           C 225 450, 265 452, 298 438
           C 325 425, 345 398, 348 368
           C 342 348, 335 330, 330 310
           C 335 295, 342 282, 348 270
           C 328 275, 305 282, 285 295
           C 272 265, 248 230, 212 205 Z"
        fill="#FF8A1E"
      />

      {/* Inner Yellow Flame Core */}
      <path
        d="M 215 350
           C 200 375, 195 405, 212 428
           C 228 448, 258 452, 278 442
           C 298 430, 312 408, 312 385
           C 310 365, 295 352, 280 348
           C 255 340, 230 330, 215 350 Z"
        fill="#FFD23F"
      />

      {/* Main Flame Black Outlines */}
      {/* Outer Outline */}
      <path
        d="M 270 58
           C 260 85, 248 115, 244 145
           C 240 178, 252 205, 268 228
           C 285 205, 320 185, 365 160
           C 350 200, 335 250, 355 290
           C 385 270, 410 260, 430 275
           C 420 330, 385 395, 345 425
           C 310 448, 270 455, 235 450
           C 175 440, 115 395, 88 335
           C 76 305, 75 275, 78 260
           C 95 275, 125 285, 148 275
           C 138 240, 140 190, 160 140
           C 175 105, 205 75, 235 60"
        stroke="#111827"
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Top Tip Hook Outline Accent */}
      <path
        d="M 218 74 C 235 60, 255 54, 270 58"
        stroke="#111827"
        strokeWidth="18"
        strokeLinecap="round"
        fill="none"
      />

      {/* Floating Black Dot Top-Left */}
      <circle cx="197" cy="88" r="9" fill="#111827" />

      {/* Orange Flame Outline */}
      <path
        d="M 212 205
           C 192 235, 170 275, 160 325
           C 152 365, 165 405, 195 430
           C 225 450, 265 452, 298 438
           C 325 425, 345 398, 348 368
           C 342 348, 335 330, 330 310
           C 335 295, 342 282, 348 270
           C 328 275, 305 282, 285 295
           C 272 265, 248 230, 212 205 Z"
        stroke="#111827"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Yellow Inner Core Outline */}
      <path
        d="M 215 350
           C 200 375, 195 405, 212 428
           C 228 448, 258 452, 278 442
           C 298 430, 312 408, 312 385
           C 310 365, 295 352, 280 348
           C 255 340, 230 330, 215 350 Z"
        stroke="#111827"
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Comic Accents on Lower-Right */}
      <circle cx="336" cy="348" r="8.5" fill="#111827" />
      <path
        d="M 334 380 C 333 392, 328 405, 322 416"
        stroke="#111827"
        strokeWidth="15"
        strokeLinecap="round"
        fill="none"
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
      <div className="relative flex items-center justify-center shrink-0">
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
