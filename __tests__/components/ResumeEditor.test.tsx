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

  it('should render the header, sidebar, and canvas with default resume content', () => {
    render(<ResumeEditorPage />);

    expect(screen.getAllByText('Resume Builder').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/John Smith, P\.Eng\./i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Senior Project Engineer/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/john\.smith@example\.com/i).length).toBeGreaterThan(0);
  });

  it('should toggle language from English to French via sidebar', () => {
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

  it('should open export modal with View PDF and Download PDF options', () => {
    render(<ResumeEditorPage />);

    const exportBtn = screen.getByText('Export');
    fireEvent.click(exportBtn);

    expect(screen.getByText('View PDF')).toBeDefined();
    expect(screen.getByText('Download PDF')).toBeDefined();
  });
});
