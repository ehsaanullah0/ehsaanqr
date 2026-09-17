import React from 'react';
import { QrFormData, QrType } from '../types';
import { ValidationResult } from '../utils/qrPayloads';
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
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  MapPin,
  Navigation,
} from 'lucide-react';

interface ContentFormProps {
  type: QrType;
  formData: QrFormData;
  onChange: <K extends keyof QrFormData>(key: K, value: QrFormData[K]) => void;
  validation: ValidationResult;
}

export const ContentForm: React.FC<ContentFormProps> = ({
  type,
  formData,
  onChange,
  validation,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl p-3.5 sm:p-5 border border-[#EDE8DF] dark:border-zinc-800 shadow-2xs transition-colors">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F0ECE1] dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E7AC08]" />
          <h2 className="text-sm font-bold text-[#0F172A] dark:text-zinc-100">
            {type === 'url' && 'Website Link'}
            {type === 'text' && 'Plain Text Content'}
            {type === 'wifi' && 'Wi-Fi Network Configuration'}
            {type === 'email' && 'Email Message'}
            {type === 'phone' && 'Phone Direct Call'}
            {type === 'sms' && 'SMS Text Message'}
            {type === 'whatsapp' && 'WhatsApp Direct Message'}
            {type === 'vcard' && 'Digital Business Card (vCard)'}
            {type === 'upi' && 'UPI Instant Payment'}
            {type === 'calendar' && 'Calendar Event Invite'}
            {type === 'location' && 'Map Location'}
          </h2>
        </div>

        {!validation.isValid && validation.message && (
          <div className="flex items-center gap-1.5 text-xs text-[#D97706] dark:text-amber-400 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{validation.message}</span>
          </div>
        )}
      </div>

      {/* URL */}
      {type === 'url' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
              Website URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B] dark:text-zinc-500">
                <Globe className="w-4 h-4" />
              </div>
              <input
                id="input-url"
                type="url"
                value={formData.url.url}
                onChange={(e) => onChange('url', { url: e.target.value })}
                placeholder="https://example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-[#64748B] dark:text-zinc-400">
              Enter any link (HTTP/HTTPS will be automatically attached if omitted).
            </p>
          </div>
        </div>
      )}

      {/* PLAIN TEXT */}
      {type === 'text' && (
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[#0F172A] dark:text-zinc-300">
                Text or Note
              </label>
              <span className="text-[11px] text-[#64748B] dark:text-zinc-400 font-medium">
                {formData.text.text.length} characters
              </span>
            </div>
            <textarea
              id="input-text"
              rows={4}
              value={formData.text.text}
              onChange={(e) => onChange('text', { text: e.target.value })}
              placeholder="Enter your message, alphanumeric code, or instructions..."
              className="w-full p-3 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
            />
          </div>
        </div>
      )}

      {/* WI-FI */}
      {type === 'wifi' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
                Network Name (SSID) *
              </label>
              <input
                id="input-wifi-ssid"
                type="text"
                value={formData.wifi.ssid}
                onChange={(e) =>
                  onChange('wifi', { ...formData.wifi, ssid: e.target.value })
                }
                placeholder="MyOffice_WiFi"
                className="w-full px-3 py-2.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
                Security Encryption
              </label>
              <select
                id="select-wifi-enc"
                value={formData.wifi.encryption}
                onChange={(e) =>
                  onChange('wifi', {
                    ...formData.wifi,
                    encryption: e.target.value as 'WPA' | 'WEP' | 'nopass',
                  })
                }
                className="w-full px-3 py-2.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
              >
                <option value="WPA">WPA / WPA2 / WPA3 (Standard)</option>
                <option value="WEP">WEP (Legacy)</option>
                <option value="nopass">None (Open Network)</option>
              </select>
            </div>
          </div>

          {formData.wifi.encryption !== 'nopass' && (
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  id="input-wifi-pass"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.wifi.password}
                  onChange={(e) =>
                    onChange('wifi', { ...formData.wifi, password: e.target.value })
                  }
                  placeholder="Network password"
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#64748B] hover:text-[#0F172A] dark:hover:text-zinc-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <input
              id="checkbox-wifi-hidden"
              type="checkbox"
              checked={formData.wifi.hidden}
              onChange={(e) =>
                onChange('wifi', { ...formData.wifi, hidden: e.target.checked })
              }
              className="w-4 h-4 rounded-sm text-[#E7AC08] border-[#EDE8DF] focus:ring-[#E7AC08]"
            />
            <label
              htmlFor="checkbox-wifi-hidden"
              className="text-xs text-[#64748B] dark:text-zinc-400 select-none cursor-pointer"
            >
              Hidden Network (SSID broadcast disabled)
            </label>
          </div>
        </div>
      )}

      {/* EMAIL */}
      {type === 'email' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
              Recipient Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="input-email-addr"
                type="email"
                value={formData.email.email}
                onChange={(e) =>
                  onChange('email', { ...formData.email, email: e.target.value })
                }
                placeholder="hello@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
              Subject Line (Optional)
            </label>
            <input
              id="input-email-subject"
              type="text"
              value={formData.email.subject}
              onChange={(e) =>
                onChange('email', { ...formData.email, subject: e.target.value })
              }
              placeholder="Inquiry about your services"
              className="w-full px-3 py-2.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
              Pre-filled Message Body (Optional)
            </label>
            <textarea
              id="input-email-body"
              rows={3}
              value={formData.email.body}
              onChange={(e) =>
                onChange('email', { ...formData.email, body: e.target.value })
              }
              placeholder="Type template message..."
              className="w-full p-3 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
            />
          </div>
        </div>
      )}

      {/* PHONE */}
      {type === 'phone' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
              Phone Number with Country Code *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="input-phone"
                type="tel"
                value={formData.phone.phone}
                onChange={(e) => onChange('phone', { phone: e.target.value })}
                placeholder="+1 555 123 4567"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-[#64748B] dark:text-zinc-400">
              Scanning directly opens the native phone dialer.
            </p>
          </div>
        </div>
      )}

      {/* SMS */}
      {type === 'sms' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
              Recipient Phone Number *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="input-sms-phone"
                type="tel"
                value={formData.sms.phone}
                onChange={(e) =>
                  onChange('sms', { ...formData.sms, phone: e.target.value })
                }
                placeholder="+1 555 123 4567"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
              Pre-filled Message
            </label>
            <textarea
              id="input-sms-msg"
              rows={3}
              value={formData.sms.message}
              onChange={(e) =>
                onChange('sms', { ...formData.sms, message: e.target.value })
              }
              placeholder="Enter message text..."
              className="w-full p-3 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
            />
          </div>
        </div>
      )}

      {/* WHATSAPP */}
      {type === 'whatsapp' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
              WhatsApp Phone Number (with Country Code, no +) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <input
                id="input-whatsapp-phone"
                type="tel"
                value={formData.whatsapp.phone}
                onChange={(e) =>
                  onChange('whatsapp', { ...formData.whatsapp, phone: e.target.value })
                }
                placeholder="15551234567"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
              />
            </div>
            <p className="mt-1 text-[11px] text-[#64748B] dark:text-zinc-400">
              Example: 15551234567 for US (+1), 919876543210 for India (+91), 447123456789 for UK (+44).
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
              Prefilled Chat Message (Optional)
            </label>
            <textarea
              id="input-whatsapp-msg"
              rows={3}
              value={formData.whatsapp.message}
              onChange={(e) =>
                onChange('whatsapp', { ...formData.whatsapp, message: e.target.value })
              }
              placeholder="Optional pre-filled chat message..."
              className="w-full p-3 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
            />
          </div>
        </div>
      )}

      {/* VCARD */}
      {type === 'vcard' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
                First Name
              </label>
              <input
                id="input-vcard-first"
                type="text"
                value={formData.vcard.firstName}
                onChange={(e) =>
                  onChange('vcard', { ...formData.vcard, firstName: e.target.value })
                }
                placeholder="First name"
                className="w-full px-3 py-2 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
                Last Name
              </label>
              <input
                id="input-vcard-last"
                type="text"
                value={formData.vcard.lastName}
                onChange={(e) =>
                  onChange('vcard', { ...formData.vcard, lastName: e.target.value })
                }
                placeholder="Last name"
                className="w-full px-3 py-2 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
                Company / Organization
              </label>
              <input
                id="input-vcard-org"
                type="text"
                value={formData.vcard.organization}
                onChange={(e) =>
                  onChange('vcard', { ...formData.vcard, organization: e.target.value })
                }
                placeholder="Company or organization"
                className="w-full px-3 py-2 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
                Job Title
              </label>
              <input
                id="input-vcard-title"
                type="text"
                value={formData.vcard.title}
                onChange={(e) =>
                  onChange('vcard', { ...formData.vcard, title: e.target.value })
                }
                placeholder="Job title"
                className="w-full px-3 py-2 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
                Phone Number
              </label>
              <input
                id="input-vcard-phone"
                type="tel"
                value={formData.vcard.phone}
                onChange={(e) =>
                  onChange('vcard', { ...formData.vcard, phone: e.target.value })
                }
                placeholder="+1 555 123 4567"
                className="w-full px-3 py-2 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
                Email
              </label>
              <input
                id="input-vcard-email"
                type="email"
                value={formData.vcard.email}
                onChange={(e) =>
                  onChange('vcard', { ...formData.vcard, email: e.target.value })
                }
                placeholder="email@example.com"
                className="w-full px-3 py-2 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
              Website
            </label>
            <input
              id="input-vcard-url"
              type="url"
              value={formData.vcard.url}
              onChange={(e) =>
                onChange('vcard', { ...formData.vcard, url: e.target.value })
              }
              placeholder="https://example.com"
              className="w-full px-3 py-2 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
                Street Address
              </label>
              <input
                id="input-vcard-street"
                type="text"
                value={formData.vcard.street}
                onChange={(e) =>
                  onChange('vcard', { ...formData.vcard, street: e.target.value })
                }
                placeholder="Street address"
                className="w-full px-3 py-2 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-xs focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
                City
              </label>
              <input
                id="input-vcard-city"
                type="text"
                value={formData.vcard.city}
                onChange={(e) =>
                  onChange('vcard', { ...formData.vcard, city: e.target.value })
                }
                placeholder="City"
                className="w-full px-3 py-2 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-xs focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
                Country
              </label>
              <input
                id="input-vcard-country"
                type="text"
                value={formData.vcard.country}
                onChange={(e) =>
                  onChange('vcard', { ...formData.vcard, country: e.target.value })
                }
                placeholder="Country"
                className="w-full px-3 py-2 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-xs focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* UPI PAYMENT */}
      {type === 'upi' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
                UPI ID (Virtual Payment Address) *
              </label>
              <div className="relative">
                <input
                  id="input-upi-pa"
                  type="text"
                  value={formData.upi.pa}
                  onChange={(e) =>
                    onChange('upi', { ...formData.upi, pa: e.target.value })
                  }
                  placeholder="username@bank (e.g. name@okhdfcbank)"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
                />
              </div>
              <p className="mt-1 text-[11px] text-[#64748B] dark:text-zinc-400">
                Compatible with GPay, PhonePe, Paytm, BHIM & bank apps.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
                Payee Name
              </label>
              <input
                id="input-upi-pn"
                type="text"
                value={formData.upi.pn}
                onChange={(e) =>
                  onChange('upi', { ...formData.upi, pn: e.target.value })
                }
                placeholder="Payee or Business Name"
                className="w-full px-3 py-2.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
                Amount (INR ₹) (Optional)
              </label>
              <input
                id="input-upi-am"
                type="number"
                step="0.01"
                value={formData.upi.am}
                onChange={(e) =>
                  onChange('upi', { ...formData.upi, am: e.target.value })
                }
                placeholder="Leave blank for any amount"
                className="w-full px-3 py-2.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
                Transaction Note
              </label>
              <input
                id="input-upi-tn"
                type="text"
                value={formData.upi.tn}
                onChange={(e) =>
                  onChange('upi', { ...formData.upi, tn: e.target.value })
                }
                placeholder="Payment reference or note"
                className="w-full px-3 py-2.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* CALENDAR */}
      {type === 'calendar' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
              Event Title *
            </label>
            <input
              id="input-cal-title"
              type="text"
              value={formData.calendar.title}
              onChange={(e) =>
                onChange('calendar', { ...formData.calendar, title: e.target.value })
              }
              placeholder="Event title"
              className="w-full px-3 py-2.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
              Location
            </label>
            <input
              id="input-cal-loc"
              type="text"
              value={formData.calendar.location}
              onChange={(e) =>
                onChange('calendar', {
                  ...formData.calendar,
                  location: e.target.value,
                })
              }
              placeholder="Location or meeting link"
              className="w-full px-3 py-2.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
                Start Date & Time
              </label>
              <input
                id="input-cal-start"
                type="datetime-local"
                value={formData.calendar.startDateTime}
                onChange={(e) =>
                  onChange('calendar', {
                    ...formData.calendar,
                    startDateTime: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
                End Date & Time
              </label>
              <input
                id="input-cal-end"
                type="datetime-local"
                value={formData.calendar.endDateTime}
                onChange={(e) =>
                  onChange('calendar', {
                    ...formData.calendar,
                    endDateTime: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="input-cal-desc"
              rows={2}
              value={formData.calendar.description}
              onChange={(e) =>
                onChange('calendar', {
                  ...formData.calendar,
                  description: e.target.value,
                })
              }
              placeholder="Meeting agenda and details..."
              className="w-full p-2.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-xs focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
            />
          </div>
        </div>
      )}

      {/* LOCATION */}
      {type === 'location' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
                Latitude <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B] dark:text-zinc-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  id="input-loc-lat"
                  type="text"
                  value={formData.location.latitude}
                  onChange={(e) =>
                    onChange('location', {
                      ...formData.location,
                      latitude: e.target.value,
                    })
                  }
                  placeholder="e.g. 26.8467"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
                Longitude <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B] dark:text-zinc-500">
                  <Navigation className="w-4 h-4" />
                </div>
                <input
                  id="input-loc-lng"
                  type="text"
                  value={formData.location.longitude}
                  onChange={(e) =>
                    onChange('location', {
                      ...formData.location,
                      longitude: e.target.value,
                    })
                  }
                  placeholder="e.g. 80.9462"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
              Location Name <span className="text-xs font-normal text-[#64748B] dark:text-zinc-500">(Optional)</span>
            </label>
            <input
              id="input-loc-name"
              type="text"
              value={formData.location.name}
              onChange={(e) =>
                onChange('location', {
                  ...formData.location,
                  name: e.target.value,
                })
              }
              placeholder="e.g. Central Park, My Office, Store #42"
              className="w-full px-3 py-2.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800/60 text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] shadow-2xs"
            />
          </div>

          <p className="text-[11px] text-[#64748B] dark:text-zinc-400">
            Encodes direct Google Maps coordinates. Scanners will immediately open the pin in Google Maps or the device's default navigation app.
          </p>
        </div>
      )}
    </div>
  );
};
