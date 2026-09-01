'use client';

import React from 'react';
import { useResumeStore } from '@/store';
import { translate } from '@/i18n';
import { TEMPLATE_REGISTRY, getTemplateById } from '@/templates';
import { TemplatePreviewThumbnail } from '@/components/editor/TemplatePreviewThumbnail';
import { Check, Palette, FileText, Type } from 'lucide-react';

export const AppearanceForm: React.FC = () => {
  const {
    editorState,
    setTemplate,
    setAccentColor,
    setFontFamily,
    setPaperSize,
  } = useResumeStore();
  const lang = editorState.currentLanguage;
  const currentTemplate = getTemplateById(editorState.activeTemplateId);

  const availableFonts = [
    { name: 'Open Sans', label: 'Open Sans (Modern & Clean)' },
    { name: 'Inter', label: 'Inter (Contemporary & Tech)' },
    { name: 'Georgia', label: 'Georgia (Classic & Executive)' },
    { name: 'JetBrains Mono', label: 'JetBrains Mono (Code & Engineering)' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Template Selector with Visual Layout Previews */}
      <div>
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2.5">
          <FileText className="w-3.5 h-3.5 text-blue-500" />
          {translate(lang, 'templates.title')}
        </label>
        <div className="grid grid-cols-2 gap-3">
          {TEMPLATE_REGISTRY.map((tpl) => {
            const isSelected = editorState.activeTemplateId === tpl.identifier;
            return (
              <button
                key={tpl.identifier}
                type="button"
                onClick={() => {
                  setTemplate(tpl.identifier);
                  setAccentColor(tpl.accentColors[0]);
                }}
                className={`p-2 rounded-xl border text-left flex flex-col gap-2 transition-all relative ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="relative w-full rounded overflow-hidden">
                  <TemplatePreviewThumbnail
                    templateId={tpl.identifier}
                    accentColor={tpl.accentColors[0]}
                  />
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 p-0.5 bg-blue-600 rounded-full text-white shadow">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">
                    {tpl.templateName}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accent Color Palette */}
      <div>
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2.5">
          <Palette className="w-3.5 h-3.5 text-blue-500" />
          {translate(lang, 'header.accentColor')}
        </label>
        <div className="flex items-center gap-2.5 flex-wrap">
          {currentTemplate.accentColors.map((color) => {
            const isSelected = editorState.activeAccentColor === color;
            return (
              <button
                key={color}
                type="button"
                onClick={() => setAccentColor(color)}
                className={`w-7 h-7 rounded-full transition-all flex items-center justify-center shadow-sm ${
                  isSelected ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Font Family Selector */}
      <div>
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2">
          <Type className="w-3.5 h-3.5 text-blue-500" />
          {translate(lang, 'header.fontFamily')}
        </label>
        <select
          value={editorState.activeFontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          {availableFonts.map((f) => (
            <option key={f.name} value={f.name}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* Paper Size Switcher */}
      <div>
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 block">
          {translate(lang, 'header.paperSize')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setPaperSize('letter')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
              editorState.activePaperSize === 'letter'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {translate(lang, 'header.letter')} (8.5 × 11 in)
          </button>
          <button
            type="button"
            onClick={() => setPaperSize('a4')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
              editorState.activePaperSize === 'a4'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {translate(lang, 'header.a4')} (210 × 297 mm)
          </button>
        </div>
      </div>
    </div>
  );
};
