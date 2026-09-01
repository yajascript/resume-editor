'use client';

import React from 'react';
import { useResumeStore } from '@/store';
import { translate } from '@/i18n';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

export const CertificationsForm: React.FC = () => {
  const {
    resumeData,
    addCertification,
    updateCertification,
    removeCertification,
    reorderCertifications,
    editorState,
  } = useResumeStore();
  const { certificationsList } = resumeData;
  const lang = editorState.currentLanguage;

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => addCertification()}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
      >
        <Plus className="w-4 h-4" />
        {translate(lang, 'certifications.add')}
      </button>

      <div className="flex flex-col gap-3">
        {certificationsList.map((cert, index) => (
          <div
            key={cert.identifier}
            className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex flex-col gap-2.5"
          >
            <div className="flex justify-between items-center gap-2">
              <input
                type="text"
                value={cert.certificationName}
                onChange={(e) =>
                  updateCertification(cert.identifier, 'certificationName', e.target.value)
                }
                placeholder={translate(lang, 'certifications.name')}
                className="grow px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => reorderCertifications(index, index - 1)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-20 transition-colors"
                  title="Move Up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === certificationsList.length - 1}
                  onClick={() => reorderCertifications(index, index + 1)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-20 transition-colors"
                  title="Move Down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeCertification(cert.identifier)}
                  className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors ml-0.5"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <input
                type="text"
                value={cert.issuingOrganization || ''}
                onChange={(e) =>
                  updateCertification(cert.identifier, 'issuingOrganization', e.target.value)
                }
                placeholder={translate(lang, 'certifications.organization')}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={cert.issueYear || ''}
                onChange={(e) =>
                  updateCertification(cert.identifier, 'issueYear', e.target.value)
                }
                placeholder={translate(lang, 'certifications.year')}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
