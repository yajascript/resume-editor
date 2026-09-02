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
  Eye,
  ChevronRight,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { resumeData, editorState, setPaperSize, setActiveSection } = useResumeStore();
  const lang = editorState.currentLanguage;

  const [isExporting, setIsExporting] = useState(false);
  const [activeFormat, setActiveFormat] = useState<'pdf' | 'docx' | 'png' | 'json'>('pdf');
  const [selectedPaperSize, setSelectedPaperSize] = useState<'letter' | 'a4'>(
    editorState.activePaperSize
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      setSuccessMessage(null);
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const handleExportDownload = async () => {
    try {
      setIsExporting(true);
      setSuccessMessage(null);

      // Clear active focus ring so export is clean
      setActiveSection(null);

      if (activeFormat === 'pdf') {
        setPaperSize(selectedPaperSize);
        await PdfExporter.export('resume-sheet', {
          paperSize: selectedPaperSize,
          fileName: 'resume.pdf',
        });
        setSuccessMessage(
          translate(lang, 'export.downloadSuccess', { fileName: 'resume.pdf' })
        );
      } else if (activeFormat === 'docx') {
        await DocxExporter.export(resumeData, 'resume.docx');
        setSuccessMessage(
          translate(lang, 'export.downloadSuccess', { fileName: 'resume.docx' })
        );
      } else if (activeFormat === 'png') {
        await ImageExporter.export('png', 'resume-sheet', 'resume.png');
        setSuccessMessage(
          translate(lang, 'export.downloadSuccess', { fileName: 'resume.png' })
        );
      } else if (activeFormat === 'json') {
        JsonExporter.export(resumeData, 'resume.json');
        setSuccessMessage(
          translate(lang, 'export.downloadSuccess', { fileName: 'resume.json' })
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleViewPdf = async () => {
    try {
      setIsExporting(true);
      setActiveSection(null);
      setPaperSize(selectedPaperSize);
      await PdfExporter.view('resume-sheet', {
        paperSize: selectedPaperSize,
      });
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
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
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
          {/* Format Selector Column */}
          <div className="col-span-5 flex flex-col gap-2">
            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              {translate(lang, 'export.fileFormat')}
            </label>

            {/* PDF Option */}
            <button
              type="button"
              onClick={() => setActiveFormat('pdf')}
              className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
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
              className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
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
              className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
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
              className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
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
          <div className="col-span-7 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between min-h-[240px]">
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

                {/* Paper Size Selector */}
                <div>
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1.5 uppercase tracking-wide">
                    {translate(lang, 'export.paperSize')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPaperSize('letter')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        selectedPaperSize === 'letter'
                          ? 'border-blue-500 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 bg-transparent text-slate-600 dark:text-slate-400 hover:bg-white/50'
                      }`}
                    >
                      <div className="font-semibold">{translate(lang, 'export.letterOption')}</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPaperSize('a4')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        selectedPaperSize === 'a4'
                          ? 'border-blue-500 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 bg-transparent text-slate-600 dark:text-slate-400 hover:bg-white/50'
                      }`}
                    >
                      <div className="font-semibold">{translate(lang, 'export.a4Option')}</div>
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
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {translate(lang, 'export.wordDescription')}
                </p>
              </div>
            )}

            {activeFormat === 'png' && (
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {translate(lang, 'export.png')}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {translate(lang, 'export.pngDescription')}
                </p>
              </div>
            )}

            {activeFormat === 'json' && (
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {translate(lang, 'export.json')}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {translate(lang, 'export.jsonDescription')}
                </p>
              </div>
            )}

            {/* Action Buttons inside Configuration Box */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200/80 dark:border-slate-700/80">
              {activeFormat === 'pdf' ? (
                <>
                  {/* View PDF Button */}
                  <button
                    type="button"
                    disabled={isExporting}
                    onClick={handleViewPdf}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl transition-all cursor-pointer shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-500" />
                    <span>{translate(lang, 'export.viewPdf')}</span>
                  </button>

                  {/* Download PDF Button */}
                  <button
                    type="button"
                    disabled={isExporting}
                    onClick={handleExportDownload}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    {isExporting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <FileDown className="w-3.5 h-3.5" />
                    )}
                    <span>{translate(lang, 'export.downloadPdf')}</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={handleExportDownload}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  {isExporting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FileDown className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {activeFormat === 'docx'
                      ? translate(lang, 'export.exportWord')
                      : activeFormat === 'png'
                      ? translate(lang, 'export.exportPng')
                      : translate(lang, 'export.exportJson')}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
