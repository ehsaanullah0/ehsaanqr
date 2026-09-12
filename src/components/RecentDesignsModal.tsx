import React from 'react';
import { SavedQrDesign } from '../types';
import {
  X,
  History,
  Trash2,
  Copy,
  FolderOpen,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface RecentDesignsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedDesigns: SavedQrDesign[];
  onLoadDesign: (design: SavedQrDesign) => void;
  onDuplicateDesign: (design: SavedQrDesign) => void;
  onDeleteDesign: (id: string) => void;
  onClearAll: () => void;
}

export const RecentDesignsModal: React.FC<RecentDesignsModalProps> = ({
  isOpen,
  onClose,
  savedDesigns,
  onLoadDesign,
  onDuplicateDesign,
  onDeleteDesign,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-red-600" />
            <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
              Recent & Saved QR Codes
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono">
              {savedDesigns.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-3.5 sm:p-5 overflow-y-auto flex-1 space-y-2.5 sm:space-y-3">
          {savedDesigns.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                <History className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                No Saved QR Codes Yet
              </h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                Click the "Save" button on the live preview card anytime to store your QR styling and configuration locally.
              </p>
            </div>
          ) : (
            savedDesigns.map((design) => {
              const formattedDate = new Date(design.timestamp).toLocaleDateString(
                undefined,
                { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
              );

              return (
                <div
                  key={design.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all gap-2.5 sm:gap-3 group"
                >
                  {/* Thumbnail & Title */}
                  <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                    {design.previewThumbnail ? (
                      <img
                        src={design.previewThumbnail}
                        alt="QR"
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-contain bg-white border border-zinc-200 p-0.5 shrink-0 shadow-2xs"
                      />
                    ) : (
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center shrink-0">
                        <Layers className="w-5 h-5 text-zinc-500" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          {design.name}
                        </span>
                        <span className="text-[9px] sm:text-[10px] uppercase font-bold px-1.5 py-0.2 rounded-sm bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
                          {design.qrType}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-zinc-400 mt-0.5">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span className="truncate">{formattedDate}</span>
                        <span>•</span>
                        <span className="capitalize truncate">{design.style.patternStyle}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => {
                        onLoadDesign(design);
                        onClose();
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors"
                      title="Reopen design"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Open</span>
                    </button>

                    <button
                      onClick={() => onDuplicateDesign(design)}
                      className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      title="Duplicate design"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteDesign(design.id)}
                      className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Delete design"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {savedDesigns.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
            <button
              onClick={onClearAll}
              className="text-xs text-red-600 hover:text-red-700 font-medium"
            >
              Clear All Saved Designs
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
