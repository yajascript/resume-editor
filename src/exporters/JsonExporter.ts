import { saveAs } from 'file-saver';
import { IResumeData } from '@/types';

export class JsonExporter {
  /**
   * Export the current resume data as a formatted JSON file.
   */
  public static export(resumeData: IResumeData, fileName?: string): void {
    const targetName = fileName || `${resumeData.contactInformation.fullName.replace(/\s+/g, '_') || 'resume'}.json`;
    const jsonString = JSON.stringify(resumeData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    saveAs(blob, targetName);
  }

  /**
   * Read and parse a user uploaded JSON file.
   */
  public static async importFromFile(file: File): Promise<IResumeData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const parsed = JSON.parse(content);
          resolve(parsed);
        } catch (err) {
          reject(new Error('Invalid JSON file format.'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file.'));
      reader.readAsText(file);
    });
  }
}
