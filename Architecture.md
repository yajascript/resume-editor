# Resume Builder — Architecture Living Document

> **Status:** Active & Canonical  
> **Source Repository:** `/Users/ajay/Development/resume-editor`  
> **Last Updated:** September 1, 2026  

---

## 1. System Overview & Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | Static site generation, client-side hydration, zero serverless compute overhead |
| **Language** | TypeScript 5.7+ | Strict mode, full-word descriptive naming, strict 1:1 single-entity file isolation |
| **Styling** | Tailwind CSS 3.4 + CSS Modules | Custom paper shadows, print media queries, glassmorphic floating toolbars |
| **State Management** | Zustand 5.0 + Persist | `localStorage` persistence with snapshot-based Undo/Redo history stack, dual-language persistence, page break toggles |
| **Document Exporters** | `docx`, `jspdf`, `html-to-image`, `file-saver` | 100% client-side compilation for Word (.docx), Multi-Page Sliced Vector/Raster PDF with filter exclusion, High-Res PNG/JPEG, JSON |
| **Localization** | Joint `i18n.ts` Dictionary | Dynamic variable interpolation for FR (French) and EN (English), zero hardcoded fallbacks |
| **Deployment Target** | Vercel (Hobby Free Tier) | Zero backend compute, 100% client-side execution, completely free and private per user |

---

## 2. Repository Structure

```
resume-editor/
├── Architecture.md                  # Canonical living architecture documentation
├── TODO.md                          # Phase tracking and feature specification
├── template1.html                   # Original reference template
├── package.json                     # Pinned dependencies (exact versions)
├── tsconfig.json                    # Strict TypeScript configuration with @/* aliases
├── tailwind.config.ts               # Tailwind design tokens and print utilities
├── postcss.config.mjs               # PostCSS plugins
├── next.config.ts                   # Next.js configuration
├── vitest.config.ts                 # Unit testing configuration
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout with Google fonts and metadata
│   │   ├── page.tsx                 # Main editor workspace screen
│   │   ├── globals.css              # Global styles, animations, print media rules
│   │   ├── robots.ts                # SEO crawler robots directives
│   │   └── sitemap.ts               # SEO sitemap index
│   ├── types/
│   │   ├── index.ts                 # Types barrel export
│   │   ├── IContactInformation.ts   # Contact fields contract
│   │   ├── IExperienceItem.ts       # Work experience item contract (with pageBreakBefore)
│   │   ├── IEducationItem.ts        # Education degree item contract (with pageBreakBefore)
│   │   ├── IProjectItem.ts          # Project item contract (with pageBreakBefore)
│   │   ├── ICertificationItem.ts    # Certification & license contract
│   │   ├── ICustomSectionItem.ts    # Dynamic section item contract (with pageBreakBefore)
│   │   ├── ICustomSection.ts        # Custom section container contract (with pageBreakBefore)
│   │   ├── IResumeData.ts           # Universal normalized resume schema (with sectionPageBreaks)
│   │   ├── ISavedVersion.ts         # Saved snapshot version contract
│   │   ├── ITemplateProps.ts        # Template component props contract
│   │   ├── ITemplate.ts             # Template registry metadata contract
│   │   ├── IEditorState.ts          # UI state, zoom, paper size, tabs, activeSection, dual view, theme
│   │   └── IExportOptions.ts        # Document export options
│   ├── store/
│   │   ├── index.ts                 # Store barrel export
│   │   ├── useResumeStore.ts        # Zustand store with mutators, page break mutators, dual language persistence & bi-directional focus
│   │   └── defaultResumeData.ts     # Prepopulated generic placeholder FR & EN CV datasets
│   ├── i18n/
│   │   ├── index.ts                 # i18n barrel export
│   │   └── i18n.ts                  # Single joint FR/EN dictionary with interpolation
│   ├── templates/
│   │   ├── index.ts                 # Templates barrel export
│   │   ├── TemplateRegistry.ts      # Multi-template catalog & registry
│   │   ├── SidebarNavyTemplate.tsx  # Full-height stretching multi-page sidebar layout with click-to-focus and page breaks
│   │   ├── MinimalCleanTemplate.tsx # Single-column minimalist layout with click-to-focus and page breaks
│   │   ├── ModernSplitTemplate.tsx  # Top header banner + 2-column body with click-to-focus and page breaks
│   │   ├── ExecutiveClassicTemplate.tsx # Traditional serif executive layout with click-to-focus and page breaks
│   │   └── TechMinimalistTemplate.tsx   # Software engineer streamlined layout with click-to-focus and page breaks
│   ├── components/
│   │   ├── cards/
│   │   │   ├── index.ts             # Cards barrel export
│   │   │   └── ResumeVersionCard.tsx # Reusable version snapshot preview card with duplicate & export
│   │   ├── modals/
│   │   │   ├── index.ts             # Modals barrel export
│   │   │   ├── ExportModal.tsx      # Clean 2-column export modal
│   │   │   ├── ImportHtmlModal.tsx  # Smart HTML parser & import modal
│   │   │   ├── SavedVersionsModal.tsx # Spacious desktop version catalog modal with search & filters
│   │   │   └── TemplateSelectorModal.tsx # Visual thumbnail template picker
│   │   ├── editor/
│   │   │   ├── index.ts             # Editor barrel export
│   │   │   ├── EditableText.tsx     # Inline WYSIWYG contenteditable binding
│   │   │   └── PageBreakWrapper.tsx # Dynamic pagination spacer, visual indicators & hover quick-actions
│   │   ├── forms/
│   │   │   ├── index.ts             # Forms barrel export
│   │   │   ├── ContactForm.tsx      # Contact details form
│   │   │   ├── SummaryForm.tsx      # Summary form with character counter
│   │   │   ├── ExperienceForm.tsx   # Expandable cards with page break toggles & fast paste
│   │   │   ├── EducationForm.tsx    # Expandable cards with page break toggles & fast paste
│   │   │   ├── SkillsForm.tsx       # Skills tags manager
│   │   │   ├── LanguagesForm.tsx    # Languages manager
│   │   │   ├── CertificationsForm.tsx # Licenses & certifications
│   │   │   ├── ProjectsForm.tsx     # Featured projects with page break toggles & fast paste
│   │   │   ├── CustomSectionsForm.tsx # Custom user-defined sections with page break toggles
│   │   │   ├── SectionOrderForm.tsx # Drag/order, visibility toggles & section-level page breaks
│   │   │   └── AppearanceForm.tsx   # Template, accent color & font selector
│   │   └── layout/
│   │       ├── index.ts             # Layout barrel export
│   │       ├── EditorHeader.tsx     # Top header bar (actions, dual view toggle, language, theme)
│   │       ├── EditorSidebar.tsx    # Accordion control panel with auto-focus & scrolling
│   │       └── WorkspaceCanvas.tsx  # Dynamic multi-page paper canvas with visual page dividers and 100% banner scaling
│   ├── exporters/
│   │   ├── index.ts                 # Exporters barrel export
│   │   ├── DocxExporter.ts          # Native OpenXML .docx generation
│   │   ├── PdfExporter.ts           # Client-side PDF export with capture filter & vector print
│   │   ├── ImageExporter.ts         # High-DPI PNG and JPEG exporter with capture filter
│   │   └── JsonExporter.ts          # JSON resume backup exporter and loader
│   └── utils/
│       ├── index.ts                 # Utilities barrel export
│       ├── classNames.ts            # clsx & tailwind-merge helper
│       ├── dateHelpers.ts           # Date normalization utilities
│       └── htmlParser.ts            # Smart HTML, JSON & text section detector
└── __tests__/
    ├── components/                  # ResumeEditor integration tests
    ├── store/                       # Store mutations, versions, page breaks & undo/redo unit tests
    ├── utils/                       # Smart parser & date helper unit tests
    └── i18n/                        # Dictionary completeness & interpolation tests
```

---

## 3. ASCII Visual Diagrams

### Multi-Page Full-Height Scaling & Dynamic Page Break Architecture
```
┌────────────────────────────────────────────────────────────────────────────┐
│                    WorkspaceCanvas (ResumePaper Container)                 │
│      • Computes totalPages = Math.max(1, Math.ceil(contentHeight/pagePx))  │
│      • Sets minHeight = totalPages * 11in (e.g. 22in for 2 pages)          │
│      • Renders visual dashed Page Boundary Dividers on screen              │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│              SidebarNavyTemplate (or Any Two-Column Layout)                │
│  ┌───────────────────────────────┐ ┌────────────────────────────────────┐  │
│  │      <aside> Left Banner      │ │         <main> Main Body           │  │
│  │  • items-stretch              │ │  • PageBreakWrapper on Sections    │  │
│  │  • min-h-full (Spans 100% of  │ │  • PageBreakWrapper on Items       │  │
│  │    Page 1 AND Page 2 to base) │ │  • Computes top page spacer dynamically│
│  │  • Zero blank white boxes     │ │  • CSS: break-before: page         │  │
│  └───────────────────────────────┘ └────────────────────────────────────┘  │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │
                 ┌────────────────────┴────────────────────┐
                 ▼                                         ▼
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│     Screen Preview & Forms      │       │     PdfExporter / Print         │
│  • Hover Scissors Quick-Action  │       │  • captureFilter strips overlay │
│  • Sidebar 📄 Break Toggles     │       │    buttons & guidelines         │
│  • Real-time Spacing Reflow     │       │  • Clean 2-Page Slicing         │
└─────────────────────────────────┘       └─────────────────────────────────┘
```

---

## 4. State Schema

```typescript
export interface IResumeData {
  contactInformation: {
    fullName: string;
    jobTitle: string;
    emailAddress: string;
    phoneNumber: string;
    locationAddress: string;
    websiteUrl?: string;
    linkedinUrl?: string;
    githubUrl?: string;
  };
  profileSummary: string;
  skillsList: string[];
  languagesList: string[];
  certificationsList: Array<{
    identifier: string;
    certificationName: string;
    issuingOrganization?: string;
    issueYear?: string;
    iconName?: string;
  }>;
  educationList: Array<{
    identifier: string;
    degreeName: string;
    institutionName: string;
    locationName?: string;
    startDate: string;
    endDate: string;
    specialization?: string;
    bulletPoints?: string[];
    pageBreakBefore?: boolean;
  }>;
  projectsList: Array<{
    identifier: string;
    projectTitle: string;
    projectSubtitle?: string;
    projectUrl?: string;
    startDate?: string;
    endDate?: string;
    bulletPoints: string[];
    pageBreakBefore?: boolean;
  }>;
  experienceList: Array<{
    identifier: string;
    jobTitle: string;
    companyName: string;
    locationName?: string;
    startDate: string;
    endDate: string;
    isCurrentRole: boolean;
    bulletPoints: string[];
    pageBreakBefore?: boolean;
  }>;
  customSectionsList: Array<{
    identifier: string;
    sectionTitle: string;
    pageBreakBefore?: boolean;
    items: Array<{
      identifier: string;
      itemTitle: string;
      itemSubtitle?: string;
      dateRange?: string;
      bulletPoints: string[];
      pageBreakBefore?: boolean;
    }>;
  }>;
  sectionOrder: string[];
  sectionVisibility: Record<string, boolean>;
  sectionPageBreaks?: Record<string, boolean>;
}

export interface IEditorState {
  activeTemplateId: string;
  currentLanguage: 'fr' | 'en';
  isSidebarCollapsed: boolean;
  activeSidebarTab: 'content' | 'sections' | 'appearance';
  activePaperSize: 'a4' | 'letter';
  zoomLevelPercentage: number;
  activeAccentColor: string;
  activeFontFamily: string;
  activeSection?: string | null;
  focusedSource?: 'preview' | 'sidebar' | null;
  isDualViewMode?: boolean;
}
```

---

## 8. Testing Standards & Current Baseline

- **Test Framework**: Vitest + Testing Library React + jsdom
- **Test Baseline**: **18 passing tests across 4 test suites** (`pnpm test`)
  - `__tests__/components/ResumeEditor.test.tsx`: Integration tests for header controls, sidebar language switcher, template registry, canvas rendering, and PDF view/download export options.
  - `__tests__/store/useResumeStore.test.ts`: Unit tests for Zustand store mutators, item & section page breaks, language switching, version snapshot management, and undo/redo histories.
  - `__tests__/utils/SmartResumeParser.test.ts`: Tests for HTML/text parsing, section detection, and date normalization.
  - `__tests__/i18n/i18n.test.ts`: Exact 1:1 key parity and dynamic variable interpolation tests between EN and FR joint dictionaries.

---

## 9. Future Extension Table

| Feature | Description | Insertion Point | Status |
| :--- | :--- | :--- | :--- |
| Single & Bilingual Toggle | Intuitive checkbox workflow with cross-language copy & smart target imports | `EditorHeader.tsx`, `WorkspaceCanvas.tsx`, `ImportHtmlModal.tsx` | Complete |
| Smart Multi-Page Breaks | Dynamic offset calculation and PDF raster preservation | `PageBreakWrapper.tsx`, `PdfExporter.ts` | Complete |
| Cloud Storage Sync | Remote backup of versions catalog via Firebase Firestore | `useResumeStore.ts` | Planned |
| AI Bullet Enhancer | Integration with Gemini API for resume bullet impact scoring | `src/components/forms/` | Planned |

### Verification Command

```bash
pnpm test
pnpm run build
```
