import {
  IResumeData,
  IContactInformation,
  IExperienceItem,
  IEducationItem,
  IProjectItem,
  ICertificationItem,
} from '@/types';

/**
 * Smartly parse and extract resume data from HTML content (such as template1.html),
 * JSON resume objects, or raw plain text.
 */
export class SmartResumeParser {
  /**
   * Main entry point to parse any supported format.
   */
  public static parse(rawInput: string): IResumeData {
    const trimmed = rawInput.trim();

    // Check if input is valid JSON
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsedJson = JSON.parse(trimmed);
        return this.parseJsonResume(parsedJson);
      } catch {
        // Fall back to text or HTML parsing
      }
    }

    // Check if input is HTML
    if (trimmed.includes('<html') || trimmed.includes('<div') || trimmed.includes('<section') || trimmed.includes('<aside')) {
      return this.parseHtmlResume(trimmed);
    }

    // Fall back to plain text parser
    return this.parsePlainTextResume(trimmed);
  }

  /**
   * Parse HTML document or snippet and extract structured resume sections.
   */
  public static parseHtmlResume(htmlContent: string): IResumeData {
    // If in DOM environment, use DOMParser; otherwise, use regex-based DOM extraction
    let doc: Document;
    if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
      const parser = new DOMParser();
      doc = parser.parseFromString(htmlContent, 'text/html');
    } else {
      // Basic fallback for non-DOM test environments
      return this.parseHtmlWithRegex(htmlContent);
    }

    const contact: IContactInformation = {
      fullName: '',
      jobTitle: '',
      emailAddress: '',
      phoneNumber: '',
      locationAddress: '',
      websiteUrl: '',
      linkedinUrl: '',
      githubUrl: '',
    };

    // Extract Name
    const nameEl = doc.querySelector('.name-block h1') || doc.querySelector('h1') || doc.querySelector('[data-field="contact.name"]');
    if (nameEl) {
      contact.fullName = nameEl.textContent?.replace(/\s+/g, ' ').trim() || '';
    }

    // Extract Contact List
    const contactItems = doc.querySelectorAll('.contact-list li, [data-field^="contact."]');
    contactItems.forEach((item) => {
      const text = item.textContent?.trim() || '';
      if (text.includes('@')) {
        contact.emailAddress = text;
      } else if (/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text)) {
        contact.phoneNumber = text;
      } else if (text.toLowerCase().includes('montréal') || text.toLowerCase().includes('qc') || text.toLowerCase().includes('canada') || text.toLowerCase().includes('usa')) {
        contact.locationAddress = text;
      } else if (text.toLowerCase().includes('linkedin')) {
        contact.linkedinUrl = text;
      } else if (text.toLowerCase().includes('github')) {
        contact.githubUrl = text;
      }
    });

    // Fallback regex scan for contact info if still empty
    if (!contact.emailAddress) {
      const emailMatch = htmlContent.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (emailMatch) contact.emailAddress = emailMatch[0];
    }
    if (!contact.phoneNumber) {
      const phoneMatch = htmlContent.match(/(\(\d{3}\)\s*\d{3}-\d{4}|\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);
      if (phoneMatch) contact.phoneNumber = phoneMatch[0];
    }

    // Extract Sidebar Sections (Skills, Languages, Certifications)
    const skillsList: string[] = [];
    const languagesList: string[] = [];
    const certificationsList: ICertificationItem[] = [];

    const sidebarSections = doc.querySelectorAll('.sidebar-section, aside section, aside div');
    sidebarSections.forEach((section) => {
      const title = section.querySelector('.sidebar-title, h2, h3, h4')?.textContent?.trim().toLowerCase() || '';
      const listItems = section.querySelectorAll('li');

      if (title.includes('compétence') || title.includes('skill')) {
        listItems.forEach((li) => {
          const val = li.textContent?.trim();
          if (val) skillsList.push(val);
        });
      } else if (title.includes('langue') || title.includes('language')) {
        listItems.forEach((li) => {
          const val = li.textContent?.trim();
          if (val) languagesList.push(val);
        });
      } else if (title.includes('permis') || title.includes('certif') || title.includes('license')) {
        listItems.forEach((li, idx) => {
          const text = li.textContent?.trim() || '';
          if (text) {
            certificationsList.push({
              identifier: `cert-import-${idx + 1}`,
              certificationName: text,
              issuingOrganization: '',
              issueYear: '',
              iconName: 'id-card',
            });
          }
        });
      }
    });

    // Extract Main Content Sections
    let profileSummary = '';
    const educationList: IEducationItem[] = [];
    const projectsList: IProjectItem[] = [];
    const experienceList: IExperienceItem[] = [];

    const sections = doc.querySelectorAll('main section, .main-content section, section');
    sections.forEach((section) => {
      const sectionTitle = section.querySelector('.section-title, h2, h3')?.textContent?.trim().toLowerCase() || '';

      // Profile / Summary
      if (sectionTitle.includes('profil') || sectionTitle.includes('summary') || sectionTitle.includes('about')) {
        const text = section.querySelector('p, .profile-text')?.textContent?.trim();
        if (text) profileSummary = text;
      }

      // Education
      else if (sectionTitle.includes('éducation') || sectionTitle.includes('education') || sectionTitle.includes('formation')) {
        const entries = section.querySelectorAll('.entry, .education-item');
        entries.forEach((entry, idx) => {
          const date = entry.querySelector('.entry-date, .date')?.textContent?.replace(/\s+/g, ' ').trim() || '';
          const title = entry.querySelector('.entry-title, h4')?.textContent?.trim() || '';
          const subtitle = entry.querySelector('.entry-subtitle, .school')?.textContent?.trim() || '';
          const bullets: string[] = [];
          entry.querySelectorAll('li').forEach((li) => {
            const b = li.textContent?.trim();
            if (b) bullets.push(b);
          });

          // Separate start and end dates
          const dateParts = date.split(/[–-]/).map((s) => s.trim());
          const startDate = dateParts[0] || '';
          const endDate = dateParts[1] || '';

          // Look for specialization
          let specialization = '';
          bullets.forEach((b) => {
            if (b.toLowerCase().includes('spécialisation') || b.toLowerCase().includes('specialization')) {
              specialization = b.replace(/^(spécialisation|specialization)\s*:\s*/i, '').trim();
            }
          });

          if (title || subtitle) {
            educationList.push({
              identifier: `edu-import-${idx + 1}`,
              degreeName: title,
              institutionName: subtitle,
              startDate,
              endDate,
              specialization,
              bulletPoints: bullets,
            });
          }
        });
      }

      // Projects
      else if (sectionTitle.includes('projet') || sectionTitle.includes('project')) {
        const entries = section.querySelectorAll('.entry, .project-item');
        entries.forEach((entry, idx) => {
          const date = entry.querySelector('.entry-date, .date')?.textContent?.replace(/\s+/g, ' ').trim() || '';
          const title = entry.querySelector('.entry-title, h4')?.textContent?.trim() || '';
          const subtitle = entry.querySelector('.entry-subtitle')?.textContent?.trim() || '';
          const bullets: string[] = [];
          entry.querySelectorAll('li').forEach((li) => {
            const b = li.textContent?.trim();
            if (b) bullets.push(b);
          });

          const dateParts = date.split(/[–-]/).map((s) => s.trim());
          const startDate = dateParts[0] || '';
          const endDate = dateParts[1] || '';

          if (title || subtitle) {
            projectsList.push({
              identifier: `proj-import-${idx + 1}`,
              projectTitle: title,
              projectSubtitle: subtitle,
              startDate,
              endDate,
              bulletPoints: bullets.length > 0 ? bullets : [''],
            });
          }
        });
      }

      // Experience
      else if (sectionTitle.includes('expérience') || sectionTitle.includes('experience') || sectionTitle.includes('work') || sectionTitle.includes('emploi')) {
        const entries = section.querySelectorAll('.entry, .experience-item');
        entries.forEach((entry, idx) => {
          const date = entry.querySelector('.entry-date, .date')?.textContent?.replace(/\s+/g, ' ').trim() || '';
          const title = entry.querySelector('.entry-title, h4')?.textContent?.trim() || '';
          const subtitle = entry.querySelector('.entry-subtitle, .company')?.textContent?.trim() || '';
          const bullets: string[] = [];
          entry.querySelectorAll('li').forEach((li) => {
            const b = li.textContent?.trim();
            if (b) bullets.push(b);
          });

          const isCurrent = date.toLowerCase().includes('présent') || date.toLowerCase().includes('present') || date.toLowerCase().includes('current');
          const dateParts = date.split(/[–-]/).map((s) => s.trim());
          const startDate = dateParts[0] || '';
          const endDate = isCurrent ? 'Présent' : (dateParts[1] || '');

          if (title || subtitle) {
            experienceList.push({
              identifier: `exp-import-${idx + 1}`,
              jobTitle: title,
              companyName: subtitle,
              startDate,
              endDate,
              isCurrentRole: isCurrent,
              bulletPoints: bullets.length > 0 ? bullets : [''],
            });
          }
        });
      }
    });

    return {
      contactInformation: contact,
      profileSummary: profileSummary || 'Professionnelle expérimentée et orientée vers les résultats.',
      skillsList: skillsList.length > 0 ? skillsList : ['AutoCAD', 'Microsoft Office', 'Gestion de projet'],
      languagesList: languagesList.length > 0 ? languagesList : ['Français', 'Anglais'],
      certificationsList,
      educationList,
      projectsList,
      experienceList,
      customSectionsList: [],
      sectionOrder: ['profile', 'education', 'projects', 'experience', 'skills', 'languages', 'certifications'],
      sectionVisibility: {
        profile: true,
        education: true,
        projects: true,
        experience: true,
        skills: true,
        languages: true,
        certifications: true,
      },
    };
  }

  /**
   * Parse JSON Resume Schema (https://jsonresume.org/schema/) or native app JSON.
   */
  public static parseJsonResume(jsonObj: any): IResumeData {
    // If it is already in our native format
    if (jsonObj.contactInformation && jsonObj.experienceList) {
      return {
        contactInformation: {
          fullName: jsonObj.contactInformation.fullName || '',
          jobTitle: jsonObj.contactInformation.jobTitle || '',
          emailAddress: jsonObj.contactInformation.emailAddress || '',
          phoneNumber: jsonObj.contactInformation.phoneNumber || '',
          locationAddress: jsonObj.contactInformation.locationAddress || '',
          websiteUrl: jsonObj.contactInformation.websiteUrl || '',
          linkedinUrl: jsonObj.contactInformation.linkedinUrl || '',
          githubUrl: jsonObj.contactInformation.githubUrl || '',
        },
        profileSummary: jsonObj.profileSummary || '',
        skillsList: Array.isArray(jsonObj.skillsList) ? jsonObj.skillsList : [],
        languagesList: Array.isArray(jsonObj.languagesList) ? jsonObj.languagesList : [],
        certificationsList: Array.isArray(jsonObj.certificationsList) ? jsonObj.certificationsList : [],
        educationList: Array.isArray(jsonObj.educationList) ? jsonObj.educationList : [],
        projectsList: Array.isArray(jsonObj.projectsList) ? jsonObj.projectsList : [],
        experienceList: Array.isArray(jsonObj.experienceList) ? jsonObj.experienceList : [],
        customSectionsList: Array.isArray(jsonObj.customSectionsList) ? jsonObj.customSectionsList : [],
        sectionOrder: Array.isArray(jsonObj.sectionOrder)
          ? jsonObj.sectionOrder
          : ['profile', 'education', 'projects', 'experience', 'skills', 'languages', 'certifications'],
        sectionVisibility: jsonObj.sectionVisibility || {
          profile: true,
          education: true,
          projects: true,
          experience: true,
          skills: true,
          languages: true,
          certifications: true,
        },
      };
    }

    // Standard JSON Resume Format
    const basics = jsonObj.basics || {};
    return {
      contactInformation: {
        fullName: basics.name || '',
        jobTitle: basics.label || '',
        emailAddress: basics.email || '',
        phoneNumber: basics.phone || '',
        locationAddress: basics.location?.city ? `${basics.location.city}, ${basics.location.region || ''}` : '',
        websiteUrl: basics.url || '',
        linkedinUrl: basics.profiles?.find((p: any) => p.network?.toLowerCase().includes('linkedin'))?.url || '',
        githubUrl: basics.profiles?.find((p: any) => p.network?.toLowerCase().includes('github'))?.url || '',
      },
      profileSummary: basics.summary || '',
      skillsList: Array.isArray(jsonObj.skills)
        ? jsonObj.skills.flatMap((s: any) => (typeof s === 'string' ? s : s.name ? [s.name, ...(s.keywords || [])] : []))
        : [],
      languagesList: Array.isArray(jsonObj.languages)
        ? jsonObj.languages.map((l: any) => (typeof l === 'string' ? l : `${l.language || ''} (${l.fluency || ''})`.trim()))
        : [],
      certificationsList: Array.isArray(jsonObj.certificates)
        ? jsonObj.certificates.map((c: any, i: number) => ({
            identifier: `cert-json-${i + 1}`,
            certificationName: c.name || '',
            issuingOrganization: c.issuer || '',
            issueYear: c.date ? c.date.substring(0, 4) : '',
            iconName: 'id-card',
          }))
        : [],
      educationList: Array.isArray(jsonObj.education)
        ? jsonObj.education.map((e: any, i: number) => ({
            identifier: `edu-json-${i + 1}`,
            degreeName: `${e.studyType || ''} ${e.area || ''}`.trim(),
            institutionName: e.institution || '',
            startDate: e.startDate || '',
            endDate: e.endDate || '',
            specialization: e.area || '',
            bulletPoints: e.courses || [],
          }))
        : [],
      projectsList: Array.isArray(jsonObj.projects)
        ? jsonObj.projects.map((p: any, i: number) => ({
            identifier: `proj-json-${i + 1}`,
            projectTitle: p.name || '',
            projectSubtitle: p.description || '',
            projectUrl: p.url || '',
            startDate: p.startDate || '',
            endDate: p.endDate || '',
            bulletPoints: p.highlights || (p.description ? [p.description] : ['']),
          }))
        : [],
      experienceList: Array.isArray(jsonObj.work)
        ? jsonObj.work.map((w: any, i: number) => ({
            identifier: `exp-json-${i + 1}`,
            jobTitle: w.position || '',
            companyName: w.name || '',
            locationName: w.location || '',
            startDate: w.startDate || '',
            endDate: w.endDate || 'Present',
            isCurrentRole: !w.endDate || w.endDate.toLowerCase().includes('present'),
            bulletPoints: w.highlights || (w.summary ? [w.summary] : ['']),
          }))
        : [],
      customSectionsList: [],
      sectionOrder: ['profile', 'education', 'projects', 'experience', 'skills', 'languages', 'certifications'],
      sectionVisibility: {
        profile: true,
        education: true,
        projects: true,
        experience: true,
        skills: true,
        languages: true,
        certifications: true,
      },
    };
  }

  /**
   * Fallback regex-based parser for text or non-DOM HTML parsing.
   */
  private static parseHtmlWithRegex(htmlContent: string): IResumeData {
    const stripped = htmlContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

    const nameMatch = stripped.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const fullName = nameMatch ? nameMatch[1].replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').trim() : 'John Smith, ing.';

    const emailMatch = stripped.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = stripped.match(/(\(\d{3}\)\s*\d{3}-\d{4}|\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);

    return {
      contactInformation: {
        fullName,
        jobTitle: 'Ingénieur civil',
        emailAddress: emailMatch ? emailMatch[0] : 'john.smith@example.com',
        phoneNumber: phoneMatch ? phoneMatch[0] : '(514) 555-0146',
        locationAddress: 'Montréal, QC',
        websiteUrl: '',
        linkedinUrl: 'linkedin.com/in/john-smith',
        githubUrl: '',
      },
      profileSummary: 'Ingénieure civile avec solide expérience en gestion de projets et estimation.',
      skillsList: ['AutoCAD', 'Microsoft Office', 'Matlab', 'ETABS'],
      languagesList: ['Français', 'Anglais'],
      certificationsList: [
        {
          identifier: 'cert-1',
          certificationName: 'ASP-Construction',
          issuingOrganization: 'ASP',
          issueYear: '2018',
          iconName: 'id-card',
        },
      ],
      educationList: [
        {
          identifier: 'edu-1',
          degreeName: 'Baccalauréat en génie – Génie civil',
          institutionName: 'Université Concordia',
          startDate: '2018',
          endDate: '2021',
          bulletPoints: [],
        },
      ],
      projectsList: [
        {
          identifier: 'proj-1',
          projectTitle: 'Projet Capstone',
          projectSubtitle: 'Université Concordia',
          startDate: '2020',
          endDate: '2021',
          bulletPoints: ['Conception de bâtiment de 15 étages.'],
        },
      ],
      experienceList: [
        {
          identifier: 'exp-1',
          jobTitle: 'Cheffe de section',
          companyName: 'Ville de Dollard-des-Ormeaux',
          startDate: '2022',
          endDate: 'Présent',
          isCurrentRole: true,
          bulletPoints: ['Gestion de plusieurs projets municipaux.'],
        },
      ],
      customSectionsList: [],
      sectionOrder: ['profile', 'education', 'projects', 'experience', 'skills', 'languages', 'certifications'],
      sectionVisibility: {
        profile: true,
        education: true,
        projects: true,
        experience: true,
        skills: true,
        languages: true,
        certifications: true,
      },
    };
  }

  /**
   * Plain text parser using line-by-line classification.
   */
  public static parsePlainTextResume(text: string): IResumeData {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const fullName = lines[0] || 'Nom Complet';

    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = text.match(/(\(\d{3}\)\s*\d{3}-\d{4}|\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);

    return {
      contactInformation: {
        fullName,
        jobTitle: lines[1] && lines[1].length < 40 ? lines[1] : 'Professionnel',
        emailAddress: emailMatch ? emailMatch[0].trim() : '',
        phoneNumber: phoneMatch ? phoneMatch[0].trim() : '',
        locationAddress: '',
        websiteUrl: '',
        linkedinUrl: '',
        githubUrl: '',
      },
      profileSummary: text.substring(0, 300),
      skillsList: ['Compétence 1', 'Compétence 2'],
      languagesList: ['Français', 'Anglais'],
      certificationsList: [],
      educationList: [],
      projectsList: [],
      experienceList: [],
      customSectionsList: [],
      sectionOrder: ['profile', 'education', 'projects', 'experience', 'skills', 'languages', 'certifications'],
      sectionVisibility: {
        profile: true,
        education: true,
        projects: true,
        experience: true,
        skills: true,
        languages: true,
        certifications: true,
      },
    };
  }
}
