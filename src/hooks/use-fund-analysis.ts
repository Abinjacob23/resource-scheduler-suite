
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { FundAnalysis, FundAnalysisSection, NewFundAnalysis } from '@/types/fund';

export const useFundAnalysis = () => {
  const { user } = useAuth();
  const [fundAnalyses, setFundAnalyses] = useState<FundAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [approvedEvents, setApprovedEvents] = useState<{id: string, event_name: string}[]>([]);

  useEffect(() => {
    if (user) {
      fetchFundAnalyses();
      fetchApprovedEvents();
    }
  }, [user]);

  const fetchFundAnalyses = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('fund_analysis')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Ensure status is one of the allowed values in the FundAnalysis type
      const typedData = (data || []).map(item => ({
        ...item,
        status: item.status as FundAnalysis['status']
      }));
      
      setFundAnalyses(typedData);
    } catch (error) {
      console.error('Error fetching fund analyses:', error);
      toast.error('Failed to load fund analyses');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApprovedEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, event_name')
        .eq('user_id', user?.id || '')
        .eq('status', 'approved');
      
      if (error) throw error;
      
      setApprovedEvents(data || []);
    } catch (error) {
      console.error('Error fetching approved events:', error);
    }
  };

  const createFundAnalysis = async (newFundAnalysis: NewFundAnalysis) => {
    if (!user) {
      toast.error('You must be logged in to create a fund analysis');
      return null;
    }

    try {
      // Calculate total amount from sections
      const totalAmount = newFundAnalysis.sections.reduce((sum, section) => sum + section.amount, 0);
      
      // First create the fund analysis record
      const { data: fundAnalysisData, error: fundAnalysisError } = await supabase
        .from('fund_analysis')
        .insert({
          user_id: user.id,
          event_id: newFundAnalysis.event_id,
          title: newFundAnalysis.title,
          total_amount: totalAmount,
          status: 'pending'
        })
        .select()
        .single();
      
      if (fundAnalysisError) throw fundAnalysisError;
      
      if (!fundAnalysisData) {
        throw new Error('Failed to create fund analysis');
      }
      
      // Then create all the sections
      const sectionsToInsert = newFundAnalysis.sections.map(section => ({
        fund_analysis_id: fundAnalysisData.id,
        section_name: section.section_name,
        amount: section.amount
      }));
      
      const { error: sectionsError } = await supabase
        .from('fund_analysis_sections')
        .insert(sectionsToInsert);
      
      if (sectionsError) throw sectionsError;
      
      // Refresh the list
      fetchFundAnalyses();
      
      toast.success('Fund analysis created successfully');
      return fundAnalysisData;
    } catch (error) {
      console.error('Error creating fund analysis:', error);
      toast.error('Failed to create fund analysis');
      return null;
    }
  };

  const getFundAnalysisSections = async (fundAnalysisId: string) => {
    try {
      const { data, error } = await supabase
        .from('fund_analysis_sections')
        .select('*')
        .eq('fund_analysis_id', fundAnalysisId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      return data as FundAnalysisSection[];
    } catch (error) {
      console.error('Error fetching fund analysis sections:', error);
      return [];
    }
  };

  const updateFundAnalysisStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('fund_analysis')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      
      fetchFundAnalyses();
      
      toast.success(`Fund analysis ${status}`);
      return true;
    } catch (error) {
      console.error(`Error ${status} fund analysis:`, error);
      toast.error(`Failed to ${status} fund analysis`);
      return false;
    }
  };

  return {
    fundAnalyses,
    isLoading,
    approvedEvents,
    createFundAnalysis,
    getFundAnalysisSections,
    updateFundAnalysisStatus,
    refreshFundAnalyses: fetchFundAnalyses
  };
};
