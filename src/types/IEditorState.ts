export interface IEditorState {
  activeTemplateId: string;
  activeAccentColor: string;
  activeFontFamily: string;
  activePaperSize: 'letter' | 'a4';
  zoomLevelPercentage: number;
  isSidebarCollapsed: boolean;
  activeSidebarTab: string;
  currentLanguage: 'fr' | 'en';
  editorTheme: 'light' | 'dark';
  activeSection?: string | null;
  focusedSource?: 'preview' | 'sidebar' | null;
  isDualViewMode?: boolean;
}
