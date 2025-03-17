
import { FC } from 'react';
import { ReportType } from '@/types/dashboard';
import CustomButton from '@/components/ui/custom-button';

interface ReportEditProps {
  report: ReportType;
  setReport: React.Dispatch<React.SetStateAction<ReportType | null>>;
  onUpdate: () => Promise<void>;
}

const ReportEdit: FC<ReportEditProps> = ({ report, setReport, onUpdate }) => {
  return (
    <div className="dashboard-card">
      <h2 className="text-lg font-semibold mb-4">Edit Report</h2>
      <div className="space-y-4">
        <div className="form-group">
          <label htmlFor="edit-title" className="form-label">Report Title</label>
          <input
            type="text"
            id="edit-title"
            value={report.title}
            onChange={(e) => setReport({ ...report, title: e.target.value })}
            className="form-input"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="edit-content" className="form-label">Report Content</label>
          <textarea
            id="edit-content"
            value={report.content}
            onChange={(e) => setReport({ ...report, content: e.target.value })}
            className="form-textarea"
            rows={10}
            required
          />
        </div>
        
        <div className="mt-4">
          <CustomButton onClick={onUpdate}>
            Update Report
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default ReportEdit;
