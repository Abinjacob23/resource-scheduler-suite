
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import ReportList from './report/ReportList';
import ReportCreate from './report/ReportCreate';
import ReportEdit from './report/ReportEdit';
import ReportPreview from './report/ReportPreview';
import { useReports } from './report/useReports';
import { ReportType } from '@/types/dashboard';

const Report = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'list' | 'create' | 'edit' | 'preview'>('list');
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [newReport, setNewReport] = useState<Omit<ReportType, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    content: ''
  });
  
  const { reports, loading, fetchReports, createReport, updateReport } = useReports(user);

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user, fetchReports]);

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

  const handleSaveNewReport = async () => {
    if (!user) {
      toast.error('You must be logged in to create a report');
      return;
    }
    
    if (!newReport.title.trim() || !newReport.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createReport(newReport);
      setActiveView('list');
      toast.success('Report created successfully!');
    } catch (error) {
      console.error('Error creating report:', error);
      toast.error('Failed to create report');
    }
  };

  const handleUpdateReport = async () => {
    if (!selectedReport || !user) return;
    
    try {
      await updateReport(selectedReport);
      setActiveView('list');
      toast.success('Report updated successfully!');
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error('Failed to update report');
    }
  };

  if (loading && activeView === 'list') {
    return (
      <div className="animate-scale-in">
        <h1 className="content-title">Reports</h1>
        <div className="dashboard-card">
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <span>Loading reports...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-scale-in">
      <div className="flex justify-between items-center mb-4">
        <h1 className="content-title">Reports</h1>
        {activeView !== 'list' && (
          <button 
            onClick={() => setActiveView('list')} 
            className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm"
          >
            Back to List
          </button>
        )}
      </div>
      
      {activeView === 'list' && (
        <ReportList 
          reports={reports} 
          onCreateClick={handleCreateClick}
          onEditClick={handleEditClick}
          onPreviewClick={handlePreviewClick}
        />
      )}
      
      {activeView === 'create' && (
        <ReportCreate
          newReport={newReport}
          setNewReport={setNewReport}
          onSave={handleSaveNewReport}
        />
      )}
      
      {activeView === 'edit' && selectedReport && (
        <ReportEdit
          report={selectedReport}
          setReport={setSelectedReport}
          onUpdate={handleUpdateReport}
        />
      )}
      
      {activeView === 'preview' && selectedReport && (
        <ReportPreview report={selectedReport} />
      )}
    </div>
  );
};

export default Report;
