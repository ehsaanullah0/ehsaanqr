import React, { useState, useEffect, useRef } from 'react';
import { SavedQrDesign, QrStyleOptions } from '../types';
import {
  X,
  Trash2,
  Copy,
  Calendar,
  Layers,
  Sparkles,
  Palette,
  FileCode,
  ClipboardPaste,
  Download,
  Upload,
  Check,
  ArrowLeft,
  Info,
  AlertCircle,
  BookmarkPlus,
  Share2,
} from 'lucide-react';
import {
  encodeTemplateToCode,
  encodeBundleToCode,
  parseTemplateCode,
  generateTemplateThumbnail,
  downloadTextFile,
  SAMPLE_TEMPLATE_CODE,
} from '../utils/templateCode';
import { TemplateThumbnail } from './TemplateThumbnail';

interface RecentDesignsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedDesigns: SavedQrDesign[];
  onLoadDesign: (design: SavedQrDesign) => void;
  onDuplicateDesign: (design: SavedQrDesign) => void;
  onDeleteDesign: (id: string) => void;
  onClearAll: () => void;
  onImportDesigns?: (designs: SavedQrDesign[], applyFirst?: boolean) => void;
  onShowToast?: (msg: string) => void;
  currentStyle?: QrStyleOptions;
  onSaveCurrentAsTemplate?: () => void;
}

export const RecentDesignsModal: React.FC<RecentDesignsModalProps> = ({
  isOpen,
  onClose,
  savedDesigns,
  onLoadDesign,
  onDuplicateDesign,
  onDeleteDesign,
  onClearAll,
  onImportDesigns,
  onShowToast,
  currentStyle,
  onSaveCurrentAsTemplate,
}) => {
  const [activeTab, setActiveTab] = useState<'saved' | 'paste'>('saved');
  const [pasteInput, setPasteInput] = useState('');
  const [customName, setCustomName] = useState('');
  const [liveThumbnail, setLiveThumbnail] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sub-modal for viewing/copying full template code
  const [codeViewerData, setCodeViewerData] = useState<{
    title: string;
    subtitle: string;
    code: string;
    filename: string;
  } | null>(null);
  const [isViewerCopied, setIsViewerCopied] = useState(false);

  // Reset tab and input when modal opens
  useEffect(() => {
    if (isOpen) {
      setCopiedCodeId(null);
      setIsViewerCopied(false);
    }
  }, [isOpen]);

  // Real-time parsing of pasted input
  const parseResult = React.useMemo(() => {
    if (!pasteInput.trim()) return null;
    return parseTemplateCode(pasteInput);
  }, [pasteInput]);

  // Sync custom name and generate live thumbnail when valid template is detected
  useEffect(() => {
    if (parseResult && parseResult.success && parseResult.templates.length > 0) {
      const firstTpl = parseResult.templates[0];
      setCustomName(firstTpl.name);

      let isMounted = true;
      generateTemplateThumbnail(firstTpl.style).then((thumb) => {
        if (isMounted && thumb) {
          setLiveThumbnail(thumb);
        }
      });

      return () => {
        isMounted = false;
      };
    } else {
      setLiveThumbnail(null);
      setCustomName('');
    }
  }, [parseResult]);

  if (!isOpen) return null;

  // Handle direct 1-click code copying on a template card
  const handleQuickCopyCode = async (e: React.MouseEvent, design: SavedQrDesign) => {
    e.stopPropagation();
    const code = encodeTemplateToCode(design);
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeId(design.id);
      setTimeout(() => setCopiedCodeId(null), 2500);
      onShowToast?.(`Template code copied! Paste it in any browser under Templates ✓`);
    } catch {
      // Fallback: Open viewer so user can manually select and copy
      handleOpenCodeViewer(design);
    }
  };

  // Open the Code Viewer modal for a single template
  const handleOpenCodeViewer = (design: SavedQrDesign) => {
    const code = encodeTemplateToCode(design);
    const safeFilename = `ehsaan-template-${design.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.txt`;
    setCodeViewerData({
      title: design.name,
      subtitle: 'Share or transfer this template code to any other browser',
      code,
      filename: safeFilename,
    });
    setIsViewerCopied(false);
  };

  // Open the Code Viewer modal for all saved templates bundle
  const handleOpenBundleViewer = () => {
    if (savedDesigns.length === 0) return;
    const code = encodeBundleToCode(savedDesigns);
    setCodeViewerData({
      title: `All Saved Templates Bundle (${savedDesigns.length})`,
      subtitle: 'One single backup code containing all your saved templates',
      code,
      filename: `ehsaan-templates-backup-${new Date().toISOString().slice(0, 10)}.txt`,
    });
    setIsViewerCopied(false);
  };

  // Copy code from Code Viewer
  const handleCopyFromViewer = async () => {
    if (!codeViewerData) return;
    try {
      await navigator.clipboard.writeText(codeViewerData.code);
      setIsViewerCopied(true);
      setTimeout(() => setIsViewerCopied(false), 2500);
      onShowToast?.('Template code copied to clipboard ✓');
    } catch {
      // fallback
      onShowToast?.('Please select and copy the code text manually');
    }
  };

  // Download code as text file
  const handleDownloadCodeFile = () => {
    if (!codeViewerData) return;
    downloadTextFile(codeViewerData.filename, codeViewerData.code);
    onShowToast?.(`Saved ${codeViewerData.filename} to your device ✓`);
  };

  // Handle pasting from clipboard into paste tab
  const handlePasteFromClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setPasteInput(text.trim());
          onShowToast?.('Code pasted from clipboard ✓');
          return;
        }
      }
      onShowToast?.('Clipboard is empty or access was denied. Please paste manually.');
    } catch {
      onShowToast?.('Clipboard permission denied. Please press Ctrl+V / Cmd+V to paste.');
    }
  };

  // Handle file upload of .txt or .json code
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string' && content.trim()) {
        setPasteInput(content.trim());
        onShowToast?.(`Loaded ${file.name} ✓`);
      }
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = '';
  };

  // Action: Apply detected template directly to active QR
  const handleApplyPastedTemplate = () => {
    if (!parseResult || !parseResult.success || parseResult.templates.length === 0) return;
    const tpl = parseResult.templates[0];
    onLoadDesign(tpl);
    onClose();
  };

  // Action: Save detected template to local storage templates list
  const handleSavePastedTemplate = (andApply = false) => {
    if (!parseResult || !parseResult.success || parseResult.templates.length === 0) return;

    if (parseResult.isBundle) {
      // Import bundle
      onImportDesigns?.(parseResult.templates, andApply);
      setPasteInput('');
      setActiveTab('saved');
      if (andApply) onClose();
      return;
    }

    // Single template
    const baseTpl = parseResult.templates[0];
    const finalName = customName.trim() || baseTpl.name;
    const finalTemplate: SavedQrDesign = {
      ...baseTpl,
      name: finalName,
      previewThumbnail: liveThumbnail || undefined,
      timestamp: Date.now(),
    };

    onImportDesigns?.([finalTemplate], andApply);
    setPasteInput('');
    setActiveTab('saved');
    if (andApply) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden max-h-[88vh] flex flex-col my-auto">
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 shrink-0 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 leading-none">
                  QR Design Templates
                </h2>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Save, transfer with codes, or recover styling across browsers
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Close modal"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation: Saved Templates vs. Paste Code */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 w-full sm:w-auto">
              <button
                type="button"
                id="tab-saved-templates"
                onClick={() => setActiveTab('saved')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'saved'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs ring-1 ring-zinc-300/60 dark:ring-zinc-600'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>My Templates</span>
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-zinc-200 dark:bg-zinc-600 text-zinc-800 dark:text-zinc-200">
                  {savedDesigns.length}
                </span>
              </button>

              <button
                type="button"
                id="tab-paste-code"
                onClick={() => setActiveTab('paste')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'paste'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400'
                }`}
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span>Paste / Recover Code</span>
                {activeTab !== 'paste' && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </button>
            </div>

            {/* Quick action: Save Current Style as Template */}
            {activeTab === 'saved' && onSaveCurrentAsTemplate && (
              <button
                type="button"
                id="btn-save-current-from-modal"
                onClick={onSaveCurrentAsTemplate}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50/70 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/60 text-red-700 dark:text-red-300 text-xs font-semibold transition-colors cursor-pointer"
                title="Save your current active QR styling as a template"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>Save Current</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-3.5 sm:p-5">
          {/* TAB 1: SAVED TEMPLATES */}
          {activeTab === 'saved' && (
            <div className="space-y-3">
              {savedDesigns.length === 0 ? (
                <div className="text-center py-10 px-4 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <Palette className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    No Saved Design Templates Yet
                  </h3>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                    Save any QR design you create as a template, or paste a template code from another computer or browser to recover your styles.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    {onSaveCurrentAsTemplate && (
                      <button
                        type="button"
                        onClick={onSaveCurrentAsTemplate}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                      >
                        <BookmarkPlus className="w-3.5 h-3.5" />
                        <span>Save Current QR Style</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setActiveTab('paste')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <ClipboardPaste className="w-3.5 h-3.5 text-red-500" />
                      <span>Paste Template Code</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {savedDesigns.map((design) => {
                    const formattedDate = new Date(design.timestamp).toLocaleDateString(
                      undefined,
                      { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                    );

                    const patternLabel = design.style.patternStyle.replace('-', ' ');
                    const colorLabel = design.style.colorMode.replace('-', ' ');
                    const isCopied = copiedCodeId === design.id;

                    return (
                      <div
                        key={design.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all gap-2.5 sm:gap-3 group"
                      >
                        {/* Thumbnail & Title */}
                        <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                          <TemplateThumbnail
                            style={design.style}
                            thumbnailUrl={design.previewThumbnail}
                            alt={`${design.name} preview`}
                            className="w-12 h-12 rounded-xl object-contain bg-white border border-zinc-200 dark:border-zinc-700 p-0.5 shrink-0 shadow-2xs"
                          />

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]">
                                {design.name}
                              </span>
                              <span className="text-[9px] sm:text-[10px] capitalize font-bold px-1.5 py-0.2 rounded-sm bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 shrink-0">
                                {patternLabel}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-zinc-400 mt-0.5 flex-wrap">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 shrink-0" />
                                <span className="truncate">{formattedDate}</span>
                              </span>
                              <span>•</span>
                              <span className="capitalize">{colorLabel}</span>
                              <span>•</span>
                              <span className="capitalize">{design.style.eyeStyle} eyes</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto flex-wrap">
                          {/* 1. Apply Template Button */}
                          <button
                            type="button"
                            onClick={() => {
                              onLoadDesign(design);
                              onClose();
                            }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                            title="Apply this styling template to current QR code"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Apply</span>
                          </button>

                          {/* 2. Quick Copy Code Button */}
                          <button
                            type="button"
                            id={`btn-copy-code-${design.id}`}
                            onClick={(e) => handleQuickCopyCode(e, design)}
                            className={`flex items-center gap-1 px-2 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                              isCopied
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold'
                                : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                            }`}
                            title="Copy code to transfer this template to another browser"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span className="text-[11px]">Copied!</span>
                              </>
                            ) : (
                              <>
                                <FileCode className="w-3.5 h-3.5 text-zinc-500" />
                                <span className="hidden sm:inline text-[11px]">Code</span>
                              </>
                            )}
                          </button>

                          {/* 3. View Full Code Modal */}
                          <button
                            type="button"
                            onClick={() => handleOpenCodeViewer(design)}
                            className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            title="View full code & download .txt file"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>

                          {/* 4. Duplicate Template */}
                          <button
                            type="button"
                            onClick={() => onDuplicateDesign(design)}
                            className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            title="Duplicate template"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* 5. Delete Template */}
                          <button
                            type="button"
                            onClick={() => onDeleteDesign(design.id)}
                            className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                            title="Delete template"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PASTE / RECOVER CODE */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              {/* Introduction Banner */}
              <div className="p-3 rounded-xl bg-red-50/70 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/50 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-red-950 dark:text-red-200">
                  <ClipboardPaste className="w-4 h-4 text-red-600" />
                  <span>Recover QR Template from Code</span>
                </div>
                <p className="text-[11px] text-red-800/80 dark:text-red-300/80 leading-relaxed">
                  Paste any template code (starts with <code className="font-mono bg-white/60 dark:bg-black/40 px-1 py-0.5 rounded">EHSAAN-TPL-</code>) or bundle code from another browser, computer, or text backup.
                </p>
              </div>

              {/* Paste Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="template-paste-input"
                    className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5"
                  >
                    <FileCode className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Template Code String or JSON</span>
                  </label>
                  {pasteInput.trim() && (
                    <button
                      type="button"
                      onClick={() => setPasteInput('')}
                      className="text-[11px] text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <textarea
                  id="template-paste-input"
                  rows={4}
                  value={pasteInput}
                  onChange={(e) => setPasteInput(e.target.value)}
                  placeholder="Paste code here (e.g. EHSAAN-TPL-eyJ2IjoxLCJ0eXBlIjoiZWhzYWF... or JSON)"
                  className="w-full p-2.5 sm:p-3 text-xs font-mono rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-500/40 transition-all resize-y"
                />

                {/* Quick Utility Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePasteFromClipboard}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                    >
                      <ClipboardPaste className="w-3.5 h-3.5 text-red-500" />
                      <span>Paste from Clipboard</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                      title="Upload a saved template .txt file"
                    >
                      <Upload className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Upload .txt file</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Built-in Sample Button for 1-click test */}
                  <button
                    type="button"
                    onClick={() => setPasteInput(SAMPLE_TEMPLATE_CODE)}
                    className="text-[11px] font-semibold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                  >
                    Try Sample Code
                  </button>
                </div>
              </div>

              {/* Parsing Status & Live Preview Card */}
              {parseResult && (
                <div className="pt-2">
                  {parseResult.success ? (
                    <div className="p-3.5 rounded-2xl border border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>{parseResult.summary}</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold">
                          {parseResult.isBundle ? 'Bundle' : 'Single Template'}
                        </span>
                      </div>

                      {/* Single Template Live Card Preview */}
                      {!parseResult.isBundle && parseResult.templates.length > 0 && (
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-900/40 shadow-xs">
                          {/* Live Dynamic Thumbnail */}
                          <TemplateThumbnail
                            style={parseResult.templates[0].style}
                            thumbnailUrl={liveThumbnail || parseResult.templates[0].previewThumbnail}
                            alt="Detected Template"
                            className="w-14 h-14 rounded-xl object-contain bg-white border border-zinc-200 dark:border-zinc-700 p-0.5 shrink-0 shadow-2xs"
                            size={56}
                            onGenerated={(thumb) => setLiveThumbnail(thumb)}
                          />

                          <div className="min-w-0 flex-1 space-y-1.5">
                            <div>
                              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                                Template Name (Editable)
                              </label>
                              <input
                                type="text"
                                value={customName}
                                onChange={(e) => setCustomName(e.target.value)}
                                className="w-full text-xs font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-red-500"
                                placeholder="Enter a name for this template..."
                              />
                            </div>

                            {/* Style Badges & Color Swatches */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                                {parseResult.templates[0].style.patternStyle}
                              </span>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                                {parseResult.templates[0].style.colorMode}
                              </span>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                                {parseResult.templates[0].style.eyeStyle} eyes
                              </span>

                              {/* Color chips */}
                              <div className="flex items-center gap-1 pl-1">
                                <span
                                  className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                                  style={{ backgroundColor: parseResult.templates[0].style.fgColor }}
                                  title={`FG: ${parseResult.templates[0].style.fgColor}`}
                                />
                                {parseResult.templates[0].style.colorMode !== 'solid' && (
                                  <span
                                    className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                                    style={{ backgroundColor: parseResult.templates[0].style.fgColorEnd }}
                                    title={`FG End: ${parseResult.templates[0].style.fgColorEnd}`}
                                  />
                                )}
                                <span
                                  className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                                  style={{ backgroundColor: parseResult.templates[0].style.bgColor }}
                                  title={`BG: ${parseResult.templates[0].style.bgColor}`}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Bundle Templates Preview */}
                      {parseResult.isBundle && (
                        <div className="max-h-48 overflow-y-auto space-y-2 p-2 rounded-xl bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-900/40">
                          {parseResult.templates.map((tpl, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-2.5 text-xs p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <TemplateThumbnail
                                  style={tpl.style}
                                  thumbnailUrl={tpl.previewThumbnail}
                                  alt={`${tpl.name} thumbnail`}
                                  className="w-9 h-9 rounded-lg object-contain bg-white border border-zinc-200 dark:border-zinc-700 p-0.5 shrink-0 shadow-2xs"
                                  size={36}
                                />
                                <div className="min-w-0">
                                  <div className="font-bold text-zinc-800 dark:text-zinc-200 truncate">
                                    {tpl.name}
                                  </div>
                                  <div className="text-[10px] text-zinc-500 font-mono">
                                    {tpl.style.patternStyle} • {tpl.style.colorMode}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0">
                                #{idx + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action CTAs */}
                      <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleSavePastedTemplate(false)}
                          className="px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                        >
                          Save to My Templates
                        </button>

                        <button
                          type="button"
                          onClick={handleApplyPastedTemplate}
                          className="px-3 py-1.5 rounded-xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-950/70 text-red-700 dark:text-red-300 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                        >
                          Apply to QR Now
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSavePastedTemplate(true)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Save & Apply Both</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 p-3 rounded-xl border border-amber-400/40 bg-amber-50/70 dark:bg-amber-950/20 text-xs text-amber-900 dark:text-amber-300 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Invalid Code Format</span>
                        <span className="text-[11px] text-amber-800/80 dark:text-amber-400/80">
                          {parseResult.error}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 sm:p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 shrink-0">
          {activeTab === 'saved' ? (
            <>
              {/* Left Info: Saved Count */}
              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                <Layers className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>
                  {savedDesigns.length === 0
                    ? 'No templates saved yet'
                    : `${savedDesigns.length} ${savedDesigns.length === 1 ? 'template' : 'templates'} saved`}
                </span>
              </div>

              {/* Right Actions: Better Looking Clear All & Export All Buttons */}
              <div className="flex items-center justify-end gap-2.5">
                {/* Clear All Button */}
                <button
                  type="button"
                  id="btn-clear-all-templates"
                  onClick={onClearAll}
                  disabled={savedDesigns.length === 0}
                  className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                    savedDesigns.length === 0
                      ? 'opacity-40 cursor-not-allowed text-zinc-400 dark:text-zinc-600 bg-zinc-100 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-800'
                      : 'text-red-600 dark:text-red-400 bg-red-50/90 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 active:bg-red-200 dark:active:bg-red-900/70 border border-red-200/90 dark:border-red-900/60 hover:shadow-xs active:scale-95 cursor-pointer'
                  }`}
                  title={savedDesigns.length === 0 ? 'No templates to clear' : 'Clear all saved templates'}
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
                  <span>Clear All</span>
                </button>

                {/* Export All Button */}
                <button
                  type="button"
                  id="btn-export-all-templates"
                  onClick={handleOpenBundleViewer}
                  disabled={savedDesigns.length === 0}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                    savedDesigns.length === 0
                      ? 'opacity-40 cursor-not-allowed text-zinc-400 dark:text-zinc-600 bg-zinc-100 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-800'
                      : 'bg-zinc-900 hover:bg-zinc-800 active:bg-black dark:bg-zinc-100 dark:hover:bg-white dark:active:bg-zinc-200 text-white dark:text-zinc-950 hover:shadow-md active:scale-95 cursor-pointer'
                  }`}
                  title={
                    savedDesigns.length === 0
                      ? 'No templates to export'
                      : 'Export all saved templates into one code to migrate to another browser'
                  }
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export All</span>
                  {savedDesigns.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-zinc-700 dark:bg-zinc-300 text-white dark:text-zinc-900">
                      {savedDesigns.length}
                    </span>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('saved')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Saved Templates</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CODE VIEWER SUB-MODAL */}
      {codeViewerData && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
                  <FileCode className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {codeViewerData.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    {codeViewerData.subtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCodeViewerData(null)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Code Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Transfer Code (Click to Copy)
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {codeViewerData.code.length} chars
                </span>
              </div>

              <textarea
                readOnly
                value={codeViewerData.code}
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                rows={5}
                className="w-full p-2.5 sm:p-3 text-xs font-mono rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none select-all focus:ring-2 focus:ring-red-500/30"
              />
            </div>

            {/* Explanatory note */}
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
              <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
              <span>
                To recover this styling on any other browser, open EHSAAN QR on that device, click <strong>Templates</strong>, switch to <strong>Paste / Recover Code</strong>, and paste this code.
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={handleDownloadCodeFile}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save as .txt</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCodeViewerData(null)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Done
                </button>

                <button
                  type="button"
                  id="btn-copy-code-viewer"
                  onClick={handleCopyFromViewer}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  {isViewerCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied ✓</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
