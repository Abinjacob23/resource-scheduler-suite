
import { useState } from 'react';
import { File, Edit, Eye, Download, Plus } from 'lucide-react';
import { mockReports } from '@/utils/mock-data';
import { ReportType } from '@/types/dashboard';
import CustomButton from '../ui/custom-button';

const Report = () => {
  const [activeView, setActiveView] = useState<'list' | 'create' | 'edit' | 'preview'>('list');
  const [reports, setReports] = useState<ReportType[]>(mockReports);
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [newReport, setNewReport] = useState<Omit<ReportType, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    content: ''
  });

  const handleCreateClick = () => {
    setActiveView('create');
    setNewReport({ title: '', content: '' });
  };

  const handleEditClick = (report: ReportType) => {
    setSelectedReport(report);
    setActiveView('edit');
  };

  const handlePreviewClick = (report: ReportType) => {
    setSelectedReport(report);
    setActiveView('preview');
  };

  const handleDownloadClick = (report: ReportType) => {
    // In a real app, this would trigger a download
    console.log(`Downloading report: ${report.title}`);
    alert(`Report "${report.title}" is being downloaded`);
  };

  const handleSaveNewReport = () => {
    const date = new Date().toISOString().split('T')[0];
    const newReportWithId: ReportType = {
      id: `${reports.length + 1}`,
      title: newReport.title,
      content: newReport.content,
      createdAt: date,
      updatedAt: date
    };
    
    setReports([...reports, newReportWithId]);
    setActiveView('list');
    alert('Report created successfully!');
  };

  const handleUpdateReport = () => {
    if (!selectedReport) return;
    
    const updatedReports = reports.map(report => 
      report.id === selectedReport.id 
        ? { ...selectedReport, updatedAt: new Date().toISOString().split('T')[0] }
        : report
    );
    
    setReports(updatedReports);
    setActiveView('list');
    alert('Report updated successfully!');
  };

  return (
    <div className="animate-scale-in">
      <div className="flex justify-between items-center mb-4">
        <h1 className="content-title">Reports</h1>
        {activeView !== 'list' && (
          <CustomButton 
            onClick={() => setActiveView('list')} 
            variant="outline"
          >
            Back to List
          </CustomButton>
        )}
      </div>
      
      {activeView === 'list' && (
        <div className="dashboard-card">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="dashboard-card p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/20 transition-colors"
                 onClick={handleCreateClick}>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <p className="font-medium">Create Report</p>
            </div>
            
            <div className="dashboard-card p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/20 transition-colors"
                 onClick={() => reports.length > 0 && handleEditClick(reports[0])}>
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                <Edit className="h-6 w-6 text-amber-600" />
              </div>
              <p className="font-medium">Edit Report</p>
            </div>
            
            <div className="dashboard-card p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/20 transition-colors"
                 onClick={() => reports.length > 0 && handlePreviewClick(reports[0])}>
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
              <p className="font-medium">Download Report</p>
            </div>
          </div>
          
          <h2 className="text-lg font-semibold mb-4">Recent Reports</h2>
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
                      onClick={() => handlePreviewClick(report)}
                      className="p-1 rounded hover:bg-muted transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleEditClick(report)}
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
        </div>
      )}
      
      {activeView === 'create' && (
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
              <CustomButton onClick={handleSaveNewReport}>
                Save Report
              </CustomButton>
            </div>
          </div>
        </div>
      )}
      
      {activeView === 'edit' && selectedReport && (
        <div className="dashboard-card">
          <h2 className="text-lg font-semibold mb-4">Edit Report</h2>
          <div className="space-y-4">
            <div className="form-group">
              <label htmlFor="edit-title" className="form-label">Report Title</label>
              <input
                type="text"
                id="edit-title"
                value={selectedReport.title}
                onChange={(e) => setSelectedReport({ ...selectedReport, title: e.target.value })}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="edit-content" className="form-label">Report Content</label>
              <textarea
                id="edit-content"
                value={selectedReport.content}
                onChange={(e) => setSelectedReport({ ...selectedReport, content: e.target.value })}
                className="form-textarea"
                rows={10}
                required
              />
            </div>
            
            <div className="mt-4">
              <CustomButton onClick={handleUpdateReport}>
                Update Report
              </CustomButton>
            </div>
          </div>
        </div>
      )}
      
      {activeView === 'preview' && selectedReport && (
        <div className="dashboard-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">{selectedReport.title}</h2>
            <div className="text-sm text-muted-foreground">
              Last updated: {selectedReport.updatedAt}
            </div>
          </div>
          
          <div className="prose max-w-none">
            <p className="whitespace-pre-line">{selectedReport.content}</p>
          </div>
          
          <div className="mt-6 flex justify-end">
            <CustomButton 
              onClick={() => handleDownloadClick(selectedReport)} 
              variant="outline"
              className="flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </CustomButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
