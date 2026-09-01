'use client';

import React, { useState } from 'react';
import { useResumeStore } from '@/store';
import { translate } from '@/i18n';
import { Plus, X, ArrowUp, ArrowDown } from 'lucide-react';

export const LanguagesForm: React.FC = () => {
  const { resumeData, addLanguage, updateLanguage, removeLanguage, reorderLanguages, editorState } =
    useResumeStore();
  const { languagesList } = resumeData;
  const lang = editorState.currentLanguage;
  const [newLangText, setNewLangText] = useState('');

  const handleAddLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLangText.trim()) {
      addLanguage(newLangText.trim());
      setNewLangText('');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleAddLanguage} className="flex gap-2">
        <input
          type="text"
          value={newLangText}
          onChange={(e) => setNewLangText(e.target.value)}
          placeholder={translate(lang, 'languages.placeholder')}
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!newLangText.trim()}
          className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-xl shrink-0 flex items-center gap-1 shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          {translate(lang, 'languages.add')}
        </button>
      </form>

      <div className="flex flex-col gap-2">
        {languagesList.map((language, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60"
          >
            <input
              type="text"
              value={language}
              onChange={(e) => updateLanguage(index, e.target.value)}
              className="grow px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
            <button
              type="button"
              disabled={index === 0}
              onClick={() => reorderLanguages(index, index - 1)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30 transition-colors"
              title="Move Up"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={index === languagesList.length - 1}
              onClick={() => reorderLanguages(index, index + 1)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30 transition-colors"
              title="Move Down"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => removeLanguage(index)}
              className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Remove"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
