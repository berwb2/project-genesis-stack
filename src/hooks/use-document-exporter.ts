
import { useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from '@/components/ui/sonner';

export const useDocumentExporter = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPdf = async (elementId: string, documentTitle: string) => {
    const input = document.getElementById(elementId);
    if (!input) {
      toast.error("Could not find the document content to export.");
      return;
    }

    setIsExporting(true);
    toast.info("Generating PDF, please wait...");

    try {
      const canvas = await html2canvas(input, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        backgroundColor: null,
        windowWidth: input.scrollWidth,
        windowHeight: input.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      const ratio = canvasHeight / canvasWidth;
      const imgHeight = pdfWidth * ratio;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      
      pdf.save(`${documentTitle}.pdf`);
      toast.success("PDF exported successfully!");

    } catch (error) {
      console.error("Error exporting to PDF:", error);
      toast.error("Failed to export PDF. Check console for details.");
    } finally {
      setIsExporting(false);
    }
  };

  return { isExporting, exportToPdf };
};
