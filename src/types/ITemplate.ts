import React from 'react';
import { ITemplateProps } from './ITemplateProps';

export interface ITemplate {
  identifier: string;
  templateName: string;
  description: string;
  thumbnailGradient: string;
  accentColors: string[];
  component: React.ComponentType<ITemplateProps>;
}
