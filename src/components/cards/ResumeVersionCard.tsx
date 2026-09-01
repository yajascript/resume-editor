'use client';

import React from 'react';
import { ISavedVersion } from '@/types';
import { translate, SupportedLanguage } from '@/i18n';
import { TemplatePreviewThumbnail } from '@/components/editor/TemplatePreviewThumbnail';
import { Trash2, Clock, Copy, ArrowUpRight } from 'lucide-react';

interface ResumeVersionCardProps {
  version: ISavedVersion;
  isActive: boolean;
  language: SupportedLanguage;
  onSelect: (versionId: string, versionName: string) => void;
  onDelete: (versionId: string, versionName: string, event: React.MouseEvent) => void;
  onDuplicate?: (versionId: string, event: React.MouseEvent) => void;
}

export const ResumeVersionCard: React.FC<ResumeVersionCardProps> = ({
  version,
  isActive,
  language,
  onSelect,
  onDelete,
  onDuplicate,
}) => {
  const isBilingual = !!version.frenchResumeData && !!version.englishResumeData;

  return (
    <div
      onClick={() => onSelect(version.identifier, version.versionName)}
      className={`group rounded-3xl border p-4 bg-white dark:bg-slate-900 transition-all duration-200 flex flex-col gap-3.5 relative cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-0.5 ${
        isActive
          ? 'border-blue-500 ring-2 ring-blue-500/25 bg-blue-50/20 dark:bg-blue-950/30'
          : 'border-slate-200 dark:border-slate-800/90 hover:border-blue-400 dark:hover:border-blue-500/80'
      }`}
    >
      {/* Thumbnail Container */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-inner bg-slate-100 dark:bg-slate-950 group-hover:scale-[1.01] transition-transform duration-200 aspect-[16/10] flex items-center justify-center">
        <TemplatePreviewThumbnail
          templateId={version.editorState.activeTemplateId}
          accentColor={version.editorState.activeAccentColor}
        />

        {/* Language Badge Over Thumbnail */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          {isBilingual ? (
            <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-lg bg-slate-900/90 text-white backdrop-blur-md shadow-md border border-white/10 flex items-center gap-1">
              <span>EN & FR</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-lg bg-slate-900/90 text-white backdrop-blur-md shadow-md border border-white/10">
              {version.editorState.currentLanguage.toUpperCase()}
            </span>
          )}
        </div>

        {/* Quick Open Overlay on hover */}
        <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
          <span className="px-3.5 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 text-blue-600 dark:text-blue-400 font-bold text-xs shadow-xl flex items-center gap-1.5">
            <span>{translate(language, 'versions.loadButton')}</span>
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Metadata & Title */}
      <div className="flex flex-col gap-1.5 grow">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {version.versionName}
        </h4>

        {/* Candidate Name & Job Title */}
        <div className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {version.resumeData.contactInformation.fullName || 'Untitled Candidate'}
          </span>
          {version.resumeData.contactInformation.jobTitle && (
            <span className="text-slate-400 dark:text-slate-500">
              {' • '}{version.resumeData.contactInformation.jobTitle}
            </span>
          )}
        </div>

        {/* Footer info & action buttons */}
        <div className="mt-auto pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{translate(language, 'versions.savedOn', { date: version.createdAt })}</span>
          </div>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {onDuplicate && (
              <button
                type="button"
                onClick={(e) => onDuplicate(version.identifier, e)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                title={translate(language, 'versions.duplicateButton')}
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={(e) => onDelete(version.identifier, version.versionName, e)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
              title={translate(language, 'versions.deleteButton')}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
