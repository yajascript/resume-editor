'use client';

import React from 'react';

interface TemplatePreviewThumbnailProps {
  templateId: string;
  accentColor?: string;
  className?: string;
}

export const TemplatePreviewThumbnail: React.FC<TemplatePreviewThumbnailProps> = ({
  templateId,
  accentColor,
  className = '',
}) => {
  if (templateId === 'sidebar-navy') {
    return (
      <div
        className={`w-full aspect-[8.5/11] bg-white rounded border border-slate-300 dark:border-slate-700 shadow-sm overflow-hidden flex ${className}`}
      >
        {/* Left Navy Column (32%) */}
        <div
          className="w-[32%] p-2 flex flex-col gap-1.5 shrink-0"
          style={{ backgroundColor: accentColor || '#0b2545' }}
        >
          <div className="h-2 w-3/4 bg-white/90 rounded-sm" />
          <div className="h-1 w-1/2 bg-[#85b9e0] rounded-sm mb-1" />
          <div className="h-[1px] w-full bg-[#2980b9] my-0.5" />

          {/* Contact lines */}
          <div className="space-y-1 my-1">
            <div className="h-1 w-full bg-white/40 rounded-sm" />
            <div className="h-1 w-5/6 bg-white/40 rounded-sm" />
            <div className="h-1 w-4/6 bg-white/40 rounded-sm" />
          </div>

          {/* Skills */}
          <div className="mt-1 pt-1 border-t border-white/20">
            <div className="h-1.5 w-2/3 bg-white/80 rounded-sm mb-1" />
            <div className="space-y-0.5 pl-1">
              <div className="h-1 w-full bg-white/50 rounded-sm" />
              <div className="h-1 w-5/6 bg-white/50 rounded-sm" />
              <div className="h-1 w-4/6 bg-white/50 rounded-sm" />
            </div>
          </div>

          {/* Languages */}
          <div className="mt-1 pt-1 border-t border-white/20">
            <div className="h-1.5 w-1/2 bg-white/80 rounded-sm mb-1" />
            <div className="space-y-0.5 pl-1">
              <div className="h-1 w-4/5 bg-white/50 rounded-sm" />
              <div className="h-1 w-3/5 bg-white/50 rounded-sm" />
            </div>
          </div>
        </div>

        {/* Right Main Column (68%) */}
        <div className="w-[68%] p-2.5 flex flex-col gap-2 shrink-0 bg-white">
          {/* Profile Section */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: accentColor || '#1a4473' }}
              />
              <div className="h-1.5 w-12 bg-slate-800 rounded-sm" />
              <div className="h-[1px] grow bg-slate-300" />
            </div>
            <div className="space-y-0.5 pl-3.5">
              <div className="h-1 w-full bg-slate-400/80 rounded-sm" />
              <div className="h-1 w-5/6 bg-slate-400/80 rounded-sm" />
            </div>
          </div>

          {/* Education Section */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: accentColor || '#1a4473' }}
              />
              <div className="h-1.5 w-14 bg-slate-800 rounded-sm" />
              <div className="h-[1px] grow bg-slate-300" />
            </div>
            <div className="space-y-1 pl-3.5">
              <div className="flex justify-between items-center">
                <div className="h-1.5 w-24 bg-slate-800 rounded-sm" />
                <div className="h-1 w-8 bg-slate-400 rounded-sm" />
              </div>
              <div className="h-1 w-20 bg-slate-500 rounded-sm" />
            </div>
          </div>

          {/* Experience Section */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: accentColor || '#1a4473' }}
              />
              <div className="h-1.5 w-16 bg-slate-800 rounded-sm" />
              <div className="h-[1px] grow bg-slate-300" />
            </div>
            <div className="space-y-1 pl-3.5">
              <div className="flex justify-between items-center">
                <div className="h-1.5 w-28 bg-slate-800 rounded-sm" />
                <div className="h-1 w-10 bg-slate-400 rounded-sm" />
              </div>
              <div className="h-1 w-16 bg-slate-500 rounded-sm" />
              <div className="space-y-0.5 pl-1.5">
                <div className="h-1 w-full bg-slate-400/80 rounded-sm" />
                <div className="h-1 w-11/12 bg-slate-400/80 rounded-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (templateId === 'minimal-clean') {
    return (
      <div
        className={`w-full aspect-[8.5/11] bg-white rounded border border-slate-300 dark:border-slate-700 shadow-sm overflow-hidden p-3 flex flex-col gap-2.5 ${className}`}
      >
        {/* Header */}
        <div className="border-b border-slate-200 pb-1.5 flex justify-between items-end">
          <div>
            <div className="h-2.5 w-24 bg-slate-900 rounded-sm" />
            <div
              className="h-1.5 w-16 rounded-sm mt-0.5"
              style={{ backgroundColor: accentColor || '#2563eb' }}
            />
          </div>
          <div className="space-y-0.5 text-right">
            <div className="h-1 w-14 bg-slate-400 rounded-sm ml-auto" />
            <div className="h-1 w-10 bg-slate-400 rounded-sm ml-auto" />
          </div>
        </div>

        {/* Profile */}
        <div>
          <div
            className="h-1.5 w-12 rounded-sm mb-1 pb-0.5 border-b border-slate-200 font-bold"
            style={{ color: accentColor || '#111827' }}
          />
          <div className="space-y-0.5">
            <div className="h-1 w-full bg-slate-500/80 rounded-sm" />
            <div className="h-1 w-4/5 bg-slate-500/80 rounded-sm" />
          </div>
        </div>

        {/* Experience */}
        <div>
          <div
            className="h-1.5 w-16 rounded-sm mb-1 border-b border-slate-200"
            style={{ color: accentColor || '#111827' }}
          />
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="h-1.5 w-24 bg-slate-900 rounded-sm" />
              <div className="h-1 w-10 bg-slate-400 rounded-sm" />
            </div>
            <div className="space-y-0.5 pl-1.5">
              <div className="h-1 w-full bg-slate-400/80 rounded-sm" />
              <div className="h-1 w-5/6 bg-slate-400/80 rounded-sm" />
            </div>
          </div>
        </div>

        {/* Skills Chips */}
        <div className="mt-auto">
          <div
            className="h-1.5 w-14 rounded-sm mb-1 border-b border-slate-200"
            style={{ color: accentColor || '#111827' }}
          />
          <div className="flex flex-wrap gap-1">
            <div className="h-2 w-8 bg-slate-100 border border-slate-200 rounded-sm" />
            <div className="h-2 w-10 bg-slate-100 border border-slate-200 rounded-sm" />
            <div className="h-2 w-7 bg-slate-100 border border-slate-200 rounded-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (templateId === 'modern-split') {
    return (
      <div
        className={`w-full aspect-[8.5/11] bg-white rounded border border-slate-300 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col ${className}`}
      >
        {/* Top Header Banner */}
        <div
          className="p-2 text-white flex justify-between items-center"
          style={{ backgroundColor: accentColor || '#2563eb' }}
        >
          <div>
            <div className="h-2.5 w-24 bg-white rounded-sm" />
            <div className="h-1.5 w-16 bg-white/80 rounded-sm mt-0.5" />
          </div>
          <div className="flex gap-1">
            <div className="h-1.5 w-8 bg-white/40 rounded-sm" />
            <div className="h-1.5 w-10 bg-white/40 rounded-sm" />
          </div>
        </div>

        {/* Dual Column Body */}
        <div className="p-2 grid grid-cols-[65%_35%] gap-2 grow">
          {/* Main Left */}
          <div className="space-y-2">
            <div>
              <div
                className="h-1.5 w-12 rounded-sm mb-1 border-b"
                style={{ borderColor: accentColor || '#2563eb' }}
              />
              <div className="space-y-0.5">
                <div className="h-1 w-full bg-slate-400 rounded-sm" />
                <div className="h-1 w-4/5 bg-slate-400 rounded-sm" />
              </div>
            </div>
            <div>
              <div
                className="h-1.5 w-16 rounded-sm mb-1 border-b"
                style={{ borderColor: accentColor || '#2563eb' }}
              />
              <div className="space-y-0.5">
                <div className="h-1.5 w-20 bg-slate-800 rounded-sm" />
                <div className="h-1 w-full bg-slate-400 rounded-sm" />
                <div className="h-1 w-5/6 bg-slate-400 rounded-sm" />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-2 border-l border-slate-100 pl-1.5">
            <div>
              <div
                className="h-1.5 w-12 rounded-sm mb-1 border-b"
                style={{ borderColor: accentColor || '#2563eb' }}
              />
              <div className="h-1 w-full bg-slate-500 rounded-sm" />
            </div>
            <div>
              <div
                className="h-1.5 w-10 rounded-sm mb-1 border-b"
                style={{ borderColor: accentColor || '#2563eb' }}
              />
              <div className="flex flex-wrap gap-1">
                <div className="h-1.5 w-6 bg-slate-100 border rounded-full" />
                <div className="h-1.5 w-7 bg-slate-100 border rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (templateId === 'executive-classic') {
    return (
      <div
        className={`w-full aspect-[8.5/11] bg-white rounded border border-slate-300 dark:border-slate-700 shadow-sm overflow-hidden p-3 flex flex-col gap-2.5 items-center ${className}`}
      >
        {/* Centered Serif Header */}
        <div className="w-full border-b-2 border-slate-900 pb-1.5 text-center flex flex-col items-center">
          <div className="h-2.5 w-28 bg-slate-900 rounded-sm" />
          <div className="h-1.5 w-16 bg-slate-600 rounded-sm mt-0.5" />
          <div className="h-1 w-36 bg-slate-400 rounded-sm mt-1" />
        </div>

        {/* Profile */}
        <div className="w-full">
          <div className="h-1.5 w-16 bg-slate-800 rounded-sm mx-auto mb-1 border-b border-slate-300 pb-0.5" />
          <div className="space-y-0.5 text-center">
            <div className="h-1 w-full bg-slate-500 rounded-sm" />
            <div className="h-1 w-4/5 bg-slate-500 rounded-sm mx-auto" />
          </div>
        </div>

        {/* Experience */}
        <div className="w-full">
          <div className="h-1.5 w-20 bg-slate-800 rounded-sm mx-auto mb-1 border-b border-slate-300 pb-0.5" />
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="h-1.5 w-24 bg-slate-900 rounded-sm" />
              <div className="h-1 w-10 bg-slate-500 rounded-sm" />
            </div>
            <div className="space-y-0.5 pl-2">
              <div className="h-1 w-full bg-slate-400 rounded-sm" />
              <div className="h-1 w-11/12 bg-slate-400 rounded-sm" />
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="w-full">
          <div className="h-1.5 w-16 bg-slate-800 rounded-sm mx-auto mb-1 border-b border-slate-300 pb-0.5" />
          <div className="flex justify-between items-center">
            <div className="h-1.5 w-20 bg-slate-900 rounded-sm" />
            <div className="h-1 w-8 bg-slate-500 rounded-sm" />
          </div>
        </div>
      </div>
    );
  }

  // Tech Minimalist
  return (
    <div
      className={`w-full aspect-[8.5/11] bg-white rounded border border-slate-300 dark:border-slate-700 shadow-sm overflow-hidden p-2.5 flex flex-col gap-2 font-mono ${className}`}
    >
      {/* Terminal Top Header */}
      <div className="border-b-2 border-slate-900 pb-1.5 flex justify-between items-start">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <div>
            <div className="h-2 w-20 bg-slate-900 rounded-sm" />
            <div className="h-1 w-12 bg-emerald-600 rounded-sm mt-0.5" />
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="h-1 w-12 bg-slate-400 rounded-sm ml-auto" />
          <div className="h-1 w-8 bg-slate-400 rounded-sm ml-auto" />
        </div>
      </div>

      {/* Tech Stack Chip Box */}
      <div className="bg-slate-50 border border-slate-200 p-1.5 rounded flex flex-wrap gap-1">
        <div className="h-1.5 w-8 bg-white border border-slate-300 rounded-sm" />
        <div className="h-1.5 w-10 bg-white border border-slate-300 rounded-sm" />
        <div className="h-1.5 w-7 bg-white border border-slate-300 rounded-sm" />
      </div>

      {/* Experience */}
      <div>
        <div className="h-1.5 w-16 bg-slate-900 rounded-sm mb-1" />
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <div className="h-1.5 w-20 bg-slate-800 rounded-sm" />
            <div className="h-1 w-10 bg-slate-400 rounded-sm" />
          </div>
          <div className="space-y-0.5 pl-1.5 flex items-start gap-1">
            <div className="text-[7px] text-emerald-600 font-bold leading-none">$</div>
            <div className="h-1 grow bg-slate-400 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};
