'use client';

import React, { useEffect } from 'react';
import { useResumeStore } from '@/store';
import { getTemplateById } from '@/templates';
import { translate } from '@/i18n';
import { Check, Edit3 } from 'lucide-react';

export const WorkspaceCanvas: React.FC = () => {
  const {
    resumeData,
    frenchResumeData,
    englishResumeData,
    editorState,
    updateField,
    setLanguage,
  } = useResumeStore();

  const lang = editorState.currentLanguage;
  const isDualView = !!editorState.isDualViewMode;
  const currentTemplate = getTemplateById(editorState.activeTemplateId);
  const TemplateComponent = currentTemplate.component;

  const zoomScale = editorState.zoomLevelPercentage / 100;
  const isA4 = editorState.activePaperSize === 'a4';
  const paperWidth = isA4 ? '210mm' : '8.5in';
  const paperMinHeight = isA4 ? 'min-h-[297mm]' : 'min-h-[11in]';

  // Smooth scroll right preview canvas when a section is focused in the sidebar
  useEffect(() => {
    if (editorState.activeSection && editorState.focusedSource === 'sidebar') {
      const targetElement = document.getElementById(`preview-section-${editorState.activeSection}`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [editorState.activeSection, editorState.focusedSource]);

  return (
    <main className="flex-1 bg-slate-100 dark:bg-slate-950 overflow-auto relative flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8 transition-colors duration-200">
      {/* Resume Viewport Container */}
      <div
        className="transition-transform duration-150 origin-top flex justify-center pb-24 print:p-0 print:m-0"
        style={{
          transform: `scale(${zoomScale})`,
        }}
      >
        {isDualView ? (
          /* Dual Language Side-by-Side View (English Left, French Right) */
          <div className="flex flex-col xl:flex-row items-start gap-8 min-w-fit">
            {/* 1. English Resume Paper (English First) */}
            <div
              onClick={() => {
                if (lang !== 'en') setLanguage('en');
              }}
              style={{ width: paperWidth }}
              className={`flex flex-col gap-2.5 transition-all duration-200 cursor-pointer ${
                lang === 'en' ? 'ring-2 ring-blue-500 shadow-2xl rounded-lg' : 'opacity-90 hover:opacity-100 shadow-md'
              }`}
            >
              {/* English Header Badge */}
              <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">🇺🇸</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {translate(lang, 'canvas.dualView.englishTitle')}
                  </span>
                </div>
                {lang === 'en' ? (
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                    <Check className="w-3.5 h-3.5" />
                    <span>{translate(lang, 'canvas.dualView.activeEditing')}</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLanguage('en');
                    }}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 py-0.5 px-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{translate(lang, 'canvas.dualView.editEnglish')}</span>
                  </button>
                )}
              </div>

              {/* English Document */}
              <div
                id="resume-sheet-en"
                className={`w-full bg-white shadow-paper print:shadow-none transition-all rounded-sm overflow-hidden ${paperMinHeight}`}
              >
                <TemplateComponent
                  resumeData={lang === 'en' ? resumeData : (englishResumeData || resumeData)}
                  onFieldChange={(path, val) => {
                    if (lang !== 'en') setLanguage('en');
                    updateField(path, val);
                  }}
                  accentColor={editorState.activeAccentColor}
                  fontFamily={editorState.activeFontFamily}
                />
              </div>
            </div>

            {/* 2. French Resume Paper */}
            <div
              onClick={() => {
                if (lang !== 'fr') setLanguage('fr');
              }}
              style={{ width: paperWidth }}
              className={`flex flex-col gap-2.5 transition-all duration-200 cursor-pointer ${
                lang === 'fr' ? 'ring-2 ring-blue-500 shadow-2xl rounded-lg' : 'opacity-90 hover:opacity-100 shadow-md'
              }`}
            >
              {/* French Header Badge */}
              <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">🇫🇷</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {translate(lang, 'canvas.dualView.frenchTitle')}
                  </span>
                </div>
                {lang === 'fr' ? (
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                    <Check className="w-3.5 h-3.5" />
                    <span>{translate(lang, 'canvas.dualView.activeEditing')}</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLanguage('fr');
                    }}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 py-0.5 px-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{translate(lang, 'canvas.dualView.editFrench')}</span>
                  </button>
                )}
              </div>


              {/* French Document */}
              <div
                id="resume-sheet-fr"
                className={`w-full bg-white shadow-paper print:shadow-none transition-all rounded-sm overflow-hidden ${paperMinHeight}`}
              >
                <TemplateComponent
                  resumeData={lang === 'fr' ? resumeData : (frenchResumeData || resumeData)}
                  onFieldChange={(path, val) => {
                    if (lang !== 'fr') setLanguage('fr');
                    updateField(path, val);
                  }}
                  accentColor={editorState.activeAccentColor}
                  fontFamily={editorState.activeFontFamily}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Single Language View */
          <div
            id="resume-sheet"
            style={{ width: paperWidth }}
            className={`w-full bg-white shadow-paper print:shadow-none transition-all rounded-sm overflow-hidden ${paperMinHeight}`}
          >
            <TemplateComponent
              resumeData={resumeData}
              onFieldChange={updateField}
              accentColor={editorState.activeAccentColor}
              fontFamily={editorState.activeFontFamily}
            />
          </div>
        )}
      </div>
    </main>
  );
};
