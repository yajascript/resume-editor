'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useResumeStore } from '@/store';
import { translate } from '@/i18n';
import { ResumeVersionCard } from '@/components/cards';
import {
  BookmarkPlus,
  CheckCircle2,
  X,
  Sparkles,
  Search,
  ShieldCheck,
} from 'lucide-react';

interface SavedVersionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SavedVersionsModal: React.FC<SavedVersionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    savedVersions,
    saveCurrentVersion,
    duplicateVersion,
    loadVersion,
    deleteVersion,
    editorState,
    resumeData,
  } = useResumeStore();

  const lang = editorState.currentLanguage;

  const [versionNameInput, setVersionNameInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = useCallback((text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // Close on Escape key
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!versionNameInput.trim()) return;

    saveCurrentVersion(versionNameInput.trim());
    setVersionNameInput('');
    showToast(translate(lang, 'versions.saveButton') + ' ✓');
  };

  const handleSelect = (id: string, name: string) => {
    loadVersion(id);
    showToast(`"${name}" ${translate(lang, 'versions.activeBadge').toLowerCase()} ✓`);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateVersion(id);
    showToast(translate(lang, 'versions.copySuccess'));
  };

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`${translate(lang, 'versions.deleteConfirm')} ("${name}")`)) {
      deleteVersion(id);
    }
  };

  const filteredVersions = useMemo(() => {
    return savedVersions.filter((ver) => {
      return (
        searchQuery === '' ||
        ver.versionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ver.resumeData.contactInformation.fullName || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [savedVersions, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/65 backdrop-blur-md animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-5xl w-full p-6 md:p-8 shadow-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col gap-6 max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
              <BookmarkPlus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {translate(lang, 'versions.modalTitle')}
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{translate(lang, 'versions.storageBadge')}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {translate(lang, 'versions.modalSubtitle')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            title={translate(lang, 'versions.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div
            className={`p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 border shadow-sm animate-fadeIn shrink-0 ${
              toastMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* Top Save Snapshot Form */}
        <form
          onSubmit={handleSave}
          className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/70 flex items-center gap-3 shrink-0"
        >
          <div className="relative grow">
            <input
              type="text"
              required
              value={versionNameInput}
              onChange={(e) => setVersionNameInput(e.target.value)}
              placeholder={translate(lang, 'versions.versionNamePlaceholder')}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>{translate(lang, 'versions.saveButton')}</span>
          </button>
        </form>


        {/* Search Toolbar */}
        <div className="flex items-center justify-between gap-3 shrink-0">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={translate(lang, 'versions.searchPlaceholder')}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {filteredVersions.length} {filteredVersions.length === 1 ? 'version' : 'versions'}
          </div>
        </div>

        {/* Versions Catalog Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          {savedVersions.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <BookmarkPlus className="w-7 h-7" />
              </div>
              <div className="max-w-md">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {translate(lang, 'versions.savedListTitle')} (0)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {translate(lang, 'versions.noVersions')}
                </p>
              </div>
            </div>
          ) : filteredVersions.length === 0 ? (
            <div className="p-10 text-center border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 text-xs">
              No saved versions match your search query.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-4">
              {filteredVersions.map((ver) => {
                const isCurrentActive =
                  ver.editorState.activeTemplateId === editorState.activeTemplateId &&
                  ver.resumeData.contactInformation.fullName ===
                    resumeData.contactInformation.fullName;

                return (
                  <ResumeVersionCard
                    key={ver.identifier}
                    version={ver}
                    isActive={isCurrentActive}
                    language={lang}
                    onSelect={handleSelect}
                    onDelete={handleDelete}
                    onDuplicate={handleDuplicate}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
