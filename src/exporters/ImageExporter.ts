import { toPng, toJpeg } from 'html-to-image';
import { useResumeStore } from '@/store';

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

export class ImageExporter {
  /**
   * Export a DOM element to PNG or JPEG image.
   */
  public static async export(
    format: 'png' | 'jpeg' = 'png',
    elementId: string = 'resume-sheet',
    fileName?: string
  ): Promise<void> {
    // Clear any active focus highlighting before taking the image snapshot
    const activeSection = useResumeStore.getState().editorState.activeSection;
    if (activeSection) {
      useResumeStore.getState().setActiveSection(null);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }

    const node = document.getElementById(elementId) || document.getElementById('resume-sheet');
    if (!node) {
      throw new Error(`Element with id "${elementId}" not found for Image export.`);
    }

    const targetName = fileName || `resume.${format}`;

    const dataUrl =
      format === 'png'
        ? await toPng(node, { quality: 1.0, pixelRatio: 2, cacheBust: true, filter: captureFilter })
        : await toJpeg(node, { quality: 0.95, pixelRatio: 2, cacheBust: true, filter: captureFilter });

    const link = document.createElement('a');
    link.download = targetName;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
