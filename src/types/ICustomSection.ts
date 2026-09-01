import { ICustomSectionItem } from './ICustomSectionItem';

export interface ICustomSection {
  identifier: string;
  sectionTitle: string;
  items: ICustomSectionItem[];
}
