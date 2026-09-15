import { QrFormData, QrType } from '../types';

/**
 * Escapes characters in WiFi string per MECARD/WIFI standard
 */
function escapeWifi(str: string): string {
  return str.replace(/([\\;,:"])/g, '\\$1');
}

/**
 * Formats a Date or datetime-local string to iCalendar UTC/local timestamp (YYYYMMDDTHHmmSS)
 */
function formatIcsDateTime(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const pad = (n: number) => (n < 10 ? '0' + n : n.toString());
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

export const DEFAULT_FORM_DATA: QrFormData = {
  url: {
    url: 'https://ehsaan.odoo.com',
  },
  text: {
    text: '',
  },
  wifi: {
    ssid: '',
    password: '',
    encryption: 'WPA',
    hidden: false,
  },
  email: {
    email: '',
    subject: '',
    body: '',
  },
  phone: {
    phone: '',
  },
  sms: {
    phone: '',
    message: '',
  },
  whatsapp: {
    phone: '',
    message: '',
  },
  vcard: {
    firstName: '',
    lastName: '',
    organization: '',
    title: '',
    phone: '',
    email: '',
    url: '',
    street: '',
    city: '',
    country: '',
  },
  upi: {
    pa: '',
    pn: '',
    am: '',
    tn: '',
  },
  calendar: {
    title: '',
    location: '',
    startDateTime: '',
    endDateTime: '',
    description: '',
  },
};

export function buildPayload(type: QrType, data: QrFormData): string {
  switch (type) {
    case 'url': {
      let raw = data.url.url.trim();
      if (!raw) return '';
      if (!raw.startsWith('http://') && !raw.startsWith('https://') && !raw.startsWith('ftp://')) {
        raw = 'https://' + raw;
      }
      return raw;
    }

    case 'text':
      return data.text.text.trim();

    case 'wifi': {
      const { ssid, password, encryption, hidden } = data.wifi;
      if (!ssid.trim()) return '';
      const enc = encryption === 'nopass' ? 'nopass' : encryption;
      const pass = enc !== 'nopass' && password ? `P:${escapeWifi(password)};` : '';
      const hid = hidden ? 'H:true;' : '';
      return `WIFI:S:${escapeWifi(ssid)};T:${enc};${pass}${hid};`;
    }

    case 'email': {
      const { email, subject, body } = data.email;
      if (!email.trim()) return '';
      const params = new URLSearchParams();
      if (subject.trim()) params.append('subject', subject.trim());
      if (body.trim()) params.append('body', body.trim());
      const query = params.toString();
      return `mailto:${email.trim()}${query ? '?' + query : ''}`;
    }

    case 'phone': {
      const cleanPhone = data.phone.phone.replace(/[^\d+]/g, '');
      return cleanPhone ? `tel:${cleanPhone}` : '';
    }

    case 'sms': {
      const cleanPhone = data.sms.phone.replace(/[^\d+]/g, '');
      if (!cleanPhone) return '';
      return `SMSTO:${cleanPhone}:${data.sms.message}`;
    }

    case 'whatsapp': {
      const cleanPhone = data.whatsapp.phone.replace(/[^\d]/g, '');
      if (!cleanPhone) return '';
      const text = data.whatsapp.message.trim();
      return `https://wa.me/${cleanPhone}${text ? '?text=' + encodeURIComponent(text) : ''}`;
    }

    case 'vcard': {
      const v = data.vcard;
      const fn = `${v.firstName.trim()} ${v.lastName.trim()}`.trim() || 'Contact';
      const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${v.lastName.trim()};${v.firstName.trim()};;;`,
        `FN:${fn}`,
      ];
      if (v.organization.trim()) lines.push(`ORG:${v.organization.trim()}`);
      if (v.title.trim()) lines.push(`TITLE:${v.title.trim()}`);
      if (v.phone.trim()) lines.push(`TEL;TYPE=CELL:${v.phone.trim()}`);
      if (v.email.trim()) lines.push(`EMAIL:${v.email.trim()}`);
      if (v.url.trim()) lines.push(`URL:${v.url.trim()}`);
      if (v.street.trim() || v.city.trim() || v.country.trim()) {
        lines.push(`ADR;TYPE=WORK:;;${v.street.trim()};${v.city.trim()};;;${v.country.trim()}`);
      }
      lines.push('END:VCARD');
      return lines.join('\n');
    }

    case 'upi': {
      const { pa, pn, am, tn } = data.upi;
      if (!pa.trim()) return '';
      const params = new URLSearchParams();
      params.append('pa', pa.trim());
      if (pn.trim()) params.append('pn', pn.trim());
      if (am.trim()) params.append('am', am.trim());
      if (tn.trim()) params.append('tn', tn.trim());
      params.append('cu', 'INR');
      return `upi://pay?${params.toString()}`;
    }

    case 'calendar': {
      const c = data.calendar;
      if (!c.title.trim()) return '';
      const startUtc = formatIcsDateTime(c.startDateTime);
      const endUtc = formatIcsDateTime(c.endDateTime);
      const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Ehsaan QR//EN',
        'BEGIN:VEVENT',
        `SUMMARY:${c.title.trim()}`,
      ];
      if (c.location.trim()) lines.push(`LOCATION:${c.location.trim()}`);
      if (c.description.trim()) lines.push(`DESCRIPTION:${c.description.trim()}`);
      if (startUtc) lines.push(`DTSTART:${startUtc}`);
      if (endUtc) lines.push(`DTEND:${endUtc}`);
      lines.push('END:VEVENT');
      lines.push('END:VCALENDAR');
      return lines.join('\n');
    }

    default:
      return '';
  }
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  field?: string;
}

export function validatePayload(type: QrType, data: QrFormData): ValidationResult {
  switch (type) {
    case 'url': {
      const u = data.url.url.trim();
      if (!u) return { isValid: false, message: 'Please enter a URL' };
      if (!u.includes('.') || u.length < 3) {
        return { isValid: false, message: 'Please enter a valid domain or web address' };
      }
      return { isValid: true };
    }

    case 'text':
      if (!data.text.text.trim()) return { isValid: false, message: 'Please enter some text' };
      return { isValid: true };

    case 'wifi':
      if (!data.wifi.ssid.trim()) return { isValid: false, message: 'Network name (SSID) is required' };
      if (data.wifi.encryption !== 'nopass' && !data.wifi.password) {
        return { isValid: false, message: 'Password is required for encrypted Wi-Fi' };
      }
      return { isValid: true };

    case 'email': {
      const email = data.email.email.trim();
      if (!email) return { isValid: false, message: 'Email address is required' };
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) return { isValid: false, message: 'Please enter a valid email address' };
      return { isValid: true };
    }

    case 'phone': {
      const p = data.phone.phone.replace(/[^\d+]/g, '');
      if (!p || p.length < 4) return { isValid: false, message: 'Please enter a valid phone number' };
      return { isValid: true };
    }

    case 'sms': {
      const p = data.sms.phone.replace(/[^\d+]/g, '');
      if (!p || p.length < 4) return { isValid: false, message: 'Recipient phone number is required' };
      return { isValid: true };
    }

    case 'whatsapp': {
      const p = data.whatsapp.phone.replace(/[^\d]/g, '');
      if (!p || p.length < 5) return { isValid: false, message: 'Valid country code + phone number is required' };
      return { isValid: true };
    }

    case 'vcard':
      if (!data.vcard.firstName.trim() && !data.vcard.lastName.trim() && !data.vcard.organization.trim()) {
        return { isValid: false, message: 'Please provide at least a name or organization' };
      }
      return { isValid: true };

    case 'upi': {
      const pa = data.upi.pa.trim();
      if (!pa) return { isValid: false, message: 'UPI ID is required' };
      if (!pa.includes('@')) return { isValid: false, message: 'UPI ID must contain "@" (e.g., username@bank)' };
      return { isValid: true };
    }

    case 'calendar':
      if (!data.calendar.title.trim()) return { isValid: false, message: 'Event title is required' };
      return { isValid: true };

    default:
      return { isValid: true };
  }
}
