'use client';

import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useResumeStore } from '@/store';
import { getTemplateById } from '@/templates';
import { translate } from '@/i18n';

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
        const secRect = sec.getBoundingClientRect();
        const bottomRel = secRect.bottom - paperRect.top;
        if (bottomRel > maxBottom) {
          maxBottom = bottomRel;
        }
      });

      if (maxBottom <= 0) {
        maxBottom = element.clientHeight || singlePagePx;
      }

      // Count pages needed with a 20px tolerance
      const pages = Math.max(1, Math.ceil((maxBottom - 20) / singlePagePx));
      setTotalPages(pages);
    };

    measurePages();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => {
        measurePages();
      });
      observer.observe(element);
      return () => observer.disconnect();
    }
  }, [isA4, children, pageAspectRatio]);

  return (
    <div
      id={id}
      ref={paperRef}
      style={{
        width: paperWidth,
        minHeight: `${totalPages * singlePageMm}mm`,
      }}
      className="relative bg-white shadow-2xl transition-all duration-200 flex flex-row shrink-0 overflow-visible print:shadow-none print:m-0"
    >
      {/* Visual Page Boundary Dividers (Screen Only - Excluded from Print & PDF) */}
      {totalPages > 1 &&
        Array.from({ length: totalPages - 1 }).map((_, idx) => (
          <div
            key={idx}
            style={{
              top: `${(idx + 1) * singlePageMm}mm`,
            }}
            className="absolute left-0 right-0 z-30 pointer-events-none no-print print:hidden select-none flex items-center justify-between"
          >
            <div className="w-full border-b-2 border-dashed border-red-400 dark:border-red-500 opacity-60" />
            <span className="absolute right-4 -top-3 text-[9.5px] font-bold text-red-500 dark:text-red-400 bg-white/95 dark:bg-slate-900/95 px-2 py-0.5 rounded-md border border-red-300 dark:border-red-800 shadow-xs uppercase tracking-wider">
              {translate(lang, 'canvas.pageDivider', { page: idx + 1 })}
            </span>
          </div>
        ))}

      {/* Rendered Template Document */}
      <div className="w-full flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};

export const WorkspaceCanvas: React.FC = () => {
  const { resumeData, editorState, updateField } = useResumeStore();

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
        <ResumePaper id="resume-sheet" isA4={isA4} paperWidth={paperWidth}>
          <TemplateComponent
            resumeData={resumeData}
            onFieldChange={updateField}
            accentColor={editorState.activeAccentColor}
            fontFamily={editorState.activeFontFamily}
          />
        </ResumePaper>
      </div>
    </main>
  );
};
