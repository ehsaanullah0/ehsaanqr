export type QrType =
  | 'url'
  | 'text'
  | 'wifi'
  | 'email'
  | 'phone'
  | 'sms'
  | 'whatsapp'
  | 'vcard'
  | 'upi'
  | 'calendar';

export type PatternStyle = 'square' | 'rounded' | 'dots' | 'soft-rounded' | 'liquid';

export type QrCornerStyle = 'sharp' | 'smooth';

export type EyeStyle =
  | 'square'
  | 'rounded'
  | 'circle'
  | 'modern'
  | 'leaf'
  | 'outer-smooth'
  | 'cut-corner'
  | 'hexagon'
  | 'star'
  | 'flower';

export type PupilStyle =
  | 'auto'
  | 'square'
  | 'rounded'
  | 'circle'
  | 'diamond'
  | 'leaf'
  | 'droplet'
  | 'star'
  | 'heart'
  | 'ring'
  | 'hexagon';

export type ColorMode = 'solid' | 'linear-gradient' | 'radial-gradient';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type ExportFormat = 'png' | 'jpg' | 'svg' | 'pdf';

export type AppTheme = 'light' | 'dark' | 'material';

export interface UrlData {
  url: string;
}

export interface TextData {
  text: string;
}

export interface WifiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface EmailData {
  email: string;
  subject: string;
  body: string;
}

export interface PhoneData {
  phone: string;
}

export interface SmsData {
  phone: string;
  message: string;
}

export interface WhatsAppData {
  phone: string;
  message: string;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  phone: string;
  email: string;
  url: string;
  street: string;
  city: string;
  country: string;
}

export interface UpiData {
  pa: string; // UPI VPA ID e.g. name@bank
  pn: string; // Payee name
  am: string; // Amount
  tn: string; // Note
}

export interface CalendarData {
  title: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  description: string;
}

export interface QrFormData {
  url: UrlData;
  text: TextData;
  wifi: WifiData;
  email: EmailData;
  phone: PhoneData;
  sms: SmsData;
  whatsapp: WhatsAppData;
  vcard: VCardData;
  upi: UpiData;
  calendar: CalendarData;
}

export interface LogoConfig {
  type: 'none' | 'ehsaan' | 'custom';
  customUrl?: string;
  sizeRatio: number; // e.g. 0.22 (22% of QR width)
  padding: number; // padding in px
  background: 'white' | 'match' | 'custom' | 'transparent';
  customBgColor: string;
  borderRadius: number; // px or %
}

export interface QrStyleOptions {
  // Colors
  colorMode: ColorMode;
  fgColor: string;
  fgColorEnd: string;
  gradientAngle: number; // 0 - 360
  bgColor: string;
  transparentBg: boolean;
  bgSaturationPreference?: 'low' | 'high';

  // Pattern & Corners
  patternStyle: PatternStyle;
  cornerStyle: QrCornerStyle;

  // Eyes
  eyeStyle: EyeStyle;
  pupilStyle?: PupilStyle;
  customEyeColors: boolean;
  eyeOuterColor: string;
  eyeInnerColor: string;

  // Logo
  logo: LogoConfig;

  // Size & Quality
  size: number; // e.g. 512, 1024
  margin: number; // quiet zone modules (e.g. 2, 4)
  errorCorrection: ErrorCorrectionLevel;
}

export interface SavedQrDesign {
  id: string;
  name: string;
  timestamp: number;
  qrType: QrType;
  formData: Partial<QrFormData>;
  style: QrStyleOptions;
  previewThumbnail?: string;
}

export interface ReadabilityReport {
  score: 'excellent' | 'good' | 'warning' | 'danger';
  contrastRatio: number;
  isDarkBg: boolean;
  warnings: string[];
  recommendations: string[];
}

export type CustomizationTabKey = 'colors' | 'patterns' | 'eyes' | 'logo' | 'quality';
