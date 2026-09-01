'use client';

import React, { useEffect, useCallback } from 'react';
import { useResumeStore } from '@/store';
import { translate } from '@/i18n';
import { TEMPLATE_REGISTRY } from '@/templates';
import { TemplatePreviewThumbnail } from '@/components/editor/TemplatePreviewThumbnail';
import { X, Check } from 'lucide-react';

interface TemplateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TemplateSelectorModal: React.FC<TemplateSelectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { editorState, setTemplate, setAccentColor } = useResumeStore();
  const lang = editorState.currentLanguage;

  // Close on Escape key press
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-5"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {translate(lang, 'templates.title')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select a professional layout. All your data and customizations are preserved.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-h-[70vh] overflow-y-auto pr-1">
          {TEMPLATE_REGISTRY.map((tpl) => {
            const isSelected = editorState.activeTemplateId === tpl.identifier;
            return (
              <button
                key={tpl.identifier}
                type="button"
                onClick={() => {
                  setTemplate(tpl.identifier);
                  setAccentColor(tpl.accentColors[0]);
                  onClose();
                }}
                className={`group p-2.5 rounded-xl border text-left flex flex-col gap-2.5 transition-all relative ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-500/30 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-700 hover:shadow'
                }`}
              >
                {/* Visual Thumbnail Layout Preview */}
                <div className="relative w-full rounded overflow-hidden shadow-inner group-hover:scale-[1.02] transition-transform">
                  <TemplatePreviewThumbnail
                    templateId={tpl.identifier}
                    accentColor={tpl.accentColors[0]}
                  />
                  {isSelected && (
                    <div className="absolute top-2 right-2 p-1 bg-blue-600 rounded-full text-white shadow-md">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {tpl.templateName}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-tight">
                    {tpl.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
