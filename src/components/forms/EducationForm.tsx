'use client';

import React, { useState } from 'react';
import { useResumeStore } from '@/store';
import { translate } from '@/i18n';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Sparkles,
  ClipboardList,
  Check,
  X,
  GraduationCap,
  Building,
  Calendar,
  MapPin,
  BookOpen,
  Scissors,
} from 'lucide-react';

export const EducationForm: React.FC = () => {
  const {
    resumeData,
    addEducation,
    updateEducation,
    removeEducation,
    reorderEducation,
    reorderEducationBullets,
    toggleItemPageBreak,
    editorState,
  } = useResumeStore();
  const { educationList } = resumeData;
  const lang = editorState.currentLanguage;

  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (educationList.length > 0) {
      initial[educationList[0].identifier] = true;
    }
    return initial;
  });

  const [fastPasteState, setFastPasteState] = useState<{ id: string; text: string } | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleApplyFastPaste = (eduId: string) => {
    if (!fastPasteState || fastPasteState.id !== eduId) return;
    const lines = fastPasteState.text
      .split('\n')
      .map((l) => l.replace(/^[-*•\d.)\s]+/, '').trim())
      .filter(Boolean);

    if (lines.length > 0) {
      updateEducation(eduId, 'bulletPoints', lines);
    }
    setFastPasteState(null);
  };

  const handleAddNew = () => {
    const newId = `edu-${Date.now()}`;
    addEducation({ identifier: newId });
    setExpandedIds((prev) => ({ ...prev, [newId]: true }));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Add Action */}
      <button
        type="button"
        onClick={handleAddNew}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      >
        <Plus className="w-4 h-4" />
        {translate(lang, 'education.add')}
      </button>

      {/* Education Cards List */}
      <div className="flex flex-col gap-3.5">
        {educationList.map((edu, index) => {
          const isExpanded = expandedIds[edu.identifier] ?? (index === 0);
          const isFastPasting = fastPasteState?.id === edu.identifier;
          const displayDegree = (edu.degreeName || '').trim() || translate(lang, 'education.degree');
          const displayInstitution = (edu.institutionName || '').trim() || translate(lang, 'education.institution');
          const dateRange = [edu.startDate, edu.endDate].filter(Boolean).join(' – ');

          return (
            <div
              key={edu.identifier || index}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? 'border-blue-300 dark:border-blue-900/60 bg-white dark:bg-slate-900 shadow-md ring-1 ring-blue-500/10'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Card Header (Accordion trigger) */}
              <div
                className="p-4 cursor-pointer select-none bg-gradient-to-r from-transparent via-transparent to-slate-50/50 dark:to-slate-800/20 flex flex-col gap-1.5"
                onClick={() => toggleExpand(edu.identifier)}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="flex items-center justify-center w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-950 text-[10px] font-bold text-blue-700 dark:text-blue-300 shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {displayDegree}
                    </span>
                    {edu.pageBreakBefore && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-medium border border-blue-200 dark:border-blue-800 shrink-0">
                        📄 Break
                      </span>
                    )}
                  </div>

                  {/* Reorder, Page Break and Delete Controls */}
                  <div
                    className="flex items-center gap-1 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => toggleItemPageBreak('education', edu.identifier)}
                      title={translate(lang, 'pageBreak.toggleBefore')}
                      className={`p-1 rounded transition-colors ${
                        edu.pageBreakBefore
                          ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-bold'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Scissors className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => reorderEducation(index, index - 1)}
                      title="Move Up"
                      className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-20 transition-colors"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === educationList.length - 1}
                      onClick={() => reorderEducation(index, index + 1)}
                      title="Move Down"
                      className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-20 transition-colors"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeEducation(edu.identifier)}
                      title={translate(lang, 'education.remove')}
                      className="p-1 rounded text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors ml-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="p-1 text-slate-400">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-blue-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pl-7">
                  <span className="font-medium truncate">@ {displayInstitution}</span>
                  {dateRange && <span>• {dateRange}</span>}
                </div>
              </div>

              {/* Card Body (Expanded) */}
              {isExpanded && (
                <div className="p-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3.5">
                  {/* Degree Name */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                      {translate(lang, 'education.degree')}
                    </label>
                    <input
                      type="text"
                      value={edu.degreeName}
                      onChange={(e) => updateEducation(edu.identifier, 'degreeName', e.target.value)}
                      placeholder="e.g. Bachelor of Science in Engineering"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Institution Name */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-blue-500" />
                      {translate(lang, 'education.institution')}
                    </label>
                    <input
                      type="text"
                      value={edu.institutionName}
                      onChange={(e) => updateEducation(edu.identifier, 'institutionName', e.target.value)}
                      placeholder="e.g. State University of Technology"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Specialization / Major */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      {translate(lang, 'education.specialization')}
                    </label>
                    <input
                      type="text"
                      value={edu.specialization || ''}
                      onChange={(e) => updateEducation(edu.identifier, 'specialization', e.target.value)}
                      placeholder="e.g. Structural Systems & Construction Engineering"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Page Break Before Checkbox */}
                  <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-medium text-slate-700 dark:text-slate-300 py-1">
                    <input
                      type="checkbox"
                      checked={!!edu.pageBreakBefore}
                      onChange={() => toggleItemPageBreak('education', edu.identifier)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                    />
                    <Scissors className="w-3.5 h-3.5 text-blue-500" />
                    <span>{translate(lang, 'pageBreak.toggleBefore')}</span>
                  </label>

                  {/* Location & Dates */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {translate(lang, 'education.startDate')}
                      </label>
                      <input
                        type="text"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.identifier, 'startDate', e.target.value)}
                        placeholder="e.g. 2018"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {translate(lang, 'education.endDate')}
                      </label>
                      <input
                        type="text"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.identifier, 'endDate', e.target.value)}
                        placeholder="e.g. 2022"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {translate(lang, 'education.location')}
                    </label>
                    <input
                      type="text"
                      value={edu.locationName || ''}
                      onChange={(e) => updateEducation(edu.identifier, 'locationName', e.target.value)}
                      placeholder="e.g. Boston, MA"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Bullet Points Section */}
                  <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        {translate(lang, 'education.bullets')}
                      </label>

                      <div className="flex items-center gap-2">
                        {/* Fast Paste Toggle */}
                        <button
                          type="button"
                          onClick={() => {
                            if (isFastPasting) {
                              setFastPasteState(null);
                            } else {
                              setFastPasteState({
                                id: edu.identifier,
                                text: (edu.bulletPoints || []).join('\n'),
                              });
                            }
                          }}
                          className="text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 transition-colors"
                        >
                          <ClipboardList className="w-3.5 h-3.5 text-slate-400" />
                          <span>{translate(lang, 'education.fastPaste')}</span>
                        </button>

                        {/* Add Single Bullet */}
                        <button
                          type="button"
                          onClick={() => {
                            const nextBullets = [...(edu.bulletPoints || []), ''];
                            updateEducation(edu.identifier, 'bulletPoints', nextBullets);
                          }}
                          className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{translate(lang, 'education.addBullet')}</span>
                        </button>
                      </div>
                    </div>

                    {/* Fast Paste Importer View */}
                    {isFastPasting ? (
                      <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 flex flex-col gap-2.5">
                        <div className="text-[11px] font-medium text-blue-800 dark:text-blue-300">
                          {translate(lang, 'education.fastPasteHelp')}
                        </div>
                        <textarea
                          rows={4}
                          value={fastPasteState.text}
                          onChange={(e) =>
                            setFastPasteState({ id: edu.identifier, text: e.target.value })
                          }
                          placeholder="Graduated Magna Cum Laude with 3.9 GPA&#10;President of Civil Engineering Student Association&#10;Cap-stone research published in Journal of Structural Engineering"
                          className="w-full p-2.5 text-xs rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setFastPasteState(null)}
                            className="px-2.5 py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApplyFastPaste(edu.identifier)}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1 shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5" />
                            {translate(lang, 'education.applyBullets')}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Interactive Bullet Points List with Move Up/Down */
                      <div className="flex flex-col gap-2">
                        {(edu.bulletPoints || []).map((bullet, bIdx) => (
                          <div
                            key={bIdx}
                            className="group flex items-start gap-1.5 p-1.5 pl-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-2xs"
                          >
                            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 w-4 pt-1.5 text-center shrink-0 select-none">
                              {bIdx + 1}.
                            </span>

                            <textarea
                              rows={2}
                              value={bullet}
                              onChange={(e) => {
                                const nextBullets = [...(edu.bulletPoints || [])];
                                nextBullets[bIdx] = e.target.value;
                                updateEducation(edu.identifier, 'bulletPoints', nextBullets);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  const nextBullets = [...(edu.bulletPoints || [])];
                                  nextBullets.splice(bIdx + 1, 0, '');
                                  updateEducation(edu.identifier, 'bulletPoints', nextBullets);
                                }
                              }}
                              placeholder={translate(lang, 'education.bulletPlaceholder')}
                              className="grow p-1 text-xs border-0 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-0 resize-y leading-relaxed"
                            />

                            <div className="flex flex-col items-center gap-0.5 shrink-0 pt-0.5">
                              <button
                                type="button"
                                disabled={bIdx === 0}
                                onClick={() => reorderEducationBullets(edu.identifier, bIdx, bIdx - 1)}
                                title="Move Bullet Up"
                                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-20 transition-colors"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={bIdx === (edu.bulletPoints?.length || 1) - 1}
                                onClick={() => reorderEducationBullets(edu.identifier, bIdx, bIdx + 1)}
                                title="Move Bullet Down"
                                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-20 transition-colors"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const nextBullets = (edu.bulletPoints || []).filter((_, i) => i !== bIdx);
                                  updateEducation(edu.identifier, 'bulletPoints', nextBullets);
                                }}
                                title="Remove Bullet"
                                className="p-1 rounded text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
