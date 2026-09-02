import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  IResumeData,
  IContactInformation,
  IExperienceItem,
  IEducationItem,
  IProjectItem,
  ICertificationItem,
  ICustomSection,
  IEditorState,
  ISavedVersion,
} from '@/types';
import { formatTimestamp } from '@/utils';
import { initialFrenchResumeData, initialEnglishResumeData } from './defaultResumeData';

interface ResumeStoreState {
  resumeData: IResumeData;
  frenchResumeData: IResumeData;
  englishResumeData: IResumeData;
  editorState: IEditorState;
  undoHistory: IResumeData[];
  redoHistory: IResumeData[];
  savedVersions: ISavedVersion[];

  // Mutators
  updateField: (path: string, value: any) => void;
  updateContactInformation: (field: keyof IContactInformation, value: string) => void;
  updateProfileSummary: (summary: string) => void;

  // Experience
  addExperience: (item?: Partial<IExperienceItem>) => void;
  updateExperience: (identifier: string, field: keyof IExperienceItem, value: any) => void;
  removeExperience: (identifier: string) => void;
  reorderExperience: (startIndex: number, endIndex: number) => void;

  // Education
  addEducation: (item?: Partial<IEducationItem>) => void;
  updateEducation: (identifier: string, field: keyof IEducationItem, value: any) => void;
  removeEducation: (identifier: string) => void;
  reorderEducation: (startIndex: number, endIndex: number) => void;

  // Projects
  addProject: (item?: Partial<IProjectItem>) => void;
  updateProject: (identifier: string, field: keyof IProjectItem, value: any) => void;
  removeProject: (identifier: string) => void;
  reorderProject: (startIndex: number, endIndex: number) => void;

  // Skills & Languages
  addSkill: (skill: string) => void;
  updateSkill: (index: number, value: string) => void;
  removeSkill: (index: number) => void;
  reorderSkill: (startIndex: number, endIndex: number) => void;
  reorderSkills: (startIndex: number, endIndex: number) => void;

  addLanguage: (language: string, level?: string) => void;
  updateLanguage: (index: number, language: string, level?: string) => void;
  removeLanguage: (index: number) => void;
  reorderLanguage: (startIndex: number, endIndex: number) => void;
  reorderLanguages: (startIndex: number, endIndex: number) => void;

  // Certifications
  addCertification: (item?: Partial<ICertificationItem>) => void;
  updateCertification: (identifier: string, field: keyof ICertificationItem, value: any) => void;
  removeCertification: (identifier: string) => void;
  reorderCertification: (startIndex: number, endIndex: number) => void;
  reorderCertifications: (startIndex: number, endIndex: number) => void;

  // Custom Sections
  addCustomSection: (title?: string) => void;
  removeCustomSection: (identifier: string) => void;
  updateCustomSectionTitle: (identifier: string, title: string) => void;
  reorderCustomSection: (startIndex: number, endIndex: number) => void;
  reorderCustomSections: (startIndex: number, endIndex: number) => void;
  addCustomSectionItem: (sectionId: string) => void;
  updateCustomSectionItem: (sectionId: string, itemId: string, field: string, value: any) => void;
  removeCustomSectionItem: (sectionId: string, itemId: string) => void;
  reorderCustomSectionItem: (sectionId: string, startIndex: number, endIndex: number) => void;

  // Bullets Reordering
  reorderExperienceBullets: (expId: string, startIndex: number, endIndex: number) => void;
  reorderEducationBullets: (eduId: string, startIndex: number, endIndex: number) => void;
  reorderProjectBullets: (projId: string, startIndex: number, endIndex: number) => void;

  // Visibility & Order
  toggleSectionVisibility: (sectionKey: string) => void;
  reorderSections: (newOrder: string[]) => void;

  // Page Breaks
  toggleItemPageBreak: (section: 'experience' | 'education' | 'projects' | 'custom', itemId: string, subItemId?: string) => void;
  toggleSectionPageBreak: (sectionKey: string) => void;

  // Editor State
  setResumeData: (data: IResumeData) => void;
  setTemplate: (templateId: string) => void;
  setAccentColor: (colorHex: string) => void;
  setFontFamily: (fontName: string) => void;
  setPaperSize: (paperSize: 'letter' | 'a4') => void;
  setZoomLevel: (zoom: number) => void;
  toggleSidebar: () => void;
  setActiveSidebarTab: (tabName: string) => void;
  setLanguage: (lang: 'fr' | 'en') => void;
  setEditorTheme: (theme: 'light' | 'dark') => void;
  setActiveSection: (sectionKey: string | null, source?: 'preview' | 'sidebar') => void;
  toggleDualViewMode: () => void;
  setDualViewMode: (enabled: boolean) => void;

  // Version Management (Profiles / Snapshots)
  saveCurrentVersion: (versionName: string, description?: string) => string;
  duplicateVersion: (versionId: string) => string;
  autoSaveCurrentDraft: () => void;
  loadVersion: (versionId: string) => void;
  deleteVersion: (versionId: string) => void;
  updateVersionMetadata: (versionId: string, versionName: string, description?: string) => void;
  exportVersionsCatalog: () => string;
  importVersionsCatalog: (jsonString: string) => { success: boolean; count: number; error?: string };

  // History Actions
  undo: () => void;
  redo: () => void;
  resetToDefault: (language?: 'fr' | 'en') => void;
}

const MAX_HISTORY_STEPS = 25;

const initialEditorState: IEditorState = {
  activeTemplateId: 'sidebar-navy',
  activeAccentColor: '#0b2545',
  activeFontFamily: 'Open Sans',
  activePaperSize: 'letter',
  zoomLevelPercentage: 100,
  isSidebarCollapsed: false,
  activeSidebarTab: 'content',
  currentLanguage: 'en',
  editorTheme: 'dark',
  activeSection: null,
  focusedSource: null,
  isDualViewMode: true,
};


export const useResumeStore = create<ResumeStoreState>()(
  persist(
    (set, get) => {
      const commitDataUpdate = (nextData: IResumeData) => {
        const state = get();
        const lang = state.editorState.currentLanguage;
        set({
          resumeData: nextData,
          frenchResumeData: lang === 'fr' ? nextData : (state.frenchResumeData || initialFrenchResumeData),
          englishResumeData: lang === 'en' ? nextData : (state.englishResumeData || initialEnglishResumeData),
          undoHistory: [state.resumeData, ...state.undoHistory].slice(0, MAX_HISTORY_STEPS),
          redoHistory: [],
        });
      };

      return {
        resumeData: initialEnglishResumeData,
        frenchResumeData: initialFrenchResumeData,
        englishResumeData: initialEnglishResumeData,
        editorState: initialEditorState,
        savedVersions: [],
        undoHistory: [],
        redoHistory: [],

        updateField: (path: string, value: any) => {
          const state = get();
          const currentData = state.resumeData;
          const nextData = structuredClone(currentData);

          const keys = path.split('.');
          let cursor: any = nextData;
          for (let i = 0; i < keys.length - 1; i++) {
            if (cursor[keys[i]] === undefined) {
              cursor[keys[i]] = {};
            }
            cursor = cursor[keys[i]];
          }
          cursor[keys[keys.length - 1]] = value;

          commitDataUpdate(nextData);
        },

        updateContactInformation: (field, value) => {
          const state = get();
          const nextData: IResumeData = {
            ...state.resumeData,
            contactInformation: {
              ...state.resumeData.contactInformation,
              [field]: value,
            },
          };
          commitDataUpdate(nextData);
        },

        updateProfileSummary: (summary) => {
          const state = get();
          const nextData: IResumeData = {
            ...state.resumeData,
            profileSummary: summary,
          };
          commitDataUpdate(nextData);
        },

        // Experience Mutators
        addExperience: (item) => {
          const state = get();
          const newExp: IExperienceItem = {
            identifier: `exp-${Date.now()}`,
            jobTitle: item?.jobTitle || '',
            companyName: item?.companyName || '',
            locationName: item?.locationName || '',
            startDate: item?.startDate || '',
            endDate: item?.endDate || '',
            isCurrentRole: item?.isCurrentRole || false,
            bulletPoints: item?.bulletPoints && item.bulletPoints.length > 0 ? item.bulletPoints : [''],
            ...item,
          };
          const nextData: IResumeData = {
            ...state.resumeData,
            experienceList: [newExp, ...(state.resumeData.experienceList || [])],
          };
          commitDataUpdate(nextData);
        },

        updateExperience: (identifier, field, value) => {
          const state = get();
          const nextExp = (state.resumeData.experienceList || []).map((exp) => {
            if (exp.identifier === identifier) {
              return { ...exp, [field]: value };
            }
            return exp;
          });
          const nextData: IResumeData = { ...state.resumeData, experienceList: nextExp };
          commitDataUpdate(nextData);
        },

        removeExperience: (identifier) => {
          const state = get();
          const nextExp = (state.resumeData.experienceList || []).filter((exp) => exp.identifier !== identifier);
          const nextData: IResumeData = { ...state.resumeData, experienceList: nextExp };
          commitDataUpdate(nextData);
        },

        reorderExperience: (startIndex, endIndex) => {
          const state = get();
          const nextExp = [...(state.resumeData.experienceList || [])];
          const [removed] = nextExp.splice(startIndex, 1);
          nextExp.splice(endIndex, 0, removed);
          const nextData: IResumeData = { ...state.resumeData, experienceList: nextExp };
          commitDataUpdate(nextData);
        },

        // Education Mutators
        addEducation: (item) => {
          const state = get();
          const newEdu: IEducationItem = {
            identifier: `edu-${Date.now()}`,
            degreeName: item?.degreeName || '',
            institutionName: item?.institutionName || '',
            locationName: item?.locationName || '',
            startDate: item?.startDate || '',
            endDate: item?.endDate || '',
            specialization: item?.specialization || '',
            bulletPoints: item?.bulletPoints || [],
            ...item,
          };
          const nextData: IResumeData = {
            ...state.resumeData,
            educationList: [newEdu, ...(state.resumeData.educationList || [])],
          };
          commitDataUpdate(nextData);
        },

        updateEducation: (identifier, field, value) => {
          const state = get();
          const nextEdu = (state.resumeData.educationList || []).map((edu) => {
            if (edu.identifier === identifier) {
              return { ...edu, [field]: value };
            }
            return edu;
          });
          const nextData: IResumeData = { ...state.resumeData, educationList: nextEdu };
          commitDataUpdate(nextData);
        },

        removeEducation: (identifier) => {
          const state = get();
          const nextEdu = (state.resumeData.educationList || []).filter((edu) => edu.identifier !== identifier);
          const nextData: IResumeData = { ...state.resumeData, educationList: nextEdu };
          commitDataUpdate(nextData);
        },

        reorderEducation: (startIndex, endIndex) => {
          const state = get();
          const nextEdu = [...(state.resumeData.educationList || [])];
          const [removed] = nextEdu.splice(startIndex, 1);
          nextEdu.splice(endIndex, 0, removed);
          const nextData: IResumeData = { ...state.resumeData, educationList: nextEdu };
          commitDataUpdate(nextData);
        },

        // Projects Mutators
        addProject: (item) => {
          const state = get();
          const newProj: IProjectItem = {
            identifier: `proj-${Date.now()}`,
            projectTitle: item?.projectTitle || '',
            projectSubtitle: item?.projectSubtitle || '',
            startDate: item?.startDate || '',
            endDate: item?.endDate || '',
            projectUrl: item?.projectUrl || '',
            bulletPoints: item?.bulletPoints && item.bulletPoints.length > 0 ? item.bulletPoints : [''],
            ...item,
          };
          const nextData: IResumeData = {
            ...state.resumeData,
            projectsList: [newProj, ...(state.resumeData.projectsList || [])],
          };
          commitDataUpdate(nextData);
        },

        updateProject: (identifier, field, value) => {
          const state = get();
          const nextProj = (state.resumeData.projectsList || []).map((proj) => {
            if (proj.identifier === identifier) {
              return { ...proj, [field]: value };
            }
            return proj;
          });
          const nextData: IResumeData = { ...state.resumeData, projectsList: nextProj };
          commitDataUpdate(nextData);
        },

        removeProject: (identifier) => {
          const state = get();
          const nextProj = (state.resumeData.projectsList || []).filter((proj) => proj.identifier !== identifier);
          const nextData: IResumeData = { ...state.resumeData, projectsList: nextProj };
          commitDataUpdate(nextData);
        },

        reorderProject: (startIndex, endIndex) => {
          const state = get();
          const nextProj = [...(state.resumeData.projectsList || [])];
          const [removed] = nextProj.splice(startIndex, 1);
          nextProj.splice(endIndex, 0, removed);
          const nextData: IResumeData = { ...state.resumeData, projectsList: nextProj };
          commitDataUpdate(nextData);
        },

        // Skills & Languages
        addSkill: (skill) => {
          const state = get();
          if (!skill.trim()) return;
          const nextData: IResumeData = {
            ...state.resumeData,
            skillsList: [...(state.resumeData.skillsList || []), skill.trim()],
          };
          commitDataUpdate(nextData);
        },

        updateSkill: (index, value) => {
          const state = get();
          const nextSkills = [...(state.resumeData.skillsList || [])];
          nextSkills[index] = value;
          const nextData: IResumeData = { ...state.resumeData, skillsList: nextSkills };
          commitDataUpdate(nextData);
        },

        removeSkill: (index) => {
          const state = get();
          const nextSkills = (state.resumeData.skillsList || []).filter((_, i) => i !== index);
          const nextData: IResumeData = { ...state.resumeData, skillsList: nextSkills };
          commitDataUpdate(nextData);
        },

        reorderSkill: (startIndex, endIndex) => {
          const state = get();
          const nextSkills = [...(state.resumeData.skillsList || [])];
          const [removed] = nextSkills.splice(startIndex, 1);
          nextSkills.splice(endIndex, 0, removed);
          const nextData: IResumeData = { ...state.resumeData, skillsList: nextSkills };
          commitDataUpdate(nextData);
        },

        reorderSkills: (startIndex, endIndex) => {
          const state = get();
          const nextSkills = [...(state.resumeData.skillsList || [])];
          const [removed] = nextSkills.splice(startIndex, 1);
          nextSkills.splice(endIndex, 0, removed);
          const nextData: IResumeData = { ...state.resumeData, skillsList: nextSkills };
          commitDataUpdate(nextData);
        },

        addLanguage: (language, level = '') => {
          const state = get();
          if (!language.trim()) return;
          const formatted = level.trim() ? `${language.trim()} (${level.trim()})` : language.trim();
          const nextData: IResumeData = {
            ...state.resumeData,
            languagesList: [...(state.resumeData.languagesList || []), formatted],
          };
          commitDataUpdate(nextData);
        },

        updateLanguage: (index, language, level = '') => {
          const state = get();
          const nextLangs = [...(state.resumeData.languagesList || [])];
          const formatted = level.trim() ? `${language.trim()} (${level.trim()})` : language.trim();
          nextLangs[index] = formatted;
          const nextData: IResumeData = { ...state.resumeData, languagesList: nextLangs };
          commitDataUpdate(nextData);
        },

        removeLanguage: (index) => {
          const state = get();
          const nextLangs = (state.resumeData.languagesList || []).filter((_, i) => i !== index);
          const nextData: IResumeData = { ...state.resumeData, languagesList: nextLangs };
          commitDataUpdate(nextData);
        },

        reorderLanguage: (startIndex, endIndex) => {
          const state = get();
          const nextLangs = [...(state.resumeData.languagesList || [])];
          const [removed] = nextLangs.splice(startIndex, 1);
          nextLangs.splice(endIndex, 0, removed);
          const nextData: IResumeData = { ...state.resumeData, languagesList: nextLangs };
          commitDataUpdate(nextData);
        },

        reorderLanguages: (startIndex, endIndex) => {
          const state = get();
          const nextLangs = [...(state.resumeData.languagesList || [])];
          const [removed] = nextLangs.splice(startIndex, 1);
          nextLangs.splice(endIndex, 0, removed);
          const nextData: IResumeData = { ...state.resumeData, languagesList: nextLangs };
          commitDataUpdate(nextData);
        },

        // Certifications
        addCertification: (item) => {
          const state = get();
          const newCert: ICertificationItem = {
            identifier: `cert-${Date.now()}`,
            certificationName: item?.certificationName || '',
            issuingOrganization: item?.issuingOrganization || '',
            issueYear: item?.issueYear || '',
            iconName: item?.iconName || 'id-card',
            ...item,
          };
          const nextData: IResumeData = {
            ...state.resumeData,
            certificationsList: [newCert, ...(state.resumeData.certificationsList || [])],
          };
          commitDataUpdate(nextData);
        },

        updateCertification: (identifier, field, value) => {
          const state = get();
          const nextCerts = (state.resumeData.certificationsList || []).map((cert) => {
            if (cert.identifier === identifier) {
              return { ...cert, [field]: value };
            }
            return cert;
          });
          const nextData: IResumeData = { ...state.resumeData, certificationsList: nextCerts };
          commitDataUpdate(nextData);
        },

        removeCertification: (identifier) => {
          const state = get();
          const nextCerts = (state.resumeData.certificationsList || []).filter((cert) => cert.identifier !== identifier);
          const nextData: IResumeData = { ...state.resumeData, certificationsList: nextCerts };
          commitDataUpdate(nextData);
        },

        reorderCertification: (startIndex, endIndex) => {
          const state = get();
          const nextCerts = [...(state.resumeData.certificationsList || [])];
          const [removed] = nextCerts.splice(startIndex, 1);
          nextCerts.splice(endIndex, 0, removed);
          const nextData: IResumeData = { ...state.resumeData, certificationsList: nextCerts };
          commitDataUpdate(nextData);
        },

        reorderCertifications: (startIndex, endIndex) => {
          const state = get();
          const nextCerts = [...(state.resumeData.certificationsList || [])];
          const [removed] = nextCerts.splice(startIndex, 1);
          nextCerts.splice(endIndex, 0, removed);
          const nextData: IResumeData = { ...state.resumeData, certificationsList: nextCerts };
          commitDataUpdate(nextData);
        },

        // Bullets Reordering
        reorderExperienceBullets: (expId, startIndex, endIndex) => {
          const state = get();
          const nextExp = (state.resumeData.experienceList || []).map((exp) => {
            if (exp.identifier === expId) {
              const nextBullets = [...(exp.bulletPoints || [])];
              const [removed] = nextBullets.splice(startIndex, 1);
              nextBullets.splice(endIndex, 0, removed);
              return { ...exp, bulletPoints: nextBullets };
            }
            return exp;
          });
          const nextData: IResumeData = { ...state.resumeData, experienceList: nextExp };
          commitDataUpdate(nextData);
        },

        reorderEducationBullets: (eduId, startIndex, endIndex) => {
          const state = get();
          const nextEdu = (state.resumeData.educationList || []).map((edu) => {
            if (edu.identifier === eduId) {
              const nextBullets = [...(edu.bulletPoints || [])];
              const [removed] = nextBullets.splice(startIndex, 1);
              nextBullets.splice(endIndex, 0, removed);
              return { ...edu, bulletPoints: nextBullets };
            }
            return edu;
          });
          const nextData: IResumeData = { ...state.resumeData, educationList: nextEdu };
          commitDataUpdate(nextData);
        },

        reorderProjectBullets: (projId, startIndex, endIndex) => {
          const state = get();
          const nextProj = (state.resumeData.projectsList || []).map((proj) => {
            if (proj.identifier === projId) {
              const nextBullets = [...(proj.bulletPoints || [])];
              const [removed] = nextBullets.splice(startIndex, 1);
              nextBullets.splice(endIndex, 0, removed);
              return { ...proj, bulletPoints: nextBullets };
            }
            return proj;
          });
          const nextData: IResumeData = { ...state.resumeData, projectsList: nextProj };
          commitDataUpdate(nextData);
        },


        // Custom Sections
        addCustomSection: (title = 'Custom Section') => {
          const state = get();
          const newSection: ICustomSection = {
            identifier: `custom-${Date.now()}`,
            sectionTitle: title,
            items: [],
          };
          const nextData: IResumeData = {
            ...state.resumeData,
            customSectionsList: [...(state.resumeData.customSectionsList || []), newSection],
          };
          commitDataUpdate(nextData);
        },

        removeCustomSection: (identifier) => {
          const state = get();
          const nextSections = (state.resumeData.customSectionsList || []).filter((s) => s.identifier !== identifier);
          const nextData: IResumeData = { ...state.resumeData, customSectionsList: nextSections };
          commitDataUpdate(nextData);
        },

        updateCustomSectionTitle: (identifier, title) => {
          const state = get();
          const nextSections = (state.resumeData.customSectionsList || []).map((s) => {
            if (s.identifier === identifier) {
              return { ...s, sectionTitle: title };
            }
            return s;
          });
          const nextData: IResumeData = { ...state.resumeData, customSectionsList: nextSections };
          commitDataUpdate(nextData);
        },

        reorderCustomSection: (startIndex, endIndex) => {
          const state = get();
          const nextSections = [...(state.resumeData.customSectionsList || [])];
          const [removed] = nextSections.splice(startIndex, 1);
          nextSections.splice(endIndex, 0, removed);
          const nextData: IResumeData = { ...state.resumeData, customSectionsList: nextSections };
          commitDataUpdate(nextData);
        },

        reorderCustomSections: (startIndex, endIndex) => {
          const state = get();
          const nextSections = [...(state.resumeData.customSectionsList || [])];
          const [removed] = nextSections.splice(startIndex, 1);
          nextSections.splice(endIndex, 0, removed);
          const nextData: IResumeData = { ...state.resumeData, customSectionsList: nextSections };
          commitDataUpdate(nextData);
        },

        addCustomSectionItem: (sectionId) => {
          const state = get();
          const nextSections = (state.resumeData.customSectionsList || []).map((s) => {
            if (s.identifier === sectionId) {
              return {
                ...s,
                items: [
                  ...(s.items || []),
                  {
                    identifier: `item-${Date.now()}`,
                    itemTitle: '',
                    itemSubtitle: '',
                    dateRange: '',
                    bulletPoints: [''],
                  },
                ],
              };
            }
            return s;
          });
          const nextData: IResumeData = { ...state.resumeData, customSectionsList: nextSections };
          commitDataUpdate(nextData);
        },

        updateCustomSectionItem: (sectionId, itemId, field, value) => {
          const state = get();
          const nextSections = (state.resumeData.customSectionsList || []).map((s) => {
            if (s.identifier === sectionId) {
              return {
                ...s,
                items: (s.items || []).map((entry) => {
                  if (entry.identifier === itemId) {
                    return { ...entry, [field]: value };
                  }
                  return entry;
                }),
              };
            }
            return s;
          });
          const nextData: IResumeData = { ...state.resumeData, customSectionsList: nextSections };
          commitDataUpdate(nextData);
        },

        removeCustomSectionItem: (sectionId, itemId) => {
          const state = get();
          const nextSections = (state.resumeData.customSectionsList || []).map((s) => {
            if (s.identifier === sectionId) {
              return {
                ...s,
                items: (s.items || []).filter((entry) => entry.identifier !== itemId),
              };
            }
            return s;
          });
          const nextData: IResumeData = { ...state.resumeData, customSectionsList: nextSections };
          commitDataUpdate(nextData);
        },

        reorderCustomSectionItem: (sectionId, startIndex, endIndex) => {
          const state = get();
          const nextSections = (state.resumeData.customSectionsList || []).map((s) => {
            if (s.identifier === sectionId) {
              const nextItems = [...(s.items || [])];
              const [removed] = nextItems.splice(startIndex, 1);
              nextItems.splice(endIndex, 0, removed);
              return { ...s, items: nextItems };
            }
            return s;
          });
          const nextData: IResumeData = { ...state.resumeData, customSectionsList: nextSections };
          commitDataUpdate(nextData);
        },


        // Visibility & Order
        toggleSectionVisibility: (sectionKey) => {
          const state = get();
          const current = state.resumeData.sectionVisibility?.[sectionKey] ?? true;
          const nextData: IResumeData = {
            ...state.resumeData,
            sectionVisibility: {
              ...state.resumeData.sectionVisibility,
              [sectionKey]: !current,
            },
          };
          commitDataUpdate(nextData);
        },

        reorderSections: (newOrder) => {
          const state = get();
          const nextData: IResumeData = {
            ...state.resumeData,
            sectionOrder: newOrder,
          };
          commitDataUpdate(nextData);
        },

        toggleItemPageBreak: (section, itemId, subItemId) => {
          const state = get();
          const currentData = state.resumeData;
          const nextData = structuredClone(currentData);

          if (section === 'experience') {
            nextData.experienceList = (nextData.experienceList || []).map((exp) =>
              exp.identifier === itemId ? { ...exp, pageBreakBefore: !exp.pageBreakBefore } : exp
            );
          } else if (section === 'education') {
            nextData.educationList = (nextData.educationList || []).map((edu) =>
              edu.identifier === itemId ? { ...edu, pageBreakBefore: !edu.pageBreakBefore } : edu
            );
          } else if (section === 'projects') {
            nextData.projectsList = (nextData.projectsList || []).map((proj) =>
              proj.identifier === itemId ? { ...proj, pageBreakBefore: !proj.pageBreakBefore } : proj
            );
          } else if (section === 'custom') {
            if (subItemId) {
              nextData.customSectionsList = (nextData.customSectionsList || []).map((sec) => {
                if (sec.identifier === itemId) {
                  return {
                    ...sec,
                    items: (sec.items || []).map((it) =>
                      it.identifier === subItemId ? { ...it, pageBreakBefore: !it.pageBreakBefore } : it
                    ),
                  };
                }
                return sec;
              });
            } else {
              nextData.customSectionsList = (nextData.customSectionsList || []).map((sec) =>
                sec.identifier === itemId ? { ...sec, pageBreakBefore: !sec.pageBreakBefore } : sec
              );
            }
          }

          commitDataUpdate(nextData);
        },

        toggleSectionPageBreak: (sectionKey) => {
          const state = get();
          const current = state.resumeData.sectionPageBreaks?.[sectionKey] ?? false;
          const nextData: IResumeData = {
            ...state.resumeData,
            sectionPageBreaks: {
              ...(state.resumeData.sectionPageBreaks || {}),
              [sectionKey]: !current,
            },
          };
          commitDataUpdate(nextData);
        },

        // Editor State
        setResumeData: (data) => {
          const state = get();
          const lang = state.editorState.currentLanguage;
          set({
            resumeData: data,
            frenchResumeData: lang === 'fr' ? data : (state.frenchResumeData || initialFrenchResumeData),
            englishResumeData: lang === 'en' ? data : (state.englishResumeData || initialEnglishResumeData),
            undoHistory: [state.resumeData, ...state.undoHistory].slice(0, MAX_HISTORY_STEPS),
            redoHistory: [],
          });
        },

        setTemplate: (templateId) => {
          set((state) => ({
            editorState: { ...state.editorState, activeTemplateId: templateId },
          }));
        },

        setAccentColor: (colorHex) => {
          set((state) => ({
            editorState: { ...state.editorState, activeAccentColor: colorHex },
          }));
        },

        setFontFamily: (fontName) => {
          set((state) => ({
            editorState: { ...state.editorState, activeFontFamily: fontName },
          }));
        },

        setPaperSize: (paperSize) => {
          set((state) => ({
            editorState: { ...state.editorState, activePaperSize: paperSize },
          }));
        },

        setZoomLevel: (zoom) => {
          set((state) => ({
            editorState: { ...state.editorState, zoomLevelPercentage: Math.max(30, Math.min(200, zoom)) },
          }));
        },

        toggleSidebar: () => {
          set((state) => ({
            editorState: {
              ...state.editorState,
              isSidebarCollapsed: !state.editorState.isSidebarCollapsed,
            },
          }));
        },

        setActiveSidebarTab: (tabName) => {
          set((state) => ({
            editorState: { ...state.editorState, activeSidebarTab: tabName },
          }));
        },

        setLanguage: (lang) => {
          const state = get();
          if (state.editorState.currentLanguage === lang) return;

          const prevLang = state.editorState.currentLanguage;
          const currentData = state.resumeData;
          const frData = prevLang === 'fr' ? currentData : (state.frenchResumeData || initialFrenchResumeData);
          const enData = prevLang === 'en' ? currentData : (state.englishResumeData || initialEnglishResumeData);
          const targetData = lang === 'fr' ? frData : enData;

          set({
            resumeData: structuredClone(targetData),
            frenchResumeData: frData,
            englishResumeData: enData,
            editorState: { ...state.editorState, currentLanguage: lang },
          });
        },

        setEditorTheme: (theme) => {
          set((state) => ({
            editorState: { ...state.editorState, editorTheme: theme },
          }));
        },

        setActiveSection: (sectionKey, source = 'sidebar') => {
          set((state) => ({
            editorState: {
              ...state.editorState,
              activeSection: sectionKey,
              focusedSource: source,
            },
          }));
        },

        toggleDualViewMode: () => {
          set((state) => ({
            editorState: {
              ...state.editorState,
              isDualViewMode: !state.editorState.isDualViewMode,
            },
          }));
        },

        setDualViewMode: (enabled) => {
          set((state) => ({
            editorState: {
              ...state.editorState,
              isDualViewMode: enabled,
            },
          }));
        },

        // Version Management Actions
        saveCurrentVersion: (versionName, description = '') => {
          const state = get();
          const id = `ver-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
          const nowFormatted = formatTimestamp();
          const newVersion: ISavedVersion = {
            identifier: id,
            versionName: versionName.trim() || 'Untitled Version',
            description: description.trim(),
            createdAt: nowFormatted,
            updatedAt: nowFormatted,
            isDraft: false,
            resumeData: structuredClone(state.resumeData),
            frenchResumeData: structuredClone(state.frenchResumeData || state.resumeData),
            englishResumeData: structuredClone(state.englishResumeData || state.resumeData),
            savedLanguages: ['en', 'fr'],
            editorState: structuredClone(state.editorState),
          };
          set({
            savedVersions: [newVersion, ...state.savedVersions],
          });
          return id;
        },

        duplicateVersion: (versionId) => {
          const state = get();
          const target = state.savedVersions.find((v) => v.identifier === versionId);
          if (!target) return '';
          const id = `ver-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
          const nowFormatted = formatTimestamp();
          const duplicatedVersion: ISavedVersion = {
            ...structuredClone(target),
            identifier: id,
            versionName: `${target.versionName} (Copy)`,
            createdAt: nowFormatted,
            updatedAt: nowFormatted,
            isDraft: false,
          };
          set({
            savedVersions: [duplicatedVersion, ...state.savedVersions],
          });
          return id;
        },

        autoSaveCurrentDraft: () => {
          // Working draft is automatically persisted in localStorage through Zustand's persist middleware
        },

        loadVersion: (versionId) => {
          const state = get();
          const target = state.savedVersions.find((v) => v.identifier === versionId);
          if (!target) return;

          set({
            resumeData: structuredClone(target.resumeData),
            frenchResumeData: target.frenchResumeData ? structuredClone(target.frenchResumeData) : state.frenchResumeData,
            englishResumeData: target.englishResumeData ? structuredClone(target.englishResumeData) : state.englishResumeData,
            editorState: structuredClone(target.editorState),
            undoHistory: [state.resumeData, ...state.undoHistory].slice(0, MAX_HISTORY_STEPS),
            redoHistory: [],
          });
        },


        deleteVersion: (versionId) => {
          const state = get();
          set({
            savedVersions: state.savedVersions.filter((v) => v.identifier !== versionId),
          });
        },

        updateVersionMetadata: (versionId, versionName, description = '') => {
          const state = get();
          const nowFormatted = formatTimestamp();
          set({
            savedVersions: state.savedVersions.map((v) =>
              v.identifier === versionId
                ? {
                    ...v,
                    versionName: versionName.trim() || v.versionName,
                    description: description.trim(),
                    updatedAt: nowFormatted,
                  }
                : v
            ),
          });
        },

        exportVersionsCatalog: () => {
          const state = get();
          return JSON.stringify(state.savedVersions, null, 2);
        },

        importVersionsCatalog: (jsonString: string) => {
          try {
            const parsed = JSON.parse(jsonString);
            if (!Array.isArray(parsed)) {
              return { success: false, count: 0, error: 'Invalid format: expected array of versions' };
            }
            const validVersions: ISavedVersion[] = [];
            for (const item of parsed) {
              if (item && item.identifier && item.resumeData && item.editorState) {
                validVersions.push({
                  identifier: item.identifier || `ver-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                  versionName: item.versionName || 'Imported Version',
                  description: item.description || '',
                  createdAt: item.createdAt || formatTimestamp(),
                  updatedAt: item.updatedAt || formatTimestamp(),
                  isDraft: false,
                  resumeData: item.resumeData,
                  editorState: item.editorState,
                });
              }
            }
            if (validVersions.length === 0) {
              return { success: false, count: 0, error: 'No valid versions found in file' };
            }
            const state = get();
            const existingIds = new Set(state.savedVersions.map((v) => v.identifier));
            const merged = [...state.savedVersions];
            let addedCount = 0;
            for (const v of validVersions) {
              if (existingIds.has(v.identifier)) {
                v.identifier = `ver-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
              }
              merged.unshift(v);
              addedCount++;
            }
            set({ savedVersions: merged });
            return { success: true, count: addedCount };
          } catch (err: any) {
            return { success: false, count: 0, error: err?.message || 'Failed to parse JSON' };
          }
        },

        // History Actions
        undo: () => {
          const state = get();
          if (state.undoHistory.length === 0) return;

          const [prevState, ...remainingUndo] = state.undoHistory;
          set({
            resumeData: prevState,
            undoHistory: remainingUndo,
            redoHistory: [state.resumeData, ...state.redoHistory].slice(0, MAX_HISTORY_STEPS),
          });
        },

        redo: () => {
          const state = get();
          if (state.redoHistory.length === 0) return;

          const [nextState, ...remainingRedo] = state.redoHistory;
          set({
            resumeData: nextState,
            redoHistory: remainingRedo,
            undoHistory: [state.resumeData, ...state.undoHistory].slice(0, MAX_HISTORY_STEPS),
          });
        },

        resetToDefault: (language) => {
          const state = get();
          const lang = language || state.editorState.currentLanguage;
          const defaultData = lang === 'fr' ? initialFrenchResumeData : initialEnglishResumeData;

          set({
            resumeData: structuredClone(defaultData),
            frenchResumeData: lang === 'fr' ? structuredClone(defaultData) : state.frenchResumeData,
            englishResumeData: lang === 'en' ? structuredClone(defaultData) : state.englishResumeData,
            undoHistory: [state.resumeData, ...state.undoHistory].slice(0, MAX_HISTORY_STEPS),
            redoHistory: [],
          });
        },
      };
    },
    {
      name: 'resume-builder-storage-v1',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? window.localStorage : (null as any))),
      partialize: (state) => ({
        resumeData: state.resumeData,
        frenchResumeData: state.frenchResumeData,
        englishResumeData: state.englishResumeData,
        editorState: state.editorState,
        savedVersions: state.savedVersions,
      }),
    }
  )
);
