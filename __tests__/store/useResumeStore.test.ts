import { describe, it, expect, beforeEach } from 'vitest';
import { useResumeStore } from '@/store/useResumeStore';

describe('useResumeStore', () => {
  beforeEach(() => {
    useResumeStore.setState({ savedVersions: [] });
    useResumeStore.getState().resetToDefault('en');
  });

  it('should update contact information fields correctly', () => {
    useResumeStore.getState().updateContactInformation('fullName', 'Johnathan Smith');
    expect(useResumeStore.getState().resumeData.contactInformation.fullName).toBe(
      'Johnathan Smith'
    );
  });

  it('should add, update, reorder and remove work experience items', () => {
    const initialCount = useResumeStore.getState().resumeData.experienceList.length;

    useResumeStore.getState().addExperience({
      jobTitle: 'Senior Staff Engineer',
      companyName: 'Acme Systems',
    });

    const listAfterAdd = useResumeStore.getState().resumeData.experienceList;
    expect(listAfterAdd.length).toBe(initialCount + 1);
    expect(listAfterAdd[0].jobTitle).toBe('Senior Staff Engineer');

    const addedId = listAfterAdd[0].identifier;
    useResumeStore.getState().updateExperience(addedId, 'jobTitle', 'Principal Architect');
    expect(
      useResumeStore.getState().resumeData.experienceList.find((e) => e.identifier === addedId)
        ?.jobTitle
    ).toBe('Principal Architect');

    useResumeStore.getState().removeExperience(addedId);
    expect(useResumeStore.getState().resumeData.experienceList.length).toBe(initialCount);
  });

  it('should support snapshot-based undo and redo operations', () => {
    const originalName = useResumeStore.getState().resumeData.contactInformation.fullName;

    useResumeStore.getState().updateContactInformation('fullName', 'Changed Name 1');
    expect(useResumeStore.getState().resumeData.contactInformation.fullName).toBe('Changed Name 1');

    useResumeStore.getState().undo();
    expect(useResumeStore.getState().resumeData.contactInformation.fullName).toBe(originalName);

    useResumeStore.getState().redo();
    expect(useResumeStore.getState().resumeData.contactInformation.fullName).toBe('Changed Name 1');
  });

  it('should save, load, duplicate, and delete version snapshots with full state and styling', () => {
    useResumeStore.getState().updateContactInformation('fullName', 'Alex Rivera');
    useResumeStore.getState().setTemplate('tech-minimalist');
    useResumeStore.getState().setAccentColor('#10b981');

    const versionId = useResumeStore.getState().saveCurrentVersion(
      'Software Engineer Profile',
      'Tailored for backend engineering roles'
    );

    const saved = useResumeStore.getState().savedVersions.find((v) => v.identifier === versionId);
    expect(saved).toBeDefined();
    expect(saved?.versionName).toBe('Software Engineer Profile');
    expect(saved?.description).toBe('Tailored for backend engineering roles');
    expect(saved?.editorState.activeTemplateId).toBe('tech-minimalist');

    // Duplicate version
    const duplicateId = useResumeStore.getState().duplicateVersion(versionId);
    expect(duplicateId).toBeTruthy();
    const duplicated = useResumeStore.getState().savedVersions.find((v) => v.identifier === duplicateId);
    expect(duplicated).toBeDefined();
    expect(duplicated?.versionName).toContain('Software Engineer Profile (Copy)');
    expect(useResumeStore.getState().savedVersions.length).toBe(2);

    // Switch to another template and name
    useResumeStore.getState().updateContactInformation('fullName', 'Different Person');
    useResumeStore.getState().setTemplate('minimal-clean');

    // Load saved version
    useResumeStore.getState().loadVersion(versionId);
    expect(useResumeStore.getState().resumeData.contactInformation.fullName).toBe('Alex Rivera');
    expect(useResumeStore.getState().editorState.activeTemplateId).toBe('tech-minimalist');
    expect(useResumeStore.getState().editorState.activeAccentColor).toBe('#10b981');

    // Delete versions
    useResumeStore.getState().deleteVersion(versionId);
    expect(
      useResumeStore.getState().savedVersions.find((v) => v.identifier === versionId)
    ).toBeUndefined();
  });

  it('should export and import full versions catalog JSON', () => {
    useResumeStore.getState().updateContactInformation('fullName', 'Taylor Swift');
    useResumeStore.getState().saveCurrentVersion('Version A', 'First version');

    const catalogJson = useResumeStore.getState().exportVersionsCatalog();
    expect(catalogJson).toContain('Version A');

    // Clear versions and import back
    useResumeStore.getState().deleteVersion(useResumeStore.getState().savedVersions[0].identifier);
    expect(useResumeStore.getState().savedVersions.length).toBe(0);

    const result = useResumeStore.getState().importVersionsCatalog(catalogJson);
    expect(result.success).toBe(true);
    expect(result.count).toBe(1);
    expect(useResumeStore.getState().savedVersions[0].versionName).toBe('Version A');
  });

  it('should toggle dual view mode and synchronize bilingual datasets', () => {
    expect(useResumeStore.getState().editorState.isDualViewMode).toBe(true);

    useResumeStore.getState().toggleDualViewMode();
    expect(useResumeStore.getState().editorState.isDualViewMode).toBe(false);

    useResumeStore.getState().toggleDualViewMode();
    expect(useResumeStore.getState().editorState.isDualViewMode).toBe(true);

    // Edit in English
    useResumeStore.getState().setLanguage('en');
    useResumeStore.getState().updateContactInformation('fullName', 'John Smith EN');
    expect(useResumeStore.getState().englishResumeData.contactInformation.fullName).toBe('John Smith EN');

    // Switch to French and edit
    useResumeStore.getState().setLanguage('fr');
    expect(useResumeStore.getState().editorState.currentLanguage).toBe('fr');
    useResumeStore.getState().updateContactInformation('fullName', 'Jean Dupont FR');
    expect(useResumeStore.getState().frenchResumeData.contactInformation.fullName).toBe('Jean Dupont FR');

    // Switch back to English - English data is preserved
    useResumeStore.getState().setLanguage('en');
    expect(useResumeStore.getState().resumeData.contactInformation.fullName).toBe('John Smith EN');
  });

  it('should support reordering items and bullets across all sections', () => {
    // Reorder Languages
    useResumeStore.getState().addLanguage('Spanish');
    useResumeStore.getState().addLanguage('German');
    const initialLangs = useResumeStore.getState().resumeData.languagesList;
    const len = initialLangs.length;
    useResumeStore.getState().reorderLanguages(len - 2, len - 1);
    expect(useResumeStore.getState().resumeData.languagesList[len - 1]).toBe(initialLangs[len - 2]);

    // Reorder Experience Bullets
    const expId = useResumeStore.getState().resumeData.experienceList[0].identifier;
    useResumeStore.getState().updateExperience(expId, 'bulletPoints', ['Bullet 1', 'Bullet 2']);
    useResumeStore.getState().reorderExperienceBullets(expId, 0, 1);
    expect(
      useResumeStore.getState().resumeData.experienceList.find((e) => e.identifier === expId)
        ?.bulletPoints
    ).toEqual(['Bullet 2', 'Bullet 1']);
  });

  it('should toggle page breaks for items across experience, education, projects, and custom sections', () => {
    const expId = useResumeStore.getState().resumeData.experienceList[0].identifier;
    expect(useResumeStore.getState().resumeData.experienceList[0].pageBreakBefore).toBeFalsy();

    useResumeStore.getState().toggleItemPageBreak('experience', expId);
    expect(
      useResumeStore.getState().resumeData.experienceList.find((e) => e.identifier === expId)
        ?.pageBreakBefore
    ).toBe(true);

    useResumeStore.getState().toggleItemPageBreak('experience', expId);
    expect(
      useResumeStore.getState().resumeData.experienceList.find((e) => e.identifier === expId)
        ?.pageBreakBefore
    ).toBe(false);

    // Section-level page breaks
    expect(useResumeStore.getState().resumeData.sectionPageBreaks?.experience).toBeFalsy();
    useResumeStore.getState().toggleSectionPageBreak('experience');
    expect(useResumeStore.getState().resumeData.sectionPageBreaks?.experience).toBe(true);
    useResumeStore.getState().toggleSectionPageBreak('experience');
    expect(useResumeStore.getState().resumeData.sectionPageBreaks?.experience).toBe(false);
  });
});

