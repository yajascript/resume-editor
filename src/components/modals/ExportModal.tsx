'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useResumeStore } from '@/store';
import { translate } from '@/i18n';
import { DocxExporter, PdfExporter, ImageExporter, JsonExporter } from '@/exporters';
import {
  FileText,
  FileDown,
  Image as ImageIcon,
  Code2,
  X,
  CheckCircle,
  Loader2,
  ChevronRight,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PdfScopeOption = 'en_only' | 'fr_only' | 'dual_joint' | 'dual_separate';

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { resumeData, frenchResumeData, englishResumeData, editorState, setPaperSize, setActiveSection } =
    useResumeStore();
  const lang = editorState.currentLanguage;
  const isDualView = !!editorState.isDualViewMode;
  const hasBilingualData = isDualView || (!!frenchResumeData && !!englishResumeData);

  const [isExporting, setIsExporting] = useState(false);
  const [activeFormat, setActiveFormat] = useState<'pdf' | 'docx' | 'png' | 'json'>('pdf');
  const [pdfScope, setPdfScope] = useState<PdfScopeOption>(() => {
    if (isDualView) return 'dual_joint';
    return lang === 'fr' ? 'fr_only' : 'en_only';
  });
  const [selectedPaperSize, setSelectedPaperSize] = useState<'letter' | 'a4'>(
    editorState.activePaperSize
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Synchronize default PDF scope when modal opens
  useEffect(() => {
    if (isOpen) {
      if (isDualView) {
        setPdfScope('dual_joint');
      } else {
        setPdfScope(lang === 'fr' ? 'fr_only' : 'en_only');
      }
    }
  }, [isOpen, isDualView, lang]);

  // Close on Escape key press
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const currentLangSuffix = lang.toUpperCase();

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setSuccessMessage(null);

      // Clear any active focus ring so exports are 100% clean
      setActiveSection(null);

      if (activeFormat === 'pdf') {
        setPaperSize(selectedPaperSize);

        if (pdfScope === 'dual_joint') {
          await PdfExporter.exportJointBilingual({
            enElementId: 'resume-sheet-en',
            frElementId: 'resume-sheet-fr',
            paperSize: selectedPaperSize,
            fileName: 'resume_EN_FR.pdf',
          });
          setSuccessMessage(
            translate(lang, 'export.downloadSuccess', {
              fileName: 'resume_EN_FR.pdf',
            })
          );
        } else if (pdfScope === 'dual_separate') {
          await PdfExporter.exportSeparateBilingual({
            enElementId: 'resume-sheet-en',
            frElementId: 'resume-sheet-fr',
            paperSize: selectedPaperSize,
          });
          setSuccessMessage(
            translate(lang, 'export.downloadSuccess', {
              fileName: 'resume_EN.pdf & resume_FR.pdf',
            })
          );
        } else if (pdfScope === 'fr_only') {
          const targetId = isDualView ? 'resume-sheet-fr' : 'resume-sheet';
          await PdfExporter.export(targetId, {
            paperSize: selectedPaperSize,
            fileName: 'resume_FR.pdf',
          });
          setSuccessMessage(
            translate(lang, 'export.downloadSuccess', { fileName: 'resume_FR.pdf' })
          );
        } else {
          // en_only
          const targetId = isDualView ? 'resume-sheet-en' : 'resume-sheet';
          await PdfExporter.export(targetId, {
            paperSize: selectedPaperSize,
            fileName: 'resume_EN.pdf',
          });
          setSuccessMessage(
            translate(lang, 'export.downloadSuccess', { fileName: 'resume_EN.pdf' })
          );
        }
      } else if (activeFormat === 'docx') {
        const fileName = `resume_${currentLangSuffix}.docx`;
        await DocxExporter.export(resumeData, fileName);
        setSuccessMessage(
          translate(lang, 'export.downloadSuccess', { fileName })
        );
      } else if (activeFormat === 'png') {
        const targetId = isDualView
          ? lang === 'fr'
            ? 'resume-sheet-fr'
            : 'resume-sheet-en'
          : 'resume-sheet';

        const fileName = `resume_${currentLangSuffix}.png`;
        await ImageExporter.export('png', targetId, fileName);
        setSuccessMessage(
          translate(lang, 'export.downloadSuccess', { fileName })
        );
      } else if (activeFormat === 'json') {
        const fileName = `resume_${currentLangSuffix}.json`;
        JsonExporter.export(resumeData, fileName);
        setSuccessMessage(
          translate(lang, 'export.downloadSuccess', { fileName })
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/65 backdrop-blur-sm animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 md:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {translate(lang, 'export.modalTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {translate(lang, 'export.modalSubtitle')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            title={translate(lang, 'export.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Desktop Split Layout: Format Selector (Left) & Configuration Details (Right) */}
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Format Selector Column (All items with clean extension labels) */}
          <div className="col-span-5 flex flex-col gap-2">
            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              {translate(lang, 'export.fileFormat')}
            </label>

            {/* PDF Option */}
            <button
              type="button"
              onClick={() => setActiveFormat('pdf')}
              className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                activeFormat === 'pdf'
                  ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileDown className="w-4 h-4 opacity-80" />
                <span className="text-xs">{translate(lang, 'export.pdf')}</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform ${activeFormat === 'pdf' ? 'translate-x-0.5 opacity-100' : 'opacity-30'}`}
              />
            </button>

            {/* Word Option */}
            <button
              type="button"
              onClick={() => setActiveFormat('docx')}
              className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                activeFormat === 'docx'
                  ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 opacity-80" />
                <span className="text-xs">{translate(lang, 'export.word')}</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform ${activeFormat === 'docx' ? 'translate-x-0.5 opacity-100' : 'opacity-30'}`}
              />
            </button>

            {/* PNG Image Option */}
            <button
              type="button"
              onClick={() => setActiveFormat('png')}
              className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                activeFormat === 'png'
                  ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4 opacity-80" />
                <span className="text-xs">{translate(lang, 'export.png')}</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform ${activeFormat === 'png' ? 'translate-x-0.5 opacity-100' : 'opacity-30'}`}
              />
            </button>

            {/* JSON Backup Option */}
            <button
              type="button"
              onClick={() => setActiveFormat('json')}
              className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                activeFormat === 'json'
                  ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Code2 className="w-4 h-4 opacity-80" />
                <span className="text-xs">{translate(lang, 'export.json')}</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform ${activeFormat === 'json' ? 'translate-x-0.5 opacity-100' : 'opacity-30'}`}
              />
            </button>
          </div>

          {/* Configuration & Details Column */}
          <div className="col-span-7 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between min-h-[260px]">
            {activeFormat === 'pdf' && (
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {translate(lang, 'export.pdfSettings')}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {translate(lang, 'export.pdfSettingsDesc')}
                  </p>
                </div>

                {/* PDF Scope Options (Cleanly worded, zero emojis, smart visibility) */}
                <div>
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1.5 uppercase tracking-wide">
                    {translate(lang, 'export.pdfScopeLabel')}
                  </label>
                  <div className="flex flex-col gap-1.5">
                    {/* Option 1: English Document Only */}
                    {(hasBilingualData || lang === 'en') && (
                      <button
                        type="button"
                        onClick={() => setPdfScope('en_only')}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          pdfScope === 'en_only'
                            ? 'border-blue-500 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 bg-transparent text-slate-600 dark:text-slate-400 hover:bg-white/50'
                        }`}
                      >
                        <div>
                          <div>{translate(lang, 'export.pdfScopeEnOnly')}</div>
                          <div className="text-[10px] font-normal opacity-75">
                            resume_EN.pdf
                          </div>
                        </div>
                      </button>
                    )}

                    {/* Option 2: French Document Only */}
                    {(hasBilingualData || lang === 'fr') && (
                      <button
                        type="button"
                        onClick={() => setPdfScope('fr_only')}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          pdfScope === 'fr_only'
                            ? 'border-blue-500 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 bg-transparent text-slate-600 dark:text-slate-400 hover:bg-white/50'
                        }`}
                      >
                        <div>
                          <div>{translate(lang, 'export.pdfScopeFrOnly')}</div>
                          <div className="text-[10px] font-normal opacity-75">
                            resume_FR.pdf
                          </div>
                        </div>
                      </button>
                    )}

                    {/* Option 3: Dual Combined 2-Page PDF (Only when bilingual data is present) */}
                    {hasBilingualData && (
                      <button
                        type="button"
                        onClick={() => setPdfScope('dual_joint')}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          pdfScope === 'dual_joint'
                            ? 'border-blue-500 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 bg-transparent text-slate-600 dark:text-slate-400 hover:bg-white/50'
                        }`}
                      >
                        <div>
                          <div>{translate(lang, 'export.pdfScopeJoint')}</div>
                          <div className="text-[10px] font-normal opacity-75">
                            resume_EN_FR.pdf
                          </div>
                        </div>
                      </button>
                    )}

                    {/* Option 4: Dual 2 Separate PDF Files (Only when bilingual data is present) */}
                    {hasBilingualData && (
                      <button
                        type="button"
                        onClick={() => setPdfScope('dual_separate')}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          pdfScope === 'dual_separate'
                            ? 'border-blue-500 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 bg-transparent text-slate-600 dark:text-slate-400 hover:bg-white/50'
                        }`}
                      >
                        <div>
                          <div>{translate(lang, 'export.pdfScopeSeparate')}</div>
                          <div className="text-[10px] font-normal opacity-75">
                            resume_EN.pdf & resume_FR.pdf
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                </div>

                {/* Paper Size Selector */}
                <div>
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1.5 uppercase tracking-wide">
                    {translate(lang, 'export.paperSize')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPaperSize('letter')}
                      className={`py-2 px-2.5 rounded-xl border text-center text-xs transition-all ${
                        selectedPaperSize === 'letter'
                          ? 'border-blue-500 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 bg-transparent text-slate-600 dark:text-slate-400 hover:bg-white/50'
                      }`}
                    >
                      {translate(lang, 'export.letterOption')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPaperSize('a4')}
                      className={`py-2 px-2.5 rounded-xl border text-center text-xs transition-all ${
                        selectedPaperSize === 'a4'
                          ? 'border-blue-500 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 bg-transparent text-slate-600 dark:text-slate-400 hover:bg-white/50'
                      }`}
                    >
                      {translate(lang, 'export.a4Option')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeFormat === 'docx' && (
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {translate(lang, 'export.word')}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {translate(lang, 'export.wordDescription')}
                </p>
                <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-2">
                  File: resume_{currentLangSuffix}.docx
                </div>
              </div>
            )}

            {activeFormat === 'png' && (
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {translate(lang, 'export.png')}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {translate(lang, 'export.pngDescription')}
                </p>
                <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-2">
                  File: resume_{currentLangSuffix}.png
                </div>
              </div>
            )}

            {activeFormat === 'json' && (
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {translate(lang, 'export.json')}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {translate(lang, 'export.jsonDescription')}
                </p>
                <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-2">
                  File: resume_{currentLangSuffix}.json
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-4 border-t border-slate-200/60 dark:border-slate-700/60 mt-auto flex justify-end">
              <button
                type="button"
                disabled={isExporting}
                onClick={handleExport}
                className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                {isExporting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FileDown className="w-3.5 h-3.5" />
                )}
                <span>
                  {activeFormat === 'pdf' && translate(lang, 'export.exportPdf')}
                  {activeFormat === 'docx' && translate(lang, 'export.exportWord')}
                  {activeFormat === 'png' && translate(lang, 'export.exportPng')}
                  {activeFormat === 'json' && translate(lang, 'export.exportJson')}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
