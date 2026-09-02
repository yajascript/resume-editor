# Resume Builder Implementation Tasks

## Multi-Page Left Banner Spanning & Customizable Page Breaks

- [x] **Universal Schema & Contracts**:
  - [x] Added `pageBreakBefore?: boolean` to `IExperienceItem`, `IEducationItem`, `IProjectItem`, `ICustomSectionItem`, and `ICustomSection`.
  - [x] Added `sectionPageBreaks?: Record<string, boolean>` to `IResumeData`.
- [x] **Store Mutators & State Synchronization**:
  - [x] Implemented `toggleItemPageBreak(section, itemId, subItemId?)` in `useResumeStore`.
  - [x] Implemented `toggleSectionPageBreak(sectionKey)` in `useResumeStore`.
- [x] **Joint i18n Localization**:
  - [x] Added flat dot-notation keys for `pageBreak.*` and `canvas.pageDivider` in English and French dictionaries in `i18n.ts`.
- [x] **Dynamic Pagination & Spacing Component**:
  - [x] Created `PageBreakWrapper.tsx` supporting dynamic top-of-page offset calculation, visual badges, and hover quick-action scissors buttons.
- [x] **Full-Height Canvas & Dynamic Banner Scaling**:
  - [x] Updated `WorkspaceCanvas.tsx` with dynamic page height computation (`totalPages * singlePageMm`) ensuring 100% full-page stretch for sidebars.
  - [x] Rendered visual dashed page boundary indicators between pages on screen.
- [x] **Template Integrations**:
  - [x] `SidebarNavyTemplate.tsx`: Full-height stretching `<aside>` with zero cutoffs on multi-page resumes and item/section page breaks.
  - [x] `ModernSplitTemplate.tsx`: Full-height layout and page breaks across all sections.
  - [x] `MinimalCleanTemplate.tsx`: Page breaks across sections and items.
  - [x] `ExecutiveClassicTemplate.tsx`: Page breaks across sections and items.
  - [x] `TechMinimalistTemplate.tsx`: Page breaks across sections and items.
- [x] **Sidebar Form Controls**:
  - [x] `ExperienceForm.tsx`: Card header button & body checkbox.
  - [x] `EducationForm.tsx`: Card header button & body checkbox.
  - [x] `ProjectsForm.tsx`: Card header button & body checkbox.
  - [x] `CustomSectionsForm.tsx`: Section & item header buttons.
  - [x] `SectionOrderForm.tsx`: Section-level page break toggles.
- [x] **Export Pipeline Hardening**:
  - [x] Updated `PdfExporter.ts` and `ImageExporter.ts` with `captureFilter` to strip transient UI buttons and dividers.
  - [x] Updated `globals.css` print styles to preserve template sidebars and support `@media print` break rules.
- [x] **Quality Assurance & Verification**:
  - [x] Added unit tests for page break toggles in `__tests__/store/useResumeStore.test.ts` (18/18 passing).
  - [x] Verified strict TypeScript compilation and Next.js static production build (`pnpm run build`).
  - [x] Updated canonical `Architecture.md`.
