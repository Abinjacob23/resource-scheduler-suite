
import { FC } from 'react';
import { ReportType } from '@/types/dashboard';
import CustomButton from '@/components/ui/custom-button';

interface ReportCreateProps {
  newReport: Omit<ReportType, 'id' | 'createdAt' | 'updatedAt'>;
  setNewReport: React.Dispatch<React.SetStateAction<Omit<ReportType, 'id' | 'createdAt' | 'updatedAt'>>>;
  onSave: () => Promise<void>;
}

const ReportCreate: FC<ReportCreateProps> = ({ newReport, setNewReport, onSave }) => {
  return (
    <div className="dashboard-card">
      <h2 className="text-lg font-semibold mb-4">Create New Report</h2>
      <div className="space-y-4">
        <div className="form-group">
          <label htmlFor="title" className="form-label">Report Title</label>
          <input
            type="text"
            id="title"
            value={newReport.title}
            onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
            className="form-input"
            placeholder="Enter report title"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content" className="form-label">Report Content</label>
          <textarea
            id="content"
            value={newReport.content}
            onChange={(e) => setNewReport({ ...newReport, content: e.target.value })}
            className="form-textarea"
            placeholder="Write your report content here..."
            rows={10}
            required
          />
        </div>
        
        <div className="mt-4">
          <CustomButton onClick={onSave}>
            Save Report
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default ReportCreate;
