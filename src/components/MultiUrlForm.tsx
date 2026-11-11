import React, { useState } from 'react';
import { MultiUrlData, MultiUrlItem } from '../types';
import {
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Copy,
  ExternalLink,
  FileText,
  Code,
  Eye,
  X,
  Check,
  Globe,
  Sparkles,
  Layers,
  Star,
  Tag,
  AtSign,
  User,
  SplitSquareVertical,
  HelpCircle,
  Upload,
  Smile,
  BookmarkPlus,
} from 'lucide-react';
import {
  downloadMultiUrlAsTxt,
  downloadMultiUrlAsHtml,
  generateMultiUrlHtml,
  POPULAR_LINK_SYMBOLS,
  getAutoIconForUrl,
} from '../utils/multiUrlExporter';

interface MultiUrlFormProps {
  data: MultiUrlData;
  onChange: (data: MultiUrlData) => void;
  qrCodeDataUrl?: string;
  onSaveTemplate?: (data: MultiUrlData) => void;
  onOpenTemplates?: () => void;
}

export const MultiUrlForm: React.FC<MultiUrlFormProps> = ({
  data,
  onChange,
  qrCodeDataUrl,
  onSaveTemplate,
  onOpenTemplates,
}) => {
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<'preview' | 'code'>('preview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showAdvancedHeader, setShowAdvancedHeader] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const links = data.links || [];
  const heroHeading = data.heroHeading !== undefined ? data.heroHeading : (data.title || '');

  const handleUpdateField = <K extends keyof MultiUrlData>(key: K, val: MultiUrlData[K]) => {
    onChange({
      ...data,
      [key]: val,
    });
  };

  const handleAddLink = () => {
    const newId = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const newLink: MultiUrlItem = {
      id: newId,
      title: '',
      url: '',
      description: '',
      icon: '✦',
      isFeatured: false,
      sectionHeader: undefined,
    };
    onChange({
      ...data,
      links: [...links, newLink],
    });
    showToast('New link card added');
  };

  const handleUpdateLink = (id: string, updates: Partial<MultiUrlItem>) => {
    onChange({
      ...data,
      links: links.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    });
  };

  const handleDeleteLink = (id: string) => {
    onChange({
      ...data,
      links: links.filter((l) => l.id !== id),
    });
    showToast('Link removed');
  };

  const handleMoveLink = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const updated = [...links];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    onChange({
      ...data,
      links: updated,
    });
  };

  const handleDuplicateLink = (link: MultiUrlItem) => {
    const newId = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const duplicated: MultiUrlItem = {
      ...link,
      id: newId,
      title: link.title ? `${link.title} (Copy)` : '',
    };
    onChange({
      ...data,
      links: [...links, duplicated],
    });
    showToast('Link duplicated');
  };

  const handleExportTxt = () => {
    downloadMultiUrlAsTxt(data);
    showToast('Downloaded formatted plain text (.txt)');
  };

  const handleExportHtml = () => {
    downloadMultiUrlAsHtml(data, qrCodeDataUrl);
    showToast('Downloaded responsive HTML landing page (.html)');
  };

  const currentHtmlCode = generateMultiUrlHtml(data, qrCodeDataUrl);

  const handleCopyHtmlCode = async () => {
    try {
      await navigator.clipboard.writeText(currentHtmlCode);
      setCopiedHtml(true);
      showToast('HTML code copied to clipboard!');
      setTimeout(() => setCopiedHtml(false), 2000);
    } catch {
      showToast('Could not copy code');
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#171717] text-white text-xs font-bold shadow-2xl border border-zinc-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-3.5 h-3.5 text-[#E7AC08]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header & Profile Section */}
      <div className="p-4 sm:p-5 rounded-2xl border border-[#EDE8DF] dark:border-zinc-800 bg-[#FAF8F5] dark:bg-zinc-800/40 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between border-b border-[#EDE8DF] dark:border-zinc-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#171717] text-[#E7AC08] flex items-center justify-center text-xs font-black">
              ✦
            </div>
            <div>
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#0F172A] dark:text-zinc-200">
                Hero Heading & Hub Profile
              </label>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAdvancedHeader(!showAdvancedHeader)}
            className="text-[11px] font-bold text-[#E7AC08] hover:underline cursor-pointer"
          >
            {showAdvancedHeader ? 'Compact View' : 'Edit Profile & Tags'}
          </button>
        </div>

        {/* Hero Heading Primary Field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-[#0F172A] dark:text-zinc-200">
              Hero Heading (H1)
            </label>
            <span className="text-[10px] font-medium text-[#64748B] dark:text-zinc-400">
              Big display title on landing page & QR
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#E7AC08]">
              <Sparkles className="w-4 h-4" />
            </div>
            <input
              id="input-multiurl-hero-heading"
              type="text"
              value={heroHeading}
              onChange={(e) => {
                const val = e.target.value;
                onChange({
                  ...data,
                  heroHeading: val,
                  title: val,
                });
              }}
              placeholder="e.g. John Doe, Creative Studio, My Link Hub"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border-2 border-[#EDE8DF] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#0F172A] dark:text-zinc-100 font-extrabold text-sm sm:text-base placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/40 focus:border-[#E7AC08] tracking-tight"
            />
          </div>
        </div>

        {showAdvancedHeader && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1 flex items-center gap-1">
                <AtSign className="w-3 h-3 text-[#64748B]" />
                <span>Handle / Username</span>
              </label>
              <input
                id="input-multiurl-handle"
                type="text"
                value={data.handle || ''}
                onChange={(e) => handleUpdateField('handle', e.target.value)}
                placeholder="@username"
                className="w-full px-3 py-2 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08]"
              />
            </div>

            {/* Avatar Section: Two Closely Spaced Buttons (Emoji & Upload Logo) */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 flex items-center gap-1">
                  <User className="w-3 h-3 text-[#64748B]" />
                  <span>Avatar Icon & Logo</span>
                </label>
                {data.avatarImage && (
                  <button
                    type="button"
                    onClick={() => handleUpdateField('avatarImage', undefined)}
                    className="text-[10px] text-rose-500 hover:underline font-bold cursor-pointer"
                  >
                    Remove Logo
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {/* Button 1: Add Emoji / Custom Symbol */}
                <div className="relative flex-1 flex items-center gap-1">
                  <input
                    id="input-multiurl-avatar"
                    type="text"
                    maxLength={4}
                    value={data.avatarLetter || ''}
                    onChange={(e) => handleUpdateField('avatarLetter', e.target.value)}
                    placeholder="✦"
                    className="w-12 px-2 py-1.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-bold text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] text-center shrink-0"
                    title="Avatar letter or emoji symbol"
                  />
                  <div className="relative flex-1">
                    <button
                      type="button"
                      id="btn-add-emoji-multiurl"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-[#FAF8F5] dark:hover:bg-zinc-700 text-xs font-bold text-[#0F172A] dark:text-zinc-100 flex items-center justify-center gap-1 cursor-pointer transition-all shadow-2xs"
                      title="Add preset emoji"
                    >
                      <Smile className="w-3.5 h-3.5 text-[#E7AC08]" />
                      <span>Add Emoji</span>
                    </button>

                    {showEmojiPicker && (
                      <div className="absolute top-full left-0 mt-1 z-30 p-2 rounded-xl bg-white dark:bg-zinc-800 border border-[#EDE8DF] dark:border-zinc-700 shadow-xl grid grid-cols-5 gap-1 w-44 animate-in fade-in">
                        {['✦', '⭐', '🚀', '👑', '🎨', '⚡', '💎', '🔥', '💼', '🌐'].map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => {
                              handleUpdateField('avatarLetter', emoji);
                              setShowEmojiPicker(false);
                            }}
                            className="w-7 h-7 rounded-lg hover:bg-amber-100 dark:hover:bg-zinc-700 text-sm flex items-center justify-center cursor-pointer transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Button 2: Upload Logo */}
                <label
                  id="btn-upload-logo-multiurl"
                  className="px-3 py-1.5 rounded-xl border border-[#2563EB]/40 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1 cursor-pointer shrink-0 transition-all shadow-2xs"
                  title="Upload image logo for avatar"
                >
                  <Upload className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
                  <span>Upload Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          if (evt.target?.result) {
                            handleUpdateField('avatarImage', evt.target.result as string);
                            showToast('Avatar logo uploaded ✓');
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Uploaded Logo Thumbnail Badge */}
              {data.avatarImage && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <img
                    src={data.avatarImage}
                    alt="Uploaded Logo"
                    className="w-5 h-5 rounded object-cover border border-blue-400"
                  />
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-300">
                    Custom Logo Uploaded ✓
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-[#64748B]" />
                <span>Pill Tags (Comma separated)</span>
              </label>
              <input
                id="input-multiurl-tags"
                type="text"
                value={data.tags || ''}
                onChange={(e) => handleUpdateField('tags', e.target.value)}
                placeholder="DESIGN, TECH, PORTFOLIO"
                className="w-full px-3 py-2 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08]"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-1">
                Bio / Intro Description
              </label>
              <textarea
                id="input-multiurl-bio"
                rows={2}
                value={data.description || ''}
                onChange={(e) => handleUpdateField('description', e.target.value)}
                placeholder="Brief intro, tagline, or welcome message..."
                className="w-full px-3 py-2 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-[#0F172A] dark:text-zinc-100 placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/30 focus:border-[#E7AC08] leading-relaxed"
              />
            </div>
          </div>
        )}
      </div>

      {/* Add Link Button Row */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          id="btn-add-link"
          onClick={handleAddLink}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#E7AC08] text-black hover:bg-[#D9A007] transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Link Card</span>
        </button>
        <span className="text-[11px] font-semibold text-[#64748B] dark:text-zinc-400">
          {links.length} {links.length === 1 ? 'link' : 'links'} configured
        </span>
      </div>

      {/* Links List */}
      <div className="space-y-3">
        {links.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-2xl border border-dashed border-[#DDD7CC] dark:border-zinc-800 bg-[#FDFCF9] dark:bg-zinc-900/40">
            <Layers className="w-8 h-8 mx-auto text-[#E7AC08] mb-2 opacity-80" />
            <p className="text-xs font-bold text-[#0F172A] dark:text-zinc-200 mb-1">
              No Links Added Yet
            </p>
            <p className="text-[11px] text-[#64748B] dark:text-zinc-400 max-w-xs mx-auto mb-3">
              Add your website, GitHub, tools, or projects to bundle them into your Link Hub.
            </p>
            <button
              type="button"
              id="btn-add-first-link"
              onClick={() => handleAddLink()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#E7AC08] text-black hover:bg-[#D9A007] transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Link</span>
            </button>
          </div>
        ) : (
          links.map((link, index) => {
            let cleanUrl = link.url.trim();
            if (cleanUrl && !cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
              cleanUrl = 'https://' + cleanUrl;
            }

            const currentIcon = link.icon || getAutoIconForUrl(cleanUrl);

            return (
              <div
                key={link.id}
                id={`multi-url-item-${index}`}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all shadow-2xs space-y-3 ${
                  link.isFeatured
                    ? 'border-[#171717] bg-[#FAF8F2] dark:bg-zinc-900/90 dark:border-amber-500/40 ring-1 ring-[#171717]/10'
                    : 'border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-800/70 hover:border-[#DDD7CC]'
                }`}
              >
                {/* Header row with index, icon badge, featured toggle, actions */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-[#171717] text-[#E7AC08] text-xs font-black flex items-center justify-center shrink-0">
                      {currentIcon}
                    </span>
                    <span className="text-xs font-bold text-[#0F172A] dark:text-zinc-200 truncate">
                      {link.title || `Link #${index + 1}`}
                    </span>
                    {link.isFeatured && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#171717] text-[#E7AC08] text-[10px] font-black tracking-wider uppercase">
                        <Star className="w-2.5 h-2.5 fill-[#E7AC08]" />
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Featured Toggle */}
                    <button
                      type="button"
                      onClick={() => handleUpdateLink(link.id, { isFeatured: !link.isFeatured })}
                      title={link.isFeatured ? 'Remove featured highlight' : 'Mark as Featured Card'}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        link.isFeatured
                          ? 'bg-[#171717] text-[#E7AC08] shadow-xs'
                          : 'bg-zinc-100 dark:bg-zinc-700 text-[#64748B] hover:text-[#0F172A]'
                      }`}
                    >
                      <Star className={`w-3 h-3 ${link.isFeatured ? 'fill-[#E7AC08]' : ''}`} />
                      <span className="hidden sm:inline">{link.isFeatured ? 'Featured' : 'Feature'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveLink(index, 'up')}
                      title="Move up"
                      className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === links.length - 1}
                      onClick={() => handleMoveLink(index, 'down')}
                      title="Move down"
                      className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicateLink(link)}
                      title="Duplicate link"
                      className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLink(link.id)}
                      title="Delete link"
                      className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Primary Input Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  {/* Icon Selector / Input */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-[#64748B] dark:text-zinc-400 mb-1">
                      Icon / Symbol
                    </label>
                    <input
                      type="text"
                      maxLength={3}
                      value={link.icon || ''}
                      onChange={(e) => handleUpdateLink(link.id, { icon: e.target.value })}
                      placeholder={getAutoIconForUrl(link.url)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800 text-xs font-black text-center text-[#0F172A] dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-[#E7AC08] focus:border-[#E7AC08]"
                    />
                  </div>

                  {/* Title */}
                  <div className="sm:col-span-5">
                    <label className="block text-[11px] font-semibold text-[#64748B] dark:text-zinc-400 mb-1">
                      Link Title *
                    </label>
                    <input
                      type="text"
                      value={link.title}
                      onChange={(e) => handleUpdateLink(link.id, { title: e.target.value })}
                      placeholder="e.g. Official Website, Portfolio, Shop"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800 text-xs font-bold text-[#0F172A] dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-[#E7AC08] focus:border-[#E7AC08]"
                    />
                  </div>

                  {/* Target Web URL */}
                  <div className="sm:col-span-5">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-semibold text-[#64748B] dark:text-zinc-400">
                        Target Web URL *
                      </label>
                      {link.url.trim() && (
                        <a
                          href={cleanUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#E7AC08] hover:underline"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#94A3B8]">
                        <Globe className="w-3 h-3" />
                      </div>
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => handleUpdateLink(link.id, { url: e.target.value })}
                        placeholder="https://example.com"
                        className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800 text-xs text-[#0F172A] dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-[#E7AC08] focus:border-[#E7AC08]"
                      />
                    </div>
                  </div>
                </div>

                {/* Subtitle & Optional Section Divider */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] dark:text-zinc-400 mb-1">
                      Subtitle / Note <span className="text-[10px] font-normal text-[#94A3B8]">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={link.description || ''}
                      onChange={(e) => handleUpdateLink(link.id, { description: e.target.value })}
                      placeholder="e.g. View recent work & projects"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800 text-xs text-[#0F172A] dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-[#E7AC08] focus:border-[#E7AC08]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] dark:text-zinc-400 mb-1 flex items-center gap-1">
                      <SplitSquareVertical className="w-3 h-3 text-[#94A3B8]" />
                      <span>Section Header Above <span className="text-[10px] font-normal text-[#94A3B8]">(Optional)</span></span>
                    </label>
                    <input
                      type="text"
                      value={link.sectionHeader || ''}
                      onChange={(e) => handleUpdateLink(link.id, { sectionHeader: e.target.value })}
                      placeholder="e.g. Featured Projects"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#EDE8DF] dark:border-zinc-700 bg-[#FDFCF9] dark:bg-zinc-800 text-xs text-[#0F172A] dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-[#E7AC08] focus:border-[#E7AC08]"
                    />
                  </div>
                </div>

                {/* Quick Icon Palette */}
                <div className="flex items-center gap-1 pt-1 overflow-x-auto pb-1 text-[11px]">
                  <span className="text-[10px] font-semibold text-[#94A3B8] shrink-0 mr-1">Icon presets:</span>
                  {POPULAR_LINK_SYMBOLS.map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => handleUpdateLink(link.id, { icon: sym })}
                      className={`w-5 h-5 rounded flex items-center justify-center shrink-0 cursor-pointer text-xs transition-colors ${
                        link.icon === sym
                          ? 'bg-[#E7AC08] text-black font-black'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-[#0F172A] dark:text-zinc-300 hover:bg-[#FEF08A]'
                      }`}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>
            );
          })
        )}

        {links.length > 0 && (
          <button
            type="button"
            id="btn-add-another-link"
            onClick={() => handleAddLink()}
            className="w-full py-2.5 rounded-xl border border-dashed border-[#DDD7CC] dark:border-zinc-700 hover:border-[#E7AC08] bg-[#FDFCF9] dark:bg-zinc-900/50 hover:bg-[#FFFBEA] dark:hover:bg-amber-950/20 text-xs font-bold text-[#0F172A] dark:text-zinc-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#E7AC08]" />
            <span>Add Another Link</span>
          </button>
        )}
      </div>

      {/* Export & Presentation Action Suite */}
      <div className="pt-3 border-t border-[#F0ECE1] dark:border-zinc-800">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-[#0F172A] dark:text-zinc-200 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#E7AC08]" />
            <span>Export & Actions</span>
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Export as HTML */}
          <button
            type="button"
            id="btn-export-multiurl-html"
            onClick={handleExportHtml}
            disabled={links.length === 0}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#E7AC08] hover:bg-[#d9a007] text-black text-xs font-extrabold disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
          >
            <Code className="w-3.5 h-3.5 text-black shrink-0" />
            <span className="truncate">Export HTML</span>
            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-black text-[#E7AC08] ml-0.5 shrink-0">
              Rec
            </span>
          </button>

          {/* Export as TXT */}
          <button
            type="button"
            id="btn-export-multiurl-txt"
            onClick={handleExportTxt}
            disabled={links.length === 0}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-800 hover:bg-[#FAF8F5] dark:hover:bg-zinc-750 text-xs font-semibold text-[#0F172A] dark:text-zinc-200 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs hover:border-[#E7AC08]"
          >
            <FileText className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
            <span className="truncate">Export TXT</span>
          </button>

          {/* Preview HTML Modal */}
          <button
            type="button"
            id="btn-preview-multiurl-html"
            onClick={() => setPreviewModalOpen(true)}
            disabled={links.length === 0}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-800 hover:bg-[#FAF8F5] dark:hover:bg-zinc-750 text-xs font-semibold text-[#0F172A] dark:text-zinc-200 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs hover:border-[#E7AC08]"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="truncate">Preview HTML</span>
          </button>

          {/* Save HTML as Template */}
          <button
            type="button"
            id="btn-save-multiurl-template"
            onClick={() => onSaveTemplate?.(data)}
            disabled={links.length === 0}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-800 hover:bg-[#FAF8F5] dark:hover:bg-zinc-750 text-xs font-semibold text-[#0F172A] dark:text-zinc-200 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs hover:border-emerald-500"
            title="Save this Multi-URL configuration as an HTML template for instant reuse and portable backup"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate">Save Template</span>
          </button>
        </div>

        <div className="mt-3 p-3 rounded-xl bg-[#FAF8F5] dark:bg-zinc-800/50 border border-[#EDE8DF] dark:border-zinc-800/80 flex items-start justify-between gap-2.5 flex-wrap">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <Sparkles className="w-4 h-4 text-[#E7AC08] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#64748B] dark:text-zinc-400 leading-relaxed">
              <strong>Save HTML as Template:</strong> Store your Multi-URL configuration as a template in Studio. Generate portable 1-click transfer codes or download backup <code className="font-mono bg-zinc-200/60 dark:bg-zinc-700/60 px-1 rounded text-[10px]">.txt</code> files anytime.
            </p>
          </div>
          {onOpenTemplates && (
            <button
              type="button"
              id="btn-open-templates-from-multiurl"
              onClick={onOpenTemplates}
              className="px-2.5 py-1.5 rounded-xl border border-amber-300/80 dark:border-amber-800 bg-amber-100/60 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-900 text-[11px] font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
            >
              <Layers className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>View Templates</span>
            </button>
          )}
        </div>
      </div>

      {/* HTML Preview & Code Modal */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#FAF8F5] dark:bg-zinc-900 rounded-2xl border border-[#EDE8DF] dark:border-zinc-800 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#171717] text-[#E7AC08] flex items-center justify-center text-xs font-black">
                  ✦
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#0F172A] dark:text-zinc-100">
                    EHSAAN Multi Link Landing Page
                  </h3>
                  <p className="text-[11px] text-[#64748B] dark:text-zinc-400">
                    {heroHeading} • Self-contained single file HTML
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Tab Switcher */}
                <div className="flex items-center p-0.5 rounded-lg bg-[#EDE8DF] dark:bg-zinc-800 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setActivePreviewTab('preview')}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                      activePreviewTab === 'preview'
                        ? 'bg-white dark:bg-zinc-700 text-[#0F172A] dark:text-white shadow-xs font-bold'
                        : 'text-[#64748B] dark:text-zinc-400'
                    }`}
                  >
                    Live Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePreviewTab('code')}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                      activePreviewTab === 'code'
                        ? 'bg-white dark:bg-zinc-700 text-[#0F172A] dark:text-white shadow-xs font-bold'
                        : 'text-[#64748B] dark:text-zinc-400'
                    }`}
                  >
                    HTML Source
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(false)}
                  className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-hidden p-3 sm:p-4 bg-[#EAE5D9] dark:bg-zinc-950 flex flex-col min-h-[460px]">
              {activePreviewTab === 'preview' ? (
                <div className="w-full flex-1 rounded-xl border border-[#D5CEBF] dark:border-zinc-800 overflow-hidden bg-[#F5F1E8] shadow-inner">
                  <iframe
                    title="EHSAAN Link Hub Live Preview"
                    srcDoc={currentHtmlCode}
                    className="w-full h-full border-none min-h-[480px]"
                    sandbox="allow-scripts allow-modals"
                  />
                </div>
              ) : (
                <div className="relative flex-1 flex flex-col">
                  <div className="absolute top-3 right-3 z-10">
                    <button
                      type="button"
                      onClick={handleCopyHtmlCode}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#171717] hover:bg-black text-[#E7AC08] text-xs font-bold border border-zinc-700 shadow-md transition-colors cursor-pointer"
                    >
                      {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedHtml ? 'Copied!' : 'Copy HTML'}</span>
                    </button>
                  </div>
                  <pre className="flex-1 p-4 rounded-xl bg-[#171717] text-zinc-200 text-xs font-mono overflow-auto border border-zinc-800 max-h-[480px] leading-relaxed">
                    {currentHtmlCode}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <span className="text-[11px] font-medium text-[#64748B] dark:text-zinc-400">
                Crafted with EHSAAN QR · Ready to host anywhere or open locally
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportHtml}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#171717] border border-[#E7AC08] text-xs font-bold hover:bg-black transition-colors cursor-pointer shadow-xs"
                >
                  <Code className="w-3.5 h-3.5 text-[#E7AC08]" />
                  <span style={{ color: '#E7AC08' }}>Export HTML</span>
                  <span
                    className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase ml-1"
                    style={{ backgroundColor: '#E7AC08', color: '#000000' }}
                  >
                    Recommended
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 text-xs font-bold text-[#0F172A] dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
