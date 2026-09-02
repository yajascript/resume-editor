'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useResumeStore } from '@/store';
import { translate } from '@/i18n';
import { SmartResumeParser } from '@/utils';
import { initialFrenchResumeData, initialEnglishResumeData } from '@/store/defaultResumeData';
import {
  FileCode,
  FileJson,
  AlignLeft,
  Upload,
  X,
  Sparkles,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface ImportHtmlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportHtmlModal: React.FC<ImportHtmlModalProps> = ({ isOpen, onClose }) => {
  const { setResumeData, setLanguage, editorState } = useResumeStore();
  const lang = editorState.currentLanguage;

  const [targetLang, setTargetLang] = useState<'en' | 'fr'>(editorState.currentLanguage);
  const [activeTab, setActiveTab] = useState<'html' | 'json' | 'text'>('html');
  const [inputText, setInputText] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync default target language when modal opens
  useEffect(() => {
    if (isOpen) {
      setTargetLang(editorState.currentLanguage);
      setSuccessMessage(null);
      setErrorMessage(null);
    }
  }, [isOpen, editorState.currentLanguage]);

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

  const handleImportAndApply = () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!inputText.trim()) {
      setErrorMessage(translate(lang, 'import.error'));
      return;
    }

    try {
      const parsedData = SmartResumeParser.parse(inputText);
      setResumeData(parsedData);
      setLanguage(targetLang);
      const langLabel = targetLang === 'en' ? 'English' : 'Français';
      setSuccessMessage(translate(lang, 'import.successLanguage', { language: langLabel }));
      setTimeout(() => {
        onClose();
        setSuccessMessage(null);
      }, 1000);
    } catch (err) {
      console.error(err);
      setErrorMessage(translate(lang, 'import.error'));
    }
  };

  const handleLoadSampleFrench = () => {
    setResumeData(structuredClone(initialFrenchResumeData));
    setLanguage('fr');
    setSuccessMessage(translate(lang, 'import.successLanguage', { language: 'Français' }));
    setTimeout(() => {
      onClose();
      setSuccessMessage(null);
    }, 800);
  };

  const handleLoadSampleEnglish = () => {
    setResumeData(structuredClone(initialEnglishResumeData));
    setLanguage('en');
    setSuccessMessage(translate(lang, 'import.successLanguage', { language: 'English' }));
    setTimeout(() => {
      onClose();
      setSuccessMessage(null);
    }, 800);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      setInputText(content);
      if (file.name.endsWith('.json')) {
        setActiveTab('json');
      } else if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
        setActiveTab('html');
      } else {
        setActiveTab('text');
      }
    } catch (err) {
      setErrorMessage(translate(lang, 'import.error'));
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {translate(lang, 'import.modalTitle')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {translate(lang, 'import.modalSubtitle')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Language Selection */}
        <div className="flex flex-col gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {translate(lang, 'import.targetLanguage')}:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTargetLang('en')}
              className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                targetLang === 'en'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 border-blue-400 dark:border-blue-500 shadow-xs ring-2 ring-blue-500/20'
                  : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700'
              }`}
            >
              <span className="text-base">🇺🇸</span>
              <span>{translate(lang, 'import.targetEn')}</span>
            </button>

            <button
              type="button"
              onClick={() => setTargetLang('fr')}
              className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                targetLang === 'fr'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 border-blue-400 dark:border-blue-500 shadow-xs ring-2 ring-blue-500/20'
                  : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700'
              }`}
            >
              <span className="text-base">🇫🇷</span>
              <span>{translate(lang, 'import.targetFr')}</span>
            </button>
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleLoadSampleFrench}
            className="py-1.5 px-3 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-all text-center cursor-pointer"
          >
            🇫🇷 {translate(lang, 'import.loadSampleFrench')}
          </button>
          <button
            type="button"
            onClick={handleLoadSampleEnglish}
            className="py-1.5 px-3 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-all text-center cursor-pointer"
          >
            🇬🇧 {translate(lang, 'import.loadSampleEnglish')}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('html')}
            className={`flex items-center gap-1.5 py-2 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'html'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            {translate(lang, 'import.tabHtml')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-1.5 py-2 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'json'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            {translate(lang, 'import.tabJson')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-1.5 py-2 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'text'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
            {translate(lang, 'import.tabText')}
          </button>
        </div>

        {/* Text Area */}
        <div className="flex flex-col gap-2">
          <textarea
            rows={6}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              activeTab === 'html'
                ? translate(lang, 'import.htmlPlaceholder')
                : activeTab === 'json'
                ? translate(lang, 'import.jsonPlaceholder')
                : translate(lang, 'import.textPlaceholder')
            }
            className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload file</span>
              <input
                type="file"
                accept=".html,.htm,.json,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Alerts */}
        {successMessage && (
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
          >
            {translate(lang, 'import.close')}
          </button>
          <button
            type="button"
            onClick={handleImportAndApply}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            {translate(lang, 'import.parseButton')}
          </button>
        </div>
      </div>
    </div>
  );
};
