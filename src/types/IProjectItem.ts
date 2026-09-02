export interface IProjectItem {
  identifier: string;
  projectTitle: string;
  projectSubtitle?: string;
  projectUrl?: string;
  startDate?: string;
  endDate?: string;
  bulletPoints: string[];
  pageBreakBefore?: boolean;
}

