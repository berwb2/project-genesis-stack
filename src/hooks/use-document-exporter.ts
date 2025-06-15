
import { useState } from 'react';
import jsPDF from 'jspdf';
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
        backgroundColor: '#ffffff', // Use white background for PDF
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
      
      const imgProps= pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      const headerHeight = 20;
      const footerHeight = 20;
      const contentHeight = pdfHeight - headerHeight - footerHeight;

      let heightLeft = imgHeight;
      let position = 0;
      let pageCount = 1;

      const addHeaderAndFooter = (doc: jsPDF, pageNum: number, totalPages: number) => {
        // Header
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('DeepWaters Document', 15, 12);
        doc.text(new Date().toLocaleDateString(), pdfWidth - 15, 12, { align: 'right' });
        doc.line(15, 15, pdfWidth - 15, 15);

        // Footer
        if (totalPages > 0) {
          doc.setFontSize(10);
          doc.setTextColor(100);
          doc.line(15, pdfHeight - 15, pdfWidth - 15, pdfHeight - 15);
          doc.text(`Page ${pageNum} of ${totalPages}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
        }
      };
      
      // Calculate total pages
      const totalPages = Math.ceil(imgHeight / contentHeight);

      // Add first page
      addHeaderAndFooter(pdf, pageCount, totalPages);
      pdf.addImage(imgData, 'PNG', 0, headerHeight, pdfWidth, imgHeight);
      heightLeft -= contentHeight;

      // Add subsequent pages
      while (heightLeft > 0) {
        position -= contentHeight;
        pageCount++;
        pdf.addPage();
        addHeaderAndFooter(pdf, pageCount, totalPages);
        pdf.addImage(imgData, 'PNG', 0, position + headerHeight, pdfWidth, imgHeight);
        heightLeft -= contentHeight;
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
