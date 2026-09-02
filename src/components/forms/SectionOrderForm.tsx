'use client';

import React from 'react';
import { useResumeStore } from '@/store';
import { translate } from '@/i18n';
import { Eye, EyeOff, GripVertical, Scissors } from 'lucide-react';

export const SectionOrderForm: React.FC = () => {
  const { resumeData, toggleSectionVisibility, toggleSectionPageBreak, reorderSections, editorState } = useResumeStore();
  const { sectionOrder, sectionVisibility, sectionPageBreaks = {} } = resumeData;
  const lang = editorState.currentLanguage;

  const getSectionTitle = (key: string): string => {
    switch (key) {
      case 'profile':
        return translate(lang, 'resume.sections.profile');
      case 'education':
        return translate(lang, 'resume.sections.education');
      case 'projects':
        return translate(lang, 'resume.sections.projects');
      case 'experience':
        return translate(lang, 'resume.sections.experience');
      case 'skills':
        return translate(lang, 'resume.sections.skills');
      case 'languages':
        return translate(lang, 'resume.sections.languages');
      case 'certifications':
        return translate(lang, 'resume.sections.certifications');
      default:
        return key;
    }
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sectionOrder.length) return;
    const nextOrder = [...sectionOrder];
    const [moved] = nextOrder.splice(index, 1);
    nextOrder.splice(targetIndex, 0, moved);
    reorderSections(nextOrder);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {translate(lang, 'sections.manageTitle')}
      </p>

      <div className="flex flex-col gap-2">
        {sectionOrder.map((sectionKey, index) => {
          const isVisible = sectionVisibility[sectionKey] ?? true;
          const isPageBreak = !!sectionPageBreaks[sectionKey];
          return (
            <div
              key={sectionKey}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                isVisible
                  ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {getSectionTitle(sectionKey)}
                </span>
                {isPageBreak && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-medium border border-blue-200 dark:border-blue-800 shrink-0">
                    📄 Break
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleSectionPageBreak(sectionKey)}
                  className={`p-1.5 rounded text-xs flex items-center gap-1 transition-all ${
                    isPageBreak
                      ? 'text-blue-700 bg-blue-100 dark:bg-blue-900/60 dark:text-blue-300 font-bold'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title={translate(lang, 'pageBreak.toggleBeforeSection')}
                >
                  <Scissors className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => toggleSectionVisibility(sectionKey)}
                  className={`p-1.5 rounded text-xs flex items-center gap-1 transition-all ${
                    isVisible
                      ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100'
                      : 'text-slate-400 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300'
                  }`}
                  title={translate(lang, 'sections.visibilityToggle')}
                >
                  {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span className="text-[10.5px]">
                    {isVisible
                      ? translate(lang, 'sections.visible')
                      : translate(lang, 'sections.hidden')}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
