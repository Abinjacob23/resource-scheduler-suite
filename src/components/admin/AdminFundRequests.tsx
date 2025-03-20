
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import EventStatusBadge from './EventStatusBadge';
import CustomButton from '../ui/custom-button';
import { hasAdminAccess } from '@/utils/admin-utils';

const AdminFundRequests = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [fundRequests, setFundRequests] = useState<any[]>([]);
  const [expandedFundId, setExpandedFundId] = useState<string | null>(null);
  const [fundSections, setFundSections] = useState<{[key: string]: any[]}>({});
  const [eventNames, setEventNames] = useState<{[key: string]: string}>({});
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (user && hasAdminAccess(user)) {
      fetchFundRequests();
    }
  }, [user, activeTab]);

  const fetchFundRequests = async () => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('fund_analysis')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (activeTab !== 'all') {
        query = query.eq('status', activeTab);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setFundRequests(data || []);
      
      // Fetch event names for all fund requests
      const eventIds = [...new Set(data?.map(fund => fund.event_id) || [])];
      await fetchEventNames(eventIds);
    } catch (error) {
      console.error('Error fetching fund requests:', error);
      toast.error('Failed to load fund requests');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEventNames = async (eventIds: string[]) => {
    if (eventIds.length === 0) return;
    
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, event_name')
        .in('id', eventIds);
      
      if (error) throw error;
      
      const eventMap: {[key: string]: string} = {};
      data?.forEach(event => {
        eventMap[event.id] = event.event_name;
      });
      
      setEventNames(eventMap);
    } catch (error) {
      console.error('Error fetching event names:', error);
    }
  };

  const toggleFundDetails = async (fundId: string) => {
    if (expandedFundId === fundId) {
      setExpandedFundId(null);
      return;
    }
    
    setExpandedFundId(fundId);
    
    if (!fundSections[fundId]) {
      try {
        const { data, error } = await supabase
          .from('fund_analysis_sections')
          .select('*')
          .eq('fund_analysis_id', fundId)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        setFundSections(prev => ({
          ...prev,
          [fundId]: data || []
        }));
      } catch (error) {
        console.error('Error fetching fund sections:', error);
        toast.error('Failed to load fund sections');
      }
    }
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('fund_analysis')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setFundRequests(prev => 
        prev.map(fund => fund.id === id ? { ...fund, status } : fund)
      );
      
      toast.success(`Fund analysis ${status} successfully`);
    } catch (error) {
      console.error(`Error ${status} fund analysis:`, error);
      toast.error(`Failed to ${status} fund analysis`);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Fund Analysis Requests</h1>
        <div className="dashboard-card flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <span>Loading fund requests...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Fund Analysis Requests</h1>
      
      <div className="dashboard-card">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="animate-fade-in">
            {fundRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No fund analysis requests found
              </div>
            ) : (
              <div className="space-y-4">
                {fundRequests.map((fund) => (
                  <div key={fund.id} className="border border-border rounded-md overflow-hidden">
                    <div 
                      className="p-4 bg-muted/20 cursor-pointer"
                      onClick={() => toggleFundDetails(fund.id)}
                    >
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <div>
                          <h3 className="font-medium text-base">{fund.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Event: {eventNames[fund.event_id] || 'Loading...'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Created: {new Date(fund.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="font-medium">${fund.total_amount.toFixed(2)}</p>
                          <EventStatusBadge status={fund.status} />
                          {expandedFundId === fund.id ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {expandedFundId === fund.id && (
                      <div className="p-4 border-t border-border">
                        <h4 className="font-medium mb-2">Fund Analysis Sections</h4>
                        {!fundSections[fund.id] ? (
                          <div className="flex items-center justify-center py-4">
                            <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                            <span>Loading sections...</span>
                          </div>
                        ) : fundSections[fund.id].length === 0 ? (
                          <p className="text-sm text-muted-foreground">No sections found</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-muted/30">
                                  <th className="text-left p-2 text-sm font-medium text-muted-foreground">Section</th>
                                  <th className="text-right p-2 text-sm font-medium text-muted-foreground">Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {fundSections[fund.id].map((section) => (
                                  <tr key={section.id} className="border-b border-muted/30">
                                    <td className="p-2">{section.section_name}</td>
                                    <td className="p-2 text-right">${section.amount.toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                        
                        {fund.status === 'pending' && (
                          <div className="flex items-center gap-3 mt-4">
                            <CustomButton
                              onClick={() => handleUpdateStatus(fund.id, 'approved')}
                              className="bg-green-800/30 hover:bg-green-800/50 text-green-400 flex items-center"
                              size="sm"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </CustomButton>
                            <CustomButton
                              onClick={() => handleUpdateStatus(fund.id, 'rejected')}
                              className="bg-red-800/30 hover:bg-red-800/50 text-red-400 flex items-center"
                              size="sm"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </CustomButton>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminFundRequests;
