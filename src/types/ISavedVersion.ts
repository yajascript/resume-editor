import { IResumeData } from './IResumeData';
import { IEditorState } from './IEditorState';

export interface ISavedVersion {
  identifier: string;
  versionName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isDraft?: boolean;
  resumeData: IResumeData;
  frenchResumeData?: IResumeData;
  englishResumeData?: IResumeData;
  savedLanguages?: ('en' | 'fr')[];
  editorState: IEditorState;
}
