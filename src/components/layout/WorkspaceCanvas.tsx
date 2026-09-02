'use client';

import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useResumeStore } from '@/store';
import { getTemplateById } from '@/templates';
import { translate } from '@/i18n';
import { Check, Edit3, FileText } from 'lucide-react';

interface ResumePaperProps {
  id: string;
  isA4: boolean;
  paperWidth: string;
  children: React.ReactNode;
}

const ResumePaper: React.FC<ResumePaperProps> = ({ id, isA4, paperWidth, children }) => {
  const paperRef = useRef<HTMLDivElement>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { editorState } = useResumeStore();
  const lang = editorState.currentLanguage;

  // Single page height in mm and aspect ratio
  const singlePageMm = isA4 ? 297 : 279.4;
  const pageAspectRatio = isA4 ? 297 / 210 : 11 / 8.5;

  useLayoutEffect(() => {
    const element = paperRef.current;
    if (!element) return;

    const measurePages = () => {
      const width = element.offsetWidth || (isA4 ? 794 : 816);
      const singlePagePx = width * pageAspectRatio;

      const paperRect = element.getBoundingClientRect();
      const sections = element.querySelectorAll('[id^="preview-section-"], section, header, footer, [data-page-break-spacer]');
      let maxBottom = 0;

      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        const bottom = rect.bottom - paperRect.top;
        if (bottom > maxBottom) {
          maxBottom = bottom;
        }
      });

      if (maxBottom <= 0) {
        maxBottom = element.scrollHeight;
      }

      // Page is only added if content extends past 15px into the next page
      const computedPages = Math.max(1, Math.ceil((maxBottom - 15) / singlePagePx));
      setTotalPages(computedPages);
    };

    measurePages();

    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(() => {
        measurePages();
      });

      resizeObserver.observe(element);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [isA4, pageAspectRatio, children]);

  const minHeightStyle = `${totalPages * singlePageMm}mm`;

  return (
    <div
      ref={paperRef}
      id={id}
      style={{
        width: paperWidth,
        minHeight: minHeightStyle,
      }}
      className="w-full bg-white shadow-paper print:shadow-none transition-all rounded-sm relative flex flex-col"
    >
      {/* Visual Page Boundary Guidelines (Screen Mode Only) */}
      {totalPages > 1 &&
        Array.from({ length: totalPages - 1 }).map((_, idx) => {
          const pageIndex = idx + 1;
          const topPosition = `${pageIndex * singlePageMm}mm`;

          return (
            <div
              key={pageIndex}
              data-pagebreak-ui="true"
              style={{ top: topPosition }}
              className="pagebreak-ui-control absolute left-0 right-0 -translate-y-1/2 z-30 pointer-events-none print:hidden flex items-center justify-center px-4"
              aria-hidden="true"
            >
              <div className="grow border-t border-dashed border-slate-400/60 dark:border-slate-500/60" />
              <span className="flex items-center gap-1.5 px-3 py-0.5 mx-2 rounded-full bg-slate-800/85 text-slate-100 text-[10px] font-semibold tracking-wide shadow-md backdrop-blur-xs">
                <FileText className="w-3 h-3 text-blue-400" />
                <span>{translate(lang, 'canvas.pageDivider', { page: pageIndex })}</span>
              </span>
              <div className="grow border-t border-dashed border-slate-400/60 dark:border-slate-500/60" />
            </div>
          );
        })}

      {/* Rendered Template Document */}
      <div className="w-full flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};

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
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 py-0.5 px-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{translate(lang, 'canvas.dualView.editEnglish')}</span>
                  </button>
                )}
              </div>

              {/* English Document with Dynamic Full Page Spanning */}
              <ResumePaper id="resume-sheet-en" isA4={isA4} paperWidth={paperWidth}>
                <TemplateComponent
                  resumeData={lang === 'en' ? resumeData : (englishResumeData || resumeData)}
                  onFieldChange={(path, val) => {
                    if (lang !== 'en') setLanguage('en');
                    updateField(path, val);
                  }}
                  accentColor={editorState.activeAccentColor}
                  fontFamily={editorState.activeFontFamily}
                />
              </ResumePaper>
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
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 py-0.5 px-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{translate(lang, 'canvas.dualView.editFrench')}</span>
                  </button>
                )}
              </div>

              {/* French Document with Dynamic Full Page Spanning */}
              <ResumePaper id="resume-sheet-fr" isA4={isA4} paperWidth={paperWidth}>
                <TemplateComponent
                  resumeData={lang === 'fr' ? resumeData : (frenchResumeData || resumeData)}
                  onFieldChange={(path, val) => {
                    if (lang !== 'fr') setLanguage('fr');
                    updateField(path, val);
                  }}
                  accentColor={editorState.activeAccentColor}
                  fontFamily={editorState.activeFontFamily}
                />
              </ResumePaper>
            </div>
          </div>
        ) : (
          /* Single Language View with Dynamic Full Page Spanning */
          <ResumePaper id="resume-sheet" isA4={isA4} paperWidth={paperWidth}>
            <TemplateComponent
              resumeData={resumeData}
              onFieldChange={updateField}
              accentColor={editorState.activeAccentColor}
              fontFamily={editorState.activeFontFamily}
            />
          </ResumePaper>
        )}
      </div>
    </main>
  );
};
