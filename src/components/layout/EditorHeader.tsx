'use client';

import React, { useState } from 'react';
import { useResumeStore } from '@/store';
import { translate } from '@/i18n';
import {
  Undo2,
  Redo2,
  FileDown,
  Sparkles,
  RotateCcw,
  Sun,
  Moon,
  FileText,
  BookmarkPlus,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';
import { ExportModal, ImportHtmlModal, SavedVersionsModal } from '../modals';

export const EditorHeader: React.FC = () => {
  const {
    editorState,
    undoHistory,
    redoHistory,
    savedVersions,
    undo,
    redo,
    setEditorTheme,
    setZoomLevel,
    resetToDefault,
  } = useResumeStore();

  const lang = editorState.currentLanguage;
  const isDark = editorState.editorTheme === 'dark';

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isVersionsModalOpen, setIsVersionsModalOpen] = useState(false);

  const handleToggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    setEditorTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleReset = () => {
    if (window.confirm(translate(lang, 'header.resetConfirm'))) {
      resetToDefault();
    }
  };

  return (
    <>
      <header className="h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between z-30 sticky top-0 gap-3 select-none">
        {/* Left Branding & History Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                {translate(lang, 'app.title')}
              </h1>
            </div>
          </div>

          <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-0.5" />

          {/* Undo & Redo */}
          <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
            <button
              type="button"
              disabled={undoHistory.length === 0}
              onClick={undo}
              title={translate(lang, 'header.undo')}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 rounded-md transition-all cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              disabled={redoHistory.length === 0}
              onClick={redo}
              title={translate(lang, 'header.redo')}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 rounded-md transition-all cursor-pointer"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center: Zoom Controls */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
          <button
            type="button"
            onClick={() => setZoomLevel(Math.max(50, editorState.zoomLevelPercentage - 10))}
            title={translate(lang, 'header.zoomOut')}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 min-w-[2.8rem] text-center">
            {editorState.zoomLevelPercentage}%
          </span>
          <button
            type="button"
            onClick={() => setZoomLevel(Math.min(200, editorState.zoomLevelPercentage + 10))}
            title={translate(lang, 'header.zoomIn')}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(100)}
            title={translate(lang, 'header.fitScreen')}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Actions: Save, Versions, Import, Export, Theme, Reset */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Save Version */}
          <button
            type="button"
            onClick={() => setIsVersionsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all cursor-pointer"
            title={translate(lang, 'versions.saveButton')}
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{translate(lang, 'versions.saveButton')}</span>
          </button>

          {/* Saved Versions Dialog */}
          <button
            type="button"
            onClick={() => setIsVersionsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-700 transition-all shadow-2xs cursor-pointer"
            title={translate(lang, 'versions.modalTitle')}
          >
            <span className="hidden md:inline">{translate(lang, 'header.versions')}</span>
            {savedVersions.length > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-extrabold rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400">
                {savedVersions.length}
              </span>
            )}
          </button>

          {/* Import */}
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-700 transition-all shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">{translate(lang, 'header.import')}</span>
          </button>

          {/* Export */}
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{translate(lang, 'header.export')}</span>
          </button>

          <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700 mx-0.5" />

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={handleToggleTheme}
            title={translate(lang, 'header.theme')}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Reset to Default */}
          <button
            type="button"
            onClick={handleReset}
            title={translate(lang, 'header.reset')}
            className="p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Modals */}
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
      <ImportHtmlModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
      <SavedVersionsModal isOpen={isVersionsModalOpen} onClose={() => setIsVersionsModalOpen(false)} />
    </>
  );
};
