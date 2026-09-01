export interface IEducationItem {
  identifier: string;
  degreeName: string;
  institutionName: string;
  locationName?: string;
  startDate: string;
  endDate: string;
  specialization?: string;
  bulletPoints?: string[];
}
