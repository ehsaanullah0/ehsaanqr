import React from 'react';
import { QrType } from '../types';
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
} from 'lucide-react';

interface TypeSelectorProps {
  selectedType: QrType;
  onSelectType: (type: QrType) => void;
}

interface TypeItem {
  id: QrType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  hint: string;
}

const QR_TYPES: TypeItem[] = [
  { id: 'url', label: 'URL', icon: Globe, hint: 'Website link' },
  { id: 'text', label: 'Plain Text', icon: AlignLeft, hint: 'Note or message' },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi, hint: 'Auto connect' },
  { id: 'email', label: 'Email', icon: Mail, hint: 'Mail draft' },
  { id: 'phone', label: 'Phone', icon: Phone, hint: 'Direct dial' },
  { id: 'sms', label: 'SMS', icon: MessageSquare, hint: 'Text message' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, hint: 'Instant chat' },
  { id: 'vcard', label: 'vCard', icon: Contact, hint: 'Digital contact' },
  { id: 'upi', label: 'UPI Pay', icon: CreditCard, hint: 'Payment request' },
  { id: 'calendar', label: 'Calendar', icon: Calendar, hint: 'Event invite' },
];

export const TypeSelector: React.FC<TypeSelectorProps> = ({
  selectedType,
  onSelectType,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Select QR Code Type
        </label>
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
          <span className="sm:hidden">Swipe for more →</span>
          <span className="hidden sm:inline">10 formats supported</span>
        </span>
      </div>

      <div className="flex sm:grid sm:grid-cols-5 gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none snap-x -mx-1 px-1">
        {QR_TYPES.map((t) => {
          const Icon = t.icon;
          const isSelected = selectedType === t.id;

          return (
            <button
              key={t.id}
              id={`type-select-${t.id}`}
              type="button"
              onClick={() => onSelectType(t.id)}
              className={`group relative flex-none sm:flex-initial w-[110px] sm:w-auto snap-start flex flex-col items-start p-2 sm:p-2.5 rounded-xl border text-left transition-all focus:outline-none focus:ring-2 focus:ring-red-500/40 ${
                isSelected
                  ? 'border-red-600 bg-red-50/50 dark:bg-red-950/20 text-red-950 dark:text-red-100 shadow-xs ring-1 ring-red-500'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1 sm:mb-1.5">
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-red-600 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                )}
              </div>
              <span className="text-xs font-semibold leading-tight line-clamp-1">
                {t.label}
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight mt-0.5 line-clamp-1">
                {t.hint}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
