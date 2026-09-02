import { IContactInformation } from './IContactInformation';
import { IExperienceItem } from './IExperienceItem';
import { IEducationItem } from './IEducationItem';
import { IProjectItem } from './IProjectItem';
import { ICertificationItem } from './ICertificationItem';
import { ICustomSection } from './ICustomSection';

export interface IResumeData {
  contactInformation: IContactInformation;
  profileSummary: string;
  skillsList: string[];
  languagesList: string[];
  certificationsList: ICertificationItem[];
  educationList: IEducationItem[];
  projectsList: IProjectItem[];
  experienceList: IExperienceItem[];
  customSectionsList: ICustomSection[];
  sectionOrder: string[];
  sectionVisibility: Record<string, boolean>;
  sectionPageBreaks?: Record<string, boolean>;
}

