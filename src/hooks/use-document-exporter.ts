
import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from '@/components/ui/sonner';

export const useDocumentExporter = () => {
  const [isExporting, setIsExporting] = useState(false);

  const addStyledHeaderAndFooter = (doc: jsPDF, pageNum: number, totalPages: number) => {
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 15;

    // Header
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor('#64748b'); // slate-500
    doc.text('DeepWaters Workspace', margin, 12);
    
    // Header Line
    doc.setDrawColor('#3b82f6'); 
    doc.setLineWidth(0.3);
    doc.line(margin, 15, pageW - margin, 15);

    // Footer
    if (totalPages > 0) {
      doc.line(margin, pageH - 15, pageW - margin, pageH - 15);
      doc.setFontSize(9);
      doc.setTextColor('#64748b');
      doc.text(`Page ${pageNum} of ${totalPages}`, pageW / 2, pageH - 10, { align: 'center' });
      doc.text(new Date().toLocaleDateString(), pageW - margin, pageH - 10, { align: 'right' });
    }
  };

  const downloadAsPdf = async (elementId: string, documentTitle: string) => {
    const input = document.getElementById(elementId);
    if (!input) {
      toast.error("Could not find the document content to export.");
      return;
    }

    setIsExporting(true);
    toast.info("Generating your beautiful PDF, please wait...");

    try {
      const canvas = await html2canvas(input, {
        scale: 2.5, // Higher scale for better quality
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Cover Page
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(32);
      pdf.setTextColor('#1e40af'); // deep blue
      const titleLines = pdf.splitTextToSize(documentTitle, pdfWidth - 30 * 2);
      pdf.text(titleLines, pdfWidth / 2, pdfHeight / 2 - 30, { align: 'center' });
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      pdf.setTextColor('#475569'); // slate-600
      pdf.text(`Generated from your DeepWaters Workspace`, pdfWidth / 2, pdfHeight / 2, { align: 'center' });
      pdf.text(new Date().toLocaleString(), pdfWidth / 2, pdfHeight / 2 + 10, { align: 'center' });


      // Content pages
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      const headerHeight = 20;
      const footerHeight = 20;
      const contentHeight = pdfHeight - headerHeight - footerHeight;

      let heightLeft = imgHeight;
      let position = 0;
      let pageCount = 0;
      const totalPages = Math.ceil(imgHeight / contentHeight);

      if (totalPages > 0) {
        // Add first content page
        pageCount++;
        pdf.addPage();
        addStyledHeaderAndFooter(pdf, pageCount, totalPages);
        pdf.addImage(imgData, 'PNG', 0, headerHeight, pdfWidth, imgHeight);
        heightLeft -= contentHeight;

        // Add subsequent pages
        while (heightLeft > 0) {
          position -= contentHeight;
          pageCount++;
          pdf.addPage();
          addStyledHeaderAndFooter(pdf, pageCount, totalPages);
          pdf.addImage(imgData, 'PNG', 0, position + headerHeight, pdfWidth, imgHeight);
          heightLeft -= contentHeight;
        }
      }
      
      pdf.save(`${documentTitle}.pdf`);
      toast.success("PDF masterpiece has been downloaded!");

    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF. Check console for details.");
    } finally {
      setIsExporting(false);
    }
  };

  return { isExporting, downloadAsPdf };
};
