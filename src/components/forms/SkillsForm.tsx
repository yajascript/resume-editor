'use client';

import React, { useState } from 'react';
import { useResumeStore } from '@/store';
import { translate } from '@/i18n';
import { Plus, X, ArrowUp, ArrowDown } from 'lucide-react';

export const SkillsForm: React.FC = () => {
  const { resumeData, addSkill, updateSkill, removeSkill, reorderSkill, editorState } =
    useResumeStore();
  const { skillsList } = resumeData;
  const lang = editorState.currentLanguage;
  const [newSkillText, setNewSkillText] = useState('');

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillText.trim()) {
      addSkill(newSkillText.trim());
      setNewSkillText('');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Quick Add Input */}
      <form onSubmit={handleAddSkill} className="flex gap-2">
        <input
          type="text"
          value={newSkillText}
          onChange={(e) => setNewSkillText(e.target.value)}
          placeholder={translate(lang, 'skills.placeholder')}
          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!newSkillText.trim()}
          className="px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-lg shrink-0 flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          {translate(lang, 'skills.add')}
        </button>
      </form>

      {/* List of Skills */}
      <div className="flex flex-col gap-2">
        {skillsList.map((skill, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60"
          >
            <input
              type="text"
              value={skill}
              onChange={(e) => updateSkill(index, e.target.value)}
              className="grow px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
            <button
              type="button"
              disabled={index === 0}
              onClick={() => reorderSkill(index, index - 1)}
              className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={index === skillsList.length - 1}
              onClick={() => reorderSkill(index, index + 1)}
              className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => removeSkill(index)}
              className="p-1 text-red-500 hover:text-red-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
