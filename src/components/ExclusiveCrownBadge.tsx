import React from 'react';
import { Crown } from 'lucide-react';

export interface ExclusiveCrownBadgeProps {
  size?: 'xs' | 'sm' | 'md';
  showPrice?: boolean;
  priceText?: string;
  text?: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  asButton?: boolean;
  id?: string;
  title?: string;
}

export const ExclusiveCrownBadge: React.FC<ExclusiveCrownBadgeProps> = ({
  size = 'md',
  showPrice = true,
  priceText = '₹20',
  text = 'Exclusive',
  className = '',
  onClick,
  asButton = false,
  id,
  title,
}) => {
  const isInteractive = asButton || Boolean(onClick);

  // Size styling maps
  const sizeStyles = {
    xs: {
      container: 'px-1.5 py-0.5 text-[9px] gap-1 rounded-full',
      crown: 'w-2.5 h-2.5',
      label: 'text-[9px]',
      price: 'text-[8px] px-1 py-0.2 rounded',
    },
    sm: {
      container: 'px-2 py-0.5 text-[10px] sm:text-[11px] gap-1 rounded-full',
      crown: 'w-3 h-3',
      label: 'text-[10px] sm:text-[11px]',
      price: 'text-[9px] px-1.5 py-0.2 rounded',
    },
    md: {
      container: 'px-2.5 py-1 sm:px-3 sm:py-1 text-xs gap-1.5 rounded-full',
      crown: 'w-3.5 h-3.5',
      label: 'text-xs',
      price: 'text-[10px] px-1.5 py-0.5 rounded',
    },
  }[size];

  const content = (
    <>
      <Crown
        className={`${sizeStyles.crown} text-[#D97706] dark:text-amber-400 shrink-0 stroke-[2.2]`}
      />
      {text && (
        <span
          className={`font-semibold text-[#991B1B] dark:text-rose-300 ${sizeStyles.label} tracking-tight select-none`}
        >
          {text}
        </span>
      )}
      {showPrice && (
        <span
          className={`font-mono font-extrabold bg-[#FEF08A] dark:bg-amber-900/90 text-[#78350F] dark:text-amber-200 border border-[#FDE68A]/80 dark:border-amber-700/80 shadow-2xs leading-none shrink-0 ${sizeStyles.price}`}
        >
          {priceText}
        </span>
      )}
    </>
  );

  const baseClasses = `inline-flex items-center justify-center font-medium bg-[#FFF9F5] dark:bg-amber-950/50 border border-[#FDE68A] dark:border-amber-800/80 shadow-2xs transition-all whitespace-nowrap ${
    sizeStyles.container
  } ${
    isInteractive
      ? 'hover:bg-[#FFF3E8] hover:border-[#FCD34D] hover:scale-[1.02] active:scale-[0.97] cursor-pointer'
      : ''
  } ${className}`;

  if (isInteractive) {
    return (
      <button
        type="button"
        id={id}
        onClick={onClick}
        title={title}
        className={baseClasses}
      >
        {content}
      </button>
    );
  }

  return (
    <span id={id} title={title} className={baseClasses}>
      {content}
    </span>
  );
};

export default ExclusiveCrownBadge;
