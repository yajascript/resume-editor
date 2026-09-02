'use client';

import React, { useRef, useState, useLayoutEffect } from 'react';
import { Scissors, X, FileText } from 'lucide-react';
import { useResumeStore } from '@/store';
import { translate } from '@/i18n';

export interface PageBreakWrapperProps {
  children: React.ReactNode;
  pageBreakBefore?: boolean;
  onTogglePageBreak?: () => void;
  className?: string;
  isHeader?: boolean;
}

export const PageBreakWrapper: React.FC<PageBreakWrapperProps> = ({
  children,
  pageBreakBefore = false,
  onTogglePageBreak,
  className = '',
  isHeader = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [spacerHeight, setSpacerHeight] = useState<number>(0);
  const [targetPageNumber, setTargetPageNumber] = useState<number>(2);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const { editorState } = useResumeStore();
  const lang = editorState.currentLanguage;
  const isA4 = editorState.activePaperSize === 'a4';

  useLayoutEffect(() => {
    if (!pageBreakBefore || !containerRef.current) {
      setSpacerHeight(0);
      return;
    }

    const calculateSpacer = () => {
      const element = containerRef.current;
      if (!element) return;

      const sheet = element.closest('[id^="resume-sheet"]') as HTMLElement;
      if (!sheet) return;

      const sheetWidth = sheet.offsetWidth || (isA4 ? 794 : 816);
      const singlePageHeight = sheetWidth * (isA4 ? 297 / 210 : 11 / 8.5);

      const elementRect = element.getBoundingClientRect();
      const sheetRect = sheet.getBoundingClientRect();
      const unspacedTop = elementRect.top - sheetRect.top;

      if (unspacedTop < 0) return;

      const offsetInCurrentPage = unspacedTop % singlePageHeight;
      const newPageTopPadding = 24;

      let neededSpacer = 0;
      let targetPage = Math.floor(unspacedTop / singlePageHeight) + 1;

      if (offsetInCurrentPage > 15) {
        neededSpacer = (singlePageHeight - offsetInCurrentPage) + newPageTopPadding;
        targetPage += 1;
      }

      setTargetPageNumber(targetPage);
      setSpacerHeight(neededSpacer);
    };

    calculateSpacer();

    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        calculateSpacer();
      });

      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [pageBreakBefore, isA4]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group/pagebreak ${
        pageBreakBefore ? 'break-before-page page-break-before-always' : ''
      } ${className}`}
      style={{
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
      }}
    >
      {/* Dynamic Page Spacer - included in HTML-to-Image PDF raster export, hidden in native print */}
      {pageBreakBefore && spacerHeight > 0 && (
        <div
          data-page-break-spacer="true"
          className="w-full select-none pointer-events-none transition-all duration-150"
          style={{ height: `${spacerHeight}px` }}
          aria-hidden="true"
        />
      )}

      {/* Visual Page Break Indicator Line (Screen Only - Excluded from PDF export) */}
      {pageBreakBefore && (
        <div
          data-pagebreak-ui="true"
          className="pagebreak-ui-control no-print print:hidden w-full my-2 flex items-center gap-2 select-none relative z-20"
        >
          <div className="grow border-t-2 border-dashed border-blue-400 dark:border-blue-500 opacity-80" />
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold border border-blue-300 dark:border-blue-700 shadow-xs">
            <FileText className="w-3 h-3" />
            <span>
              {translate(lang, 'pageBreak.badge', { page: targetPageNumber })}
            </span>
            {onTogglePageBreak && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePageBreak();
                }}
                title={translate(lang, 'pageBreak.remove')}
                className="p-0.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-300 hover:text-red-600 transition-colors ml-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="grow border-t-2 border-dashed border-blue-400 dark:border-blue-500 opacity-80" />
        </div>
      )}

      {/* Quick Action Toggle Button on Hover in Preview (Screen Only - Excluded from PDF export) */}
      {!pageBreakBefore && onTogglePageBreak && isHovered && (
        <div
          data-pagebreak-ui="true"
          className="pagebreak-ui-control no-print print:hidden absolute top-0 right-0 -translate-y-1/2 z-30 transition-all duration-150 animate-fadeIn"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePageBreak();
            }}
            title={
              isHeader
                ? translate(lang, 'pageBreak.toggleBeforeSection')
                : translate(lang, 'pageBreak.toggleBefore')
            }
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-[9.5px] font-semibold border border-slate-200 dark:border-slate-700 shadow-md hover:border-blue-400 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Scissors className="w-2.5 h-2.5 text-blue-500" />
            <span>{translate(lang, 'pageBreak.insert')}</span>
          </button>
        </div>
      )}

      {/* Children Content */}
      <div
        className="w-full"
        style={{
          breakInside: 'avoid',
          pageBreakInside: 'avoid',
        }}
      >
        {children}
      </div>
    </div>
  );
};
