'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useResumeStore } from '@/store';
import { translate } from '@/i18n';
import {
  ContactForm,
  SummaryForm,
  ExperienceForm,
  EducationForm,
  SkillsForm,
  LanguagesForm,
  CertificationsForm,
  ProjectsForm,
  CustomSectionsForm,
  SectionOrderForm,
  AppearanceForm,
} from '../forms';
import {
  User,
  AlignLeft,
  Briefcase,
  GraduationCap,
  Sparkles,
  Languages,
  Award,
  FolderGit2,
  PlusSquare,
  ChevronDown,
  ChevronRight,
  Layers,
  Palette,
  FileText,
  PanelLeftClose,
  PanelLeftOpen,
  Globe,
} from 'lucide-react';

const MIN_SIDEBAR_WIDTH = 360;
const MAX_SIDEBAR_WIDTH = 750;
const DEFAULT_SIDEBAR_WIDTH = 480;

export const EditorSidebar: React.FC = () => {
  const { editorState, setActiveSidebarTab, toggleSidebar, setActiveSection, setLanguage } = useResumeStore();
  const lang = editorState.currentLanguage;
  const isCollapsed = editorState.isSidebarCollapsed;

  const [sidebarWidth, setSidebarWidth] = useState<number>(DEFAULT_SIDEBAR_WIDTH);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const isResizingRef = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    contact: true,
    summary: false,
    experience: false,
    education: false,
    skills: false,
    languages: false,
    certifications: false,
    projects: false,
    custom: false,
  });

  // Sync when right preview is clicked -> expand accordion and scroll sidebar into view
  useEffect(() => {
    if (editorState.activeSection && editorState.focusedSource === 'preview') {
      if (editorState.activeSidebarTab !== 'content') {
        setActiveSidebarTab('content');
      }
      setOpenSections((prev) => ({ ...prev, [editorState.activeSection!]: true }));

      // Wait a tick for DOM expansion then smoothly scroll to section
      const timer = setTimeout(() => {
        const elem = document.getElementById(`sidebar-section-${editorState.activeSection}`);
        const container = scrollContainerRef.current;
        if (elem && container) {
          const targetTop = elem.offsetTop - 12;
          container.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
      }, 80);

      return () => clearTimeout(timer);
    }
  }, [editorState.activeSection, editorState.focusedSource, editorState.activeSidebarTab, setActiveSidebarTab]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    isResizingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizingRef.current) return;
    const newWidth = Math.min(Math.max(e.clientX, MIN_SIDEBAR_WIDTH), MAX_SIDEBAR_WIDTH);
    setSidebarWidth(newWidth);
  }, []);

  const handleMouseUp = useCallback(() => {
    if (isResizingRef.current) {
      isResizingRef.current = false;
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const contentAccordionItems = [
    { key: 'contact', title: translate(lang, 'sidebar.contact'), icon: User, component: ContactForm },
    { key: 'summary', title: translate(lang, 'sidebar.summary'), icon: AlignLeft, component: SummaryForm },
    { key: 'experience', title: translate(lang, 'sidebar.experience'), icon: Briefcase, component: ExperienceForm },
    { key: 'education', title: translate(lang, 'sidebar.education'), icon: GraduationCap, component: EducationForm },
    { key: 'skills', title: translate(lang, 'sidebar.skills'), icon: Sparkles, component: SkillsForm },
    { key: 'languages', title: translate(lang, 'sidebar.languages'), icon: Languages, component: LanguagesForm },
    { key: 'certifications', title: translate(lang, 'sidebar.certifications'), icon: Award, component: CertificationsForm },
    { key: 'projects', title: translate(lang, 'sidebar.projects'), icon: FolderGit2, component: ProjectsForm },
    { key: 'custom', title: translate(lang, 'sidebar.customSections'), icon: PlusSquare, component: CustomSectionsForm },
  ];

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-3 z-20 shrink-0">
        <button
          type="button"
          onClick={toggleSidebar}
          title={translate(lang, 'sidebar.tabs.content')}
          className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <PanelLeftOpen className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <aside
      style={{ width: `${sidebarWidth}px` }}
      className="relative bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-[calc(100vh-3.25rem)] z-20 shrink-0 select-none"
    >
      {/* Top Sidebar Header & Tabs */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full mr-2">
            <button
              type="button"
              onClick={() => setActiveSidebarTab('content')}
              className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${editorState.activeSidebarTab === 'content'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{translate(lang, 'sidebar.tabs.content')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSidebarTab('sections')}
              className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${editorState.activeSidebarTab === 'sections'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{translate(lang, 'sidebar.tabs.sections')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSidebarTab('appearance')}
              className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${editorState.activeSidebarTab === 'appearance'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>{translate(lang, 'sidebar.tabs.appearance')}</span>
            </button>
          </div>

        </div>

        {/* Clean Language Selector (English First) */}
        <div className="flex items-center justify-between px-1 pt-1 text-xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            {translate(lang, 'sidebar.switchLanguage')}:
          </span>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-0.5 text-[11px] font-bold rounded-md transition-all ${
                lang === 'en'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('fr')}
              className={`px-2.5 py-0.5 text-[11px] font-bold rounded-md transition-all ${
                lang === 'fr'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60'
              }`}
            >
              FR
            </button>
          </div>
        </div>
      </div>



      {/* Main Content Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5 scroll-smooth"
      >
        {editorState.activeSidebarTab === 'content' && (
          <div className="flex flex-col gap-2">
            {contentAccordionItems.map(({ key, title, icon: Icon, component: Component }) => {
              const isOpen = openSections[key];
              const isSectionActive = editorState.activeSection === key;

              return (
                <div
                  id={`sidebar-section-${key}`}
                  key={key}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${isSectionActive
                      ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-50/10 dark:bg-blue-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                    }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      toggleSection(key);
                      setActiveSection(key, 'sidebar');
                    }}
                    className="w-full px-3.5 py-3 text-left flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>{title}</span>
                    </div>
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {isOpen && (
                    <div
                      className="p-3.5 pt-1 border-t border-slate-100 dark:border-slate-800 animate-fadeIn"
                      onFocus={() => setActiveSection(key, 'sidebar')}
                    >
                      <Component />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {editorState.activeSidebarTab === 'sections' && <SectionOrderForm />}

        {editorState.activeSidebarTab === 'appearance' && <AppearanceForm />}
      </div>

      {/* Resizable Handle on Right Edge */}
      <div
        onMouseDown={handleMouseDown}
        className={`absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-blue-500/50 active:bg-blue-600 transition-colors z-30 group flex items-center justify-center ${isResizing ? 'bg-blue-600' : ''
          }`}
        title="Drag to resize sidebar width"
      >
        <div className="w-0.5 h-6 bg-slate-300 dark:bg-slate-700 rounded-full group-hover:bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </aside>
  );
};
