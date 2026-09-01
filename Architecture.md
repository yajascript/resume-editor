# Resume Builder — Architecture Living Document

> **Status:** Active & Canonical  
> **Source Repository:** `/Users/ajay/Development/resume-editor`  
> **Last Updated:** August 31, 2026  

---

## 1. System Overview & Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | Static site generation, client-side hydration, zero serverless compute overhead |
| **Language** | TypeScript 5.7+ | Strict mode, full-word descriptive naming, strict 1:1 single-entity file isolation |
| **Styling** | Tailwind CSS 3.4 + CSS Modules | Custom paper shadows, print media queries, glassmorphic floating toolbars |
| **State Management** | Zustand 5.0 + Persist | `localStorage` persistence with snapshot-based Undo/Redo history stack, dual-language persistence |
| **Document Exporters** | `docx`, `jspdf`, `html-to-image`, `file-saver` | 100% client-side compilation for Word (.docx), Multi-Page Sliced Vector/Raster PDF, High-Res PNG/JPEG, JSON |
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
│   │   ├── IExperienceItem.ts       # Work experience item contract
│   │   ├── IEducationItem.ts        # Education degree item contract
│   │   ├── IProjectItem.ts          # Project item contract
│   │   ├── ICertificationItem.ts    # Certification & license contract
│   │   ├── ICustomSectionItem.ts    # Dynamic section item contract
│   │   ├── ICustomSection.ts        # Custom section container contract
│   │   ├── IResumeData.ts           # Universal normalized resume schema
│   │   ├── ISavedVersion.ts         # Saved snapshot version contract
│   │   ├── ITemplateProps.ts        # Template component props contract
│   │   ├── ITemplate.ts             # Template registry metadata contract
│   │   ├── IEditorState.ts          # UI state, zoom, paper size, tabs, activeSection, dual view, theme
│   │   └── IExportOptions.ts        # Document export options
│   ├── store/
│   │   ├── index.ts                 # Store barrel export
│   │   ├── useResumeStore.ts        # Zustand store with mutators, dual language persistence & bi-directional focus
│   │   └── defaultResumeData.ts     # Prepopulated generic placeholder FR & EN CV datasets
│   ├── i18n/
│   │   ├── index.ts                 # i18n barrel export
│   │   └── i18n.ts                  # Single joint FR/EN dictionary with interpolation
│   ├── templates/
│   │   ├── index.ts                 # Templates barrel export
│   │   ├── TemplateRegistry.ts      # Multi-template catalog & registry
│   │   ├── SidebarNavyTemplate.tsx  # Exact 1:1 reproduction of template1.html with click-to-focus
│   │   ├── MinimalCleanTemplate.tsx # Single-column minimalist layout with click-to-focus
│   │   ├── ModernSplitTemplate.tsx  # Top header banner + 2-column body with click-to-focus
│   │   ├── ExecutiveClassicTemplate.tsx # Traditional serif executive layout with click-to-focus
│   │   └── TechMinimalistTemplate.tsx   # Software engineer streamlined layout with click-to-focus
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
│   │   │   └── EditableText.tsx     # Inline WYSIWYG contenteditable binding
│   │   ├── forms/
│   │   │   ├── index.ts             # Forms barrel export
│   │   │   ├── ContactForm.tsx      # Contact details form
│   │   │   ├── SummaryForm.tsx      # Summary form with character counter
│   │   │   ├── ExperienceForm.tsx   # Ergonomic expandable cards with fast paste & keyboard shortcuts
│   │   │   ├── EducationForm.tsx    # Ergonomic expandable cards with fast paste
│   │   │   ├── SkillsForm.tsx       # Skills tags manager
│   │   │   ├── LanguagesForm.tsx    # Languages manager
│   │   │   ├── CertificationsForm.tsx # Licenses & certifications
│   │   │   ├── ProjectsForm.tsx     # Featured projects with expandable cards & fast paste
│   │   │   ├── CustomSectionsForm.tsx # Custom user-defined sections
│   │   │   ├── SectionOrderForm.tsx # Drag/order & visibility toggles
│   │   │   └── AppearanceForm.tsx   # Template, accent color & font selector
│   │   └── layout/
│   │       ├── index.ts             # Layout barrel export
│   │       ├── EditorHeader.tsx     # Top header bar (actions, dual view toggle, language, theme)
│   │       ├── EditorSidebar.tsx    # Accordion control panel with auto-focus & scrolling
│   │       └── WorkspaceCanvas.tsx  # Zoomable A4/Letter paper canvas supporting side-by-side Dual View
│   ├── exporters/
│   │   ├── index.ts                 # Exporters barrel export
│   │   ├── DocxExporter.ts          # Native OpenXML .docx generation
│   │   ├── PdfExporter.ts           # Client-side PDF export & native print
│   │   ├── ImageExporter.ts         # High-DPI PNG and JPEG exporter
│   │   └── JsonExporter.ts          # JSON resume backup exporter and loader
│   └── utils/
│       ├── index.ts                 # Utilities barrel export
│       ├── classNames.ts            # clsx & tailwind-merge helper
│       ├── dateHelpers.ts           # Date normalization utilities
│       └── htmlParser.ts            # Smart HTML, JSON & text section detector
└── __tests__/
    ├── components/                  # ResumeEditor integration tests
    ├── store/                       # Store mutations, versions, & undo/redo unit tests
    ├── utils/                       # Smart parser & date helper unit tests
    └── i18n/                        # Dictionary completeness & interpolation tests
```

---

## 3. ASCII Visual Diagrams

### Component Architecture & Dual View / Focus Flow
```
┌────────────────────────────────────────────────────────────────────────────┐
│                             Next.js App Shell                              │
│                                (src/app)                                   │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                                EditorHeader                                │
│   • Versions Dialog  • Dual View (EN+FR)  • Undo/Redo  • Export  • Theme   │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │
                 ┌────────────────────┴────────────────────┐
                 ▼                                         ▼
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│          EditorSidebar          │       │         WorkspaceCanvas         │
│  • Content Accordions (Cards)   │       │  • Zoom Controls (50% - 200%)   │
│  • Quick Language Switcher Bar  │ ◄───► │  • Side-by-Side Dual View (FR+EN)│
│  • Highlight Active Accordion   │       │  • Interactive Click-to-Focus   │
│  • Fast Paste Multiline Bullets │       │  • Auto-Scroll on Sidebar Focus │
└────────────────┬────────────────┘       └────────────────┬────────────────┘
                 │                                         │
                 │   Bidirectional State Sync (Zustand)    │
                 │  `activeSection` & `focusedSource`      │
                 └────────────────────┬────────────────────┘
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                              useResumeStore                                │
│      (Persisted via LocalStorage • Max 25 Snapshots History Stack)         │
│      • Dual Language State: `frenchResumeData` & `englishResumeData`       │
│      • Version Management: duplicate, exportCatalog, importCatalog         │
│      • Completely isolated per client, 100% Free, Zero Backend Cost        │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            ▼                         ▼                         ▼
┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐
│     DocxExporter      │ │      PdfExporter      │ │     ImageExporter     │
│ Native OpenXML .docx  │ │  jsPDF + Vector Print │ │ High-DPI PNG & JPEG   │
└───────────────────────┘ └───────────────────────┘ └───────────────────────┘
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
  }>;
  projectsList: Array<{
    identifier: string;
    projectTitle: string;
    projectSubtitle?: string;
    projectUrl?: string;
    startDate?: string;
    endDate?: string;
    bulletPoints: string[];
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
  }>;
  customSectionsList: Array<{
    identifier: string;
    sectionTitle: string;
    items: Array<{
      identifier: string;
      itemTitle: string;
      itemSubtitle?: string;
      dateRange?: string;
      bulletPoints: string[];
    }>;
  }>;
  sectionOrder: string[];
  sectionVisibility: Record<string, boolean>;
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

## 5. Testing Standards, Quality Gates & Baseline Metrics

> **Testing Directive:** Single centralized testing authority for the repository. All test suites execute deterministically without flaky asynchronous timing or loose truth checks.

### Baseline Test Suites

| Test Suite | File Path | Assertions & Coverage | Target | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Component Integration** | `__tests__/components/ResumeEditor.test.tsx` | Header, sidebar, canvas rendering, language toggle, template switching | 100% pass | ✅ Passing |
| **i18n Dictionary** | `__tests__/i18n/i18n.test.ts` | Exact key parity between FR and EN, variable interpolation | 100% pass | ✅ Passing |
| **Smart Parser** | `__tests__/utils/htmlParser.test.ts` | HTML, JSON Resume, and Plain text section extraction | 100% pass | ✅ Passing |
| **Zustand Store** | `__tests__/store/useResumeStore.test.ts` | Mutators, versions, catalog export/import, undo/redo, focus sync | 100% pass | ✅ Passing |

### Verification Command

```bash
pnpm test
```
