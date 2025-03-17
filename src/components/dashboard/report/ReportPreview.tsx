
import { FC } from 'react';
import { Download } from 'lucide-react';
import { ReportType } from '@/types/dashboard';
import CustomButton from '@/components/ui/custom-button';
import { generateReportPDF } from './reportUtils';

interface ReportPreviewProps {
  report: ReportType;
}

const ReportPreview: FC<ReportPreviewProps> = ({ report }) => {
  const handleDownloadClick = () => {
    generateReportPDF(report);
  };

  return (
    <div className="dashboard-card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{report.title}</h2>
        <div className="text-sm text-muted-foreground">
          Last updated: {report.updatedAt}
        </div>
      </div>
      
      <div className="prose max-w-none">
        <p className="whitespace-pre-line">{report.content}</p>
      </div>
      
      <div className="mt-6 flex justify-end">
        <CustomButton 
          onClick={handleDownloadClick} 
          variant="outline"
          className="flex items-center"
        >
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </CustomButton>
      </div>
    </div>
  );
};

export default ReportPreview;
