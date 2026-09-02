'use client';

import React, { useState } from 'react';
import { useResumeStore } from '@/store';
import { translate } from '@/i18n';
import { Plus, Trash2, PlusCircle, X, ChevronUp, ChevronDown, Scissors } from 'lucide-react';

export const CustomSectionsForm: React.FC = () => {
  const {
    resumeData,
    addCustomSection,
    removeCustomSection,
    updateCustomSectionTitle,
    reorderCustomSections,
    addCustomSectionItem,
    updateCustomSectionItem,
    removeCustomSectionItem,
    reorderCustomSectionItem,
    toggleItemPageBreak,
    editorState,
  } = useResumeStore();
  const { customSectionsList } = resumeData;
  const lang = editorState.currentLanguage;
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSectionTitle.trim()) {
      addCustomSection(newSectionTitle.trim());
      setNewSectionTitle('');
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Create Section Input */}
      <form onSubmit={handleAddSection} className="flex gap-2">
        <input
          type="text"
          value={newSectionTitle}
          onChange={(e) => setNewSectionTitle(e.target.value)}
          placeholder={translate(lang, 'custom.sectionName')}
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!newSectionTitle.trim()}
          className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-xl shrink-0 flex items-center gap-1 shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          {translate(lang, 'custom.addSection')}
        </button>
      </form>

      {/* Sections List */}
      <div className="flex flex-col gap-5">
        {customSectionsList.map((sec, secIndex) => (
          <div
            key={sec.identifier}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex flex-col gap-3.5"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700 gap-2">
              <input
                type="text"
                value={sec.sectionTitle}
                onChange={(e) => updateCustomSectionTitle(sec.identifier, e.target.value)}
                className="grow px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleItemPageBreak('custom', sec.identifier)}
                  title={translate(lang, 'pageBreak.toggleBeforeSection')}
                  className={`p-1 rounded transition-colors ${
                    sec.pageBreakBefore
                      ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-bold'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  <Scissors className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={secIndex === 0}
                  onClick={() => reorderCustomSections(secIndex, secIndex - 1)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-20 transition-colors"
                  title="Move Section Up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={secIndex === customSectionsList.length - 1}
                  onClick={() => reorderCustomSections(secIndex, secIndex + 1)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-20 transition-colors"
                  title="Move Section Down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeCustomSection(sec.identifier)}
                  className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 ml-1 transition-colors"
                  title="Remove Section"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-2.5">
              {(sec.items || []).map((item, itemIndex) => (
                <div
                  key={item.identifier}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center gap-2">
                    <input
                      type="text"
                      value={item.itemTitle}
                      onChange={(e) =>
                        updateCustomSectionItem(sec.identifier, item.identifier, 'itemTitle', e.target.value)
                      }
                      placeholder={translate(lang, 'custom.itemTitle')}
                      className="grow px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleItemPageBreak('custom', sec.identifier, item.identifier)}
                        title={translate(lang, 'pageBreak.toggleBefore')}
                        className={`p-1 rounded transition-colors ${
                          item.pageBreakBefore
                            ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-bold'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                        }`}
                      >
                        <Scissors className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={itemIndex === 0}
                        onClick={() => reorderCustomSectionItem(sec.identifier, itemIndex, itemIndex - 1)}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-20 transition-colors"
                        title="Move Item Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={itemIndex === (sec.items?.length || 1) - 1}
                        onClick={() => reorderCustomSectionItem(sec.identifier, itemIndex, itemIndex + 1)}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-20 transition-colors"
                        title="Move Item Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeCustomSectionItem(sec.identifier, item.identifier)}
                        className="p-1 text-slate-400 hover:text-red-500 ml-1 transition-colors"
                        title="Remove Item"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={item.itemSubtitle || ''}
                    onChange={(e) =>
                      updateCustomSectionItem(sec.identifier, item.identifier, 'itemSubtitle', e.target.value)
                    }
                    placeholder={translate(lang, 'custom.itemSubtitle')}
                    className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() => addCustomSectionItem(sec.identifier)}
                className="py-2 px-3 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 border border-dashed border-blue-300 dark:border-blue-800 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                {translate(lang, 'custom.addItem')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
