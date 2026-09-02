import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { useResumeStore } from '@/store';

export interface PdfExportOptions {
  paperSize?: 'letter' | 'a4';
  fileName?: string;
}

const captureFilter = (domNode: Node): boolean => {
  if (domNode instanceof HTMLElement) {
    if (
      domNode.classList.contains('pagebreak-ui-control') ||
      domNode.classList.contains('no-print') ||
      domNode.getAttribute('data-pagebreak-ui') === 'true'
    ) {
      return false;
    }
  }
  return true;
};

export class PdfExporter {
  /**
   * Helper: Appends all sliced pages of an element to a jsPDF instance.
   */
  private static async appendElementPages(
    pdf: jsPDF,
    element: HTMLElement,
    standardPageWidth: number,
    standardPageHeight: number,
    isFirstElement: boolean,
    isA4: boolean
  ): Promise<void> {
    const dataUrl = await toPng(element, {
      quality: 1.0,
      pixelRatio: 2,
      cacheBust: true,
      filter: captureFilter,
    });

    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load captured image for PDF export.'));
      img.src = dataUrl;
    });

    const naturalWidth = img.naturalWidth || img.width;
    const naturalHeight = img.naturalHeight || img.height;

    const targetAspectRatio = standardPageHeight / standardPageWidth;
    const pagePixelHeight = Math.floor(naturalWidth * targetAspectRatio);

    // Calculate how many total pages are needed (ignoring minor sub-20px tolerances)
    const totalPages = Math.max(1, Math.ceil((naturalHeight - 20) / pagePixelHeight));

    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      if (!isFirstElement || pageIndex > 0) {
        pdf.addPage(isA4 ? 'a4' : 'letter', 'portrait');
      }

      const sourceY = pageIndex * pagePixelHeight;
      const sourceHeight = Math.min(pagePixelHeight, naturalHeight - sourceY);

      if (totalPages === 1) {
        pdf.addImage(dataUrl, 'PNG', 0, 0, standardPageWidth, standardPageHeight, undefined, 'FAST');
        break;
      }

      const canvas = document.createElement('canvas');
      canvas.width = naturalWidth;
      canvas.height = pagePixelHeight;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(
          img,
          0,
          sourceY,
          naturalWidth,
          sourceHeight,
          0,
          0,
          naturalWidth,
          sourceHeight
        );
      }

      const pageDataUrl = canvas.toDataURL('image/jpeg', 0.98);
      pdf.addImage(pageDataUrl, 'JPEG', 0, 0, standardPageWidth, standardPageHeight, undefined, 'FAST');
    }
  }

  /**
   * Export a single resume sheet to a clean PDF document without blank overflow pages.
   */
  public static async export(
    elementId: string = 'resume-sheet',
    options: PdfExportOptions = {}
  ): Promise<void> {
    const { paperSize = 'letter', fileName = 'resume_EN.pdf' } = options;

    // Clear any active focus highlighting before taking the snapshot
    const activeSection = useResumeStore.getState().editorState.activeSection;
    if (activeSection) {
      useResumeStore.getState().setActiveSection(null);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }

    const node = document.getElementById(elementId) || document.getElementById('resume-sheet');
    if (!node) {
      throw new Error(`Element with id "${elementId}" not found for PDF export.`);
    }

    const isA4 = paperSize === 'a4';
    const standardPageWidth = isA4 ? 8.27 : 8.5; // in inches
    const standardPageHeight = isA4 ? 11.69 : 11.0; // in inches

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: isA4 ? 'a4' : 'letter',
    });

    await this.appendElementPages(pdf, node, standardPageWidth, standardPageHeight, true, isA4);

    pdf.save(fileName);
  }

  /**
   * Export both English and French resume versions in a single combined multi-page PDF.
   */
  public static async exportJointBilingual(options: {
    enElementId?: string;
    frElementId?: string;
    paperSize?: 'letter' | 'a4';
    fileName?: string;
  }): Promise<void> {
    const {
      enElementId = 'resume-sheet-en',
      frElementId = 'resume-sheet-fr',
      paperSize = 'letter',
      fileName = 'resume_EN_FR.pdf',
    } = options;

    // Clear active focus
    useResumeStore.getState().setActiveSection(null);
    await new Promise((resolve) => setTimeout(resolve, 80));

    const enNode = document.getElementById(enElementId) || document.getElementById('resume-sheet');
    const frNode = document.getElementById(frElementId) || document.getElementById('resume-sheet');

    if (!enNode || !frNode) {
      throw new Error('Both English and French resume sheets must be rendered on the canvas.');
    }

    const isA4 = paperSize === 'a4';
    const standardPageWidth = isA4 ? 8.27 : 8.5;
    const standardPageHeight = isA4 ? 11.69 : 11.0;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: isA4 ? 'a4' : 'letter',
    });

    // English Document pages first
    await this.appendElementPages(pdf, enNode, standardPageWidth, standardPageHeight, true, isA4);

    // French Document pages second
    await this.appendElementPages(pdf, frNode, standardPageWidth, standardPageHeight, false, isA4);

    pdf.save(fileName);
  }

  /**
   * Export both English and French resume versions into 2 separate PDF files.
   */
  public static async exportSeparateBilingual(options: {
    enElementId?: string;
    frElementId?: string;
    paperSize?: 'letter' | 'a4';
  }): Promise<void> {
    const {
      enElementId = 'resume-sheet-en',
      frElementId = 'resume-sheet-fr',
      paperSize = 'letter',
    } = options;

    await this.export(enElementId, {
      paperSize,
      fileName: 'resume_EN.pdf',
    });

    await new Promise((resolve) => setTimeout(resolve, 300));

    await this.export(frElementId, {
      paperSize,
      fileName: 'resume_FR.pdf',
    });
  }

  /**
   * Triggers native browser vector print dialogue.
   */
  public static triggerNativePrint(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}
