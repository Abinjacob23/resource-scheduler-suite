
import jsPDF from 'jspdf';
import { ReportType } from '@/types/dashboard';
import { toast } from 'sonner';

export const generateReportPDF = (report: ReportType) => {
  // Create a PDF document
  const pdf = new jsPDF();
  
  // Add a title to the PDF
  pdf.setFontSize(18);
  pdf.setTextColor(0, 0, 128); // Navy blue color for title
  pdf.text(report.title, 20, 20);
  
  // Add a divider line
  pdf.setDrawColor(200, 200, 200);
  pdf.line(20, 25, 190, 25);
  
  // Add metadata - creation date
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100); // Gray color for metadata
  pdf.text(`Created: ${report.createdAt} | Last updated: ${report.updatedAt}`, 20, 33);
  
  // Add content
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0); // Black color for content
  
  // Split the content into lines to fit the page width
  const contentLines = pdf.splitTextToSize(report.content, 170);
  pdf.text(contentLines, 20, 45);
  
  // Add page numbers if content is long
  if (contentLines.length > 40) {
    const pageCount = pdf.internal.pages.length;
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Page ${i} of ${pageCount}`, pdf.internal.pageSize.width - 40, pdf.internal.pageSize.height - 10);
    }
  }
  
  // Add a footer with organization name
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Event Management System', 20, pdf.internal.pageSize.height - 10);
  
  // Save the PDF
  pdf.save(`${report.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  
  toast.success(`Report "${report.title}" is being downloaded as PDF`);
};
