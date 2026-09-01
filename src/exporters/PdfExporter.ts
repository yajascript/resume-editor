import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { useResumeStore } from '@/store';

export interface PdfExportOptions {
  paperSize?: 'letter' | 'a4';
  fileName?: string;
}

export class PdfExporter {
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

    // High resolution raster capture
    const dataUrl = await toPng(node, {
      quality: 1.0,
      pixelRatio: 2,
      cacheBust: true,
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

    // Guard against blank trailing pages caused by minor padding overflows (< 5%)
    const heightRatio = naturalHeight / pagePixelHeight;
    let totalPages = Math.ceil(heightRatio);
    if (heightRatio <= 1.06) {
      totalPages = 1;
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: isA4 ? 'a4' : 'letter',
    });

    if (totalPages === 1) {
      // Single Page: fit cleanly within the page bounds
      pdf.addImage(dataUrl, 'PNG', 0, 0, standardPageWidth, standardPageHeight, undefined, 'FAST');
      pdf.save(fileName);
      return;
    }

    // Multi-Page Slicing: only create pages that have content
    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      const sourceY = pageIndex * pagePixelHeight;
      const sourceHeight = Math.min(pagePixelHeight, naturalHeight - sourceY);

      // Skip empty slices
      if (sourceHeight <= 10) continue;

      if (pageIndex > 0) {
        pdf.addPage(isA4 ? 'a4' : 'letter', 'portrait');
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

    pdf.save(fileName);
  }

  /**
   * Export both English and French resume versions in a single combined 2-page PDF
   * (Page 1 = English Resume, Page 2 = French Resume).
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

    const [enDataUrl, frDataUrl] = await Promise.all([
      toPng(enNode, { quality: 1.0, pixelRatio: 2, cacheBust: true }),
      toPng(frNode, { quality: 1.0, pixelRatio: 2, cacheBust: true }),
    ]);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: isA4 ? 'a4' : 'letter',
    });

    // Page 1: English Resume
    pdf.addImage(enDataUrl, 'PNG', 0, 0, standardPageWidth, standardPageHeight, undefined, 'FAST');

    // Page 2: French Resume
    pdf.addPage(isA4 ? 'a4' : 'letter', 'portrait');
    pdf.addImage(frDataUrl, 'PNG', 0, 0, standardPageWidth, standardPageHeight, undefined, 'FAST');

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
