import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ResumeEditorPage from '@/app/page';
import { useResumeStore } from '@/store/useResumeStore';

describe('ResumeEditorPage Component Integration', () => {
  beforeEach(() => {
    useResumeStore.getState().resetToDefault('en');
    useResumeStore.getState().setLanguage('en');
  });

  it('should render the header, sidebar, and canvas with English default CV content', () => {
    render(<ResumeEditorPage />);

    expect(screen.getAllByText('Resume Builder').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/John Smith, P\.Eng\./i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Senior Project Engineer/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/john\.smith@example\.com/i).length).toBeGreaterThan(0);
  });

  it('should toggle language from English to French and update UI text', () => {
    render(<ResumeEditorPage />);

    const frButtons = screen.getAllByText('FR');
    expect(frButtons.length).toBeGreaterThan(0);

    fireEvent.click(frButtons[0]);

    expect(useResumeStore.getState().editorState.currentLanguage).toBe('fr');
  });

  it('should switch active template when selected from registry', () => {
    render(<ResumeEditorPage />);

    useResumeStore.getState().setTemplate('minimal-clean');
    expect(useResumeStore.getState().editorState.activeTemplateId).toBe('minimal-clean');

    useResumeStore.getState().setTemplate('tech-minimalist');
    expect(useResumeStore.getState().editorState.activeTemplateId).toBe('tech-minimalist');
  });

  it('should render side-by-side bilingual previews in dual view mode', () => {
    render(<ResumeEditorPage />);

    const dualButtons = screen.getAllByText('EN & FR');
    expect(dualButtons.length).toBeGreaterThan(0);
    fireEvent.click(dualButtons[0]);


    expect(useResumeStore.getState().editorState.isDualViewMode).toBe(true);
    expect(screen.getAllByText(/Version Française \(FR\)/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/English Version \(EN\)/i).length).toBeGreaterThan(0);
  });
});

