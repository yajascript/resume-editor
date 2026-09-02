export interface IExperienceItem {
  identifier: string;
  jobTitle: string;
  companyName: string;
  locationName?: string;
  startDate: string;
  endDate: string;
  isCurrentRole: boolean;
  bulletPoints: string[];
  pageBreakBefore?: boolean;
}
