'use client';

import React, { useEffect } from 'react';
import { useResumeStore } from '@/store';
import { EditorHeader, EditorSidebar, WorkspaceCanvas } from '@/components';

export default function ResumeEditorPage() {
  const { resumeData, editorState, autoSaveCurrentDraft } = useResumeStore();

  // Debounced auto-save draft into saved versions catalog
  useEffect(() => {
    const timer = setTimeout(() => {
      autoSaveCurrentDraft();
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    resumeData,
    editorState.activeTemplateId,
    editorState.activeAccentColor,
    editorState.activeFontFamily,
    editorState.currentLanguage,
    autoSaveCurrentDraft,
  ]);

  // Global Escape key listener to deselect active section
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        useResumeStore.getState().setActiveSection(null);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);


  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <EditorHeader />
      <div className="flex flex-1 overflow-hidden relative">
        <EditorSidebar />
        <WorkspaceCanvas />
      </div>
    </div>
  );
}
