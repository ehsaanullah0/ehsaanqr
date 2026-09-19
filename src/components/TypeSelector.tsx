import React from 'react';
import { QrType } from '../types';
import { useExclusiveAccess } from '../context/ExclusiveAccessContext';
import {
  Globe,
  AlignLeft,
  Wifi,
  Mail,
  Phone,
  MessageSquare,
  MessageCircle,
  Contact,
  CreditCard,
  Calendar,
  MapPin,
  Lock,
  Crown,
} from 'lucide-react';
import { ExclusiveCrownBadge } from './ExclusiveCrownBadge';

interface TypeSelectorProps {
  selectedType: QrType;
  onSelectType: (type: QrType) => void;
}

interface TypeItem {
  id: QrType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  hint: string;
  pastelBg: string;
  iconColor: string;
}

const QR_TYPES: TypeItem[] = [
  { id: 'url', label: 'URL', icon: Globe, hint: 'Website link', pastelBg: 'bg-[#FFF7D9] dark:bg-amber-950/40', iconColor: 'text-[#D97706] dark:text-amber-400' },
  { id: 'text', label: 'Plain Text', icon: AlignLeft, hint: 'Note or message', pastelBg: 'bg-[#F1F5F9] dark:bg-slate-900/60', iconColor: 'text-[#475569] dark:text-slate-300' },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi, hint: 'Auto connect', pastelBg: 'bg-[#ECFDF5] dark:bg-emerald-950/40', iconColor: 'text-[#059669] dark:text-emerald-400' },
  { id: 'email', label: 'Email', icon: Mail, hint: 'Mail draft', pastelBg: 'bg-[#EEF2FF] dark:bg-indigo-950/40', iconColor: 'text-[#6366F1] dark:text-indigo-400' },
  { id: 'phone', label: 'Phone', icon: Phone, hint: 'Direct dial', pastelBg: 'bg-[#F0F9FF] dark:bg-sky-950/40', iconColor: 'text-[#0284C7] dark:text-sky-400' },
  { id: 'sms', label: 'SMS', icon: MessageSquare, hint: 'Text message', pastelBg: 'bg-[#FFF1F2] dark:bg-rose-950/40', iconColor: 'text-[#E11D48] dark:text-rose-400' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, hint: 'Instant chat', pastelBg: 'bg-[#F0FDF4] dark:bg-emerald-950/40', iconColor: 'text-[#16A34A] dark:text-emerald-400' },
  { id: 'vcard', label: 'vCard', icon: Contact, hint: 'Digital contact', pastelBg: 'bg-[#F5F3FF] dark:bg-purple-950/40', iconColor: 'text-[#7C3AED] dark:text-purple-400' },
  { id: 'upi', label: 'UPI Pay', icon: CreditCard, hint: 'Payment request', pastelBg: 'bg-[#F0F9FF] dark:bg-cyan-950/40', iconColor: 'text-[#0284C7] dark:text-cyan-400' },
  { id: 'calendar', label: 'Calendar', icon: Calendar, hint: 'Event invite', pastelBg: 'bg-[#FFF7ED] dark:bg-orange-950/40', iconColor: 'text-[#EA580C] dark:text-orange-400' },
  { id: 'location', label: 'Location', icon: MapPin, hint: 'Maps pin', pastelBg: 'bg-[#FEF2F2] dark:bg-rose-950/40', iconColor: 'text-[#E11D48] dark:text-rose-400' },
];

export const TypeSelector: React.FC<TypeSelectorProps> = ({
  selectedType,
  onSelectType,
}) => {
  const { isUnlocked, openExclusiveModal } = useExclusiveAccess();

  const handleTypeClick = (typeId: QrType) => {
    if ((typeId === 'location' || typeId === 'vcard' || typeId === 'calendar') && !isUnlocked) {
      const typeLabels: Record<string, string> = {
        location: 'Location QR Category',
        vcard: 'vCard QR Category',
        calendar: 'Calendar QR Category',
      };
      openExclusiveModal(typeLabels[typeId] || 'Exclusive Category');
      return;
    }
    onSelectType(typeId);
  };

  return (
    <div id="qr-type-selector-section" className="w-full scroll-mt-20">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-0.5 rounded-full bg-[#FACC15]" aria-hidden="true" />
          <label className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-zinc-200">
            Select QR Code Type
          </label>
        </div>
        <span className="text-[11px] font-medium text-[#64748B] dark:text-zinc-400">
          <span className="sm:hidden">Swipe for more →</span>
          <span className="hidden sm:inline">11 formats supported</span>
        </span>
      </div>

      <div className="flex sm:grid sm:grid-cols-4 md:grid-cols-6 gap-2.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none snap-x -mx-1 px-1">
        {QR_TYPES.map((t) => {
          const Icon = t.icon;
          const isSelected = selectedType === t.id;
          const isTypeLocked = (t.id === 'location' || t.id === 'vcard' || t.id === 'calendar') && !isUnlocked;

          return (
            <button
              key={t.id}
              id={`type-select-${t.id}`}
              type="button"
              onClick={() => handleTypeClick(t.id)}
              className={`group relative flex-none sm:flex-initial w-[115px] sm:w-auto snap-start flex flex-col items-start p-2.5 sm:p-3 rounded-2xl border text-left transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FACC15]/50 cursor-pointer ${
                isSelected
                  ? 'border-[#FACC15] bg-[#FEF9C3] dark:bg-amber-950/40 text-black dark:text-zinc-100 shadow-xs ring-1 ring-[#FACC15]'
                  : 'border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-900/70 text-[#0F172A] dark:text-zinc-200 hover:border-[#DDD7CC] dark:hover:border-zinc-700 hover:bg-[#FDFCF9] dark:hover:bg-zinc-800/50 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className={`p-1.5 rounded-xl transition-colors ${
                    isSelected
                      ? 'bg-[#FEF08A] text-black shadow-xs border border-[#FACC15]'
                      : `${t.pastelBg} ${t.iconColor} group-hover:scale-105 transition-transform`
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-black stroke-[2.4]' : ''}`} />
                </div>
                {isSelected ? (
                  <span className="w-2 h-2 rounded-full bg-black ring-2 ring-[#FEF08A] shrink-0" />
                ) : isTypeLocked ? (
                  <ExclusiveCrownBadge size="xs" text="" showPrice={true} />
                ) : null}
              </div>
              <div className="flex items-center gap-1 w-full">
                <span className={`text-xs font-bold leading-tight line-clamp-1 ${isSelected ? 'text-black dark:text-zinc-100' : 'text-[#0F172A] dark:text-zinc-100'}`}>
                  {t.label}
                </span>
                {isTypeLocked && (
                  <span className="text-[9px] font-semibold text-amber-600 dark:text-amber-400">
                    *
                  </span>
                )}
              </div>
              <span className={`text-[10px] leading-tight mt-0.5 line-clamp-1 font-medium ${isSelected ? 'text-zinc-800 dark:text-zinc-300' : 'text-[#64748B] dark:text-zinc-400'}`}>
                {isTypeLocked ? 'Exclusive' : t.hint}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

