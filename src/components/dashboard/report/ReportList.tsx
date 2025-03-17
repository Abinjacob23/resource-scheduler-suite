
import { FC } from 'react';
import { File, Edit, Eye, Download, Plus } from 'lucide-react';
import { ReportType } from '@/types/dashboard';
import { generateReportPDF } from './reportUtils';

interface ReportListProps {
  reports: ReportType[];
  onCreateClick: () => void;
  onEditClick: (report: ReportType) => void;
  onPreviewClick: (report: ReportType) => void;
}

const ReportList: FC<ReportListProps> = ({ 
  reports, 
  onCreateClick, 
  onEditClick, 
  onPreviewClick 
}) => {
  const handleDownloadClick = (report: ReportType) => {
    generateReportPDF(report);
  };

  return (
    <div className="dashboard-card">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="dashboard-card p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/20 transition-colors"
             onClick={onCreateClick}>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <p className="font-medium">Create Report</p>
        </div>
        
        <div className="dashboard-card p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/20 transition-colors"
             onClick={() => reports.length > 0 && onEditClick(reports[0])}>
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
            <Edit className="h-6 w-6 text-amber-600" />
          </div>
          <p className="font-medium">Edit Report</p>
        </div>
        
        <div className="dashboard-card p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/20 transition-colors"
             onClick={() => reports.length > 0 && onPreviewClick(reports[0])}>
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
            <Eye className="h-6 w-6 text-blue-600" />
          </div>
          <p className="font-medium">Preview Report</p>
        </div>
        
        <div className="dashboard-card p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/20 transition-colors"
             onClick={() => reports.length > 0 && handleDownloadClick(reports[0])}>
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
            <Download className="h-6 w-6 text-green-600" />
          </div>
          <p className="font-medium">Download PDF</p>
        </div>
      </div>
      
      <h2 className="text-lg font-semibold mb-4">Recent Reports</h2>
      {reports.length > 0 ? (
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="border rounded-md p-4 hover:bg-muted/10 transition-colors">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{report.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Created: {report.createdAt} | Updated: {report.updatedAt}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onPreviewClick(report)}
                    className="p-1 rounded hover:bg-muted transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onEditClick(report)}
                    className="p-1 rounded hover:bg-muted transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDownloadClick(report)}
                    className="p-1 rounded hover:bg-muted transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No reports found. Create your first report using the options above.
        </div>
      )}
    </div>
  );
};

export default ReportList;
