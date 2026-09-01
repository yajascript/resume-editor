import { IResumeData } from './IResumeData';

export interface ITemplateProps {
  resumeData: IResumeData;
  onFieldChange: (fieldPath: string, updatedValue: any) => void;
  accentColor: string;
  fontFamily: string;
}
