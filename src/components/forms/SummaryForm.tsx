'use client';

import React from 'react';
import { useResumeStore } from '@/store';
import { translate } from '@/i18n';

export const SummaryForm: React.FC = () => {
  const { resumeData, updateProfileSummary, editorState } = useResumeStore();
  const { profileSummary } = resumeData;
  const lang = editorState.currentLanguage;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-1">
        <label className="font-semibold text-slate-700 dark:text-slate-300">
          {translate(lang, 'summary.title')}
        </label>
        <span>{translate(lang, 'summary.characterCount', { count: profileSummary.length })}</span>
      </div>
      <textarea
        rows={5}
        value={profileSummary}
        onChange={(e) => updateProfileSummary(e.target.value)}
        placeholder={translate(lang, 'summary.placeholder')}
        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all leading-relaxed"
      />
    </div>
  );
};
