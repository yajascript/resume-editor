export interface IExportOptions {
  documentFormat: 'pdf' | 'docx' | 'png' | 'jpeg' | 'json';
  paperSize: 'letter' | 'a4';
  dpiQuality?: number;
  fileName: string;
}
