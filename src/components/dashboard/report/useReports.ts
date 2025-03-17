
import { useState, useCallback } from 'react';
import { ReportType } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

type DbReport = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
};

export const useReports = (user: User | null) => {
  const [reports, setReports] = useState<ReportType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Convert from DB format to app format
      const formattedReports: ReportType[] = (data || []).map((report: DbReport) => ({
        id: report.id,
        title: report.title,
        content: report.content,
        createdAt: new Date(report.created_at).toISOString().split('T')[0],
        updatedAt: new Date(report.updated_at).toISOString().split('T')[0]
      }));
      
      setReports(formattedReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createReport = async (newReport: Omit<ReportType, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('reports')
      .insert({
        title: newReport.title,
        content: newReport.content,
        user_id: user.id
      })
      .select();
    
    if (error) throw error;
    
    await fetchReports();
    return data;
  };

  const updateReport = async (report: ReportType) => {
    if (!user) throw new Error('User not authenticated');
    
    const { error } = await supabase
      .from('reports')
      .update({
        title: report.title,
        content: report.content,
        updated_at: new Date().toISOString()
      })
      .eq('id', report.id);
    
    if (error) throw error;
    
    await fetchReports();
  };

  return {
    reports,
    loading,
    fetchReports,
    createReport,
    updateReport
  };
};
