
import { useState, useEffect } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { FundAnalysisType } from '@/types/dashboard';
import CustomButton from '../ui/custom-button';
import { toast } from 'sonner';
import { useFundAnalysis } from '@/hooks/use-fund-analysis';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventStatusBadge from '../admin/EventStatusBadge';

const FundAnalysis = () => {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [title, setTitle] = useState('');
  const [activeTab, setActiveTab] = useState('create');
  const [sections, setSections] = useState<FundAnalysisType[]>([
    { section: 'Venue', amount: 0 },
    { section: 'Refreshments', amount: 0 },
    { section: 'Equipment', amount: 0 }
  ]);
  
  const { 
    approvedEvents, 
    isLoading, 
    fundAnalyses, 
    createFundAnalysis,
    getFundAnalysisSections,
    refreshFundAnalyses
  } = useFundAnalysis();
  
  const [expandedFundId, setExpandedFundId] = useState<string | null>(null);
  const [fundSections, setFundSections] = useState<{[key: string]: any[]}>({});

  const handleAddSection = () => {
    setSections([...sections, { section: '', amount: 0 }]);
  };

  const handleRemoveSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSectionChange = (index: number, field: keyof FundAnalysisType, value: string | number) => {
    const updatedSections = [...sections];
    
    if (field === 'amount') {
      updatedSections[index][field] = Number(value) || 0;
    } else {
      updatedSections[index][field] = value as string;
    }
    
    setSections(updatedSections);
  };

  const totalAmount = sections.reduce((sum, item) => sum + item.amount, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEvent) {
      toast.error('Please select an event');
      return;
    }
    
    if (!title.trim()) {
      toast.error('Please enter a title for your fund analysis');
      return;
    }
    
    if (sections.some(section => !section.section.trim())) {
      toast.error('All sections must have a name');
      return;
    }
    
    const newFundAnalysis = {
      event_id: selectedEvent,
      title,
      sections: sections.map(s => ({
        section_name: s.section,
        amount: s.amount
      }))
    };
    
    const result = await createFundAnalysis(newFundAnalysis);
    
    if (result) {
      // Reset form
      setSelectedEvent('');
      setTitle('');
      setSections([
        { section: 'Venue', amount: 0 },
        { section: 'Refreshments', amount: 0 },
        { section: 'Equipment', amount: 0 }
      ]);
      setActiveTab('view');
    }
  };
  
  const toggleFundDetails = async (fundId: string) => {
    if (expandedFundId === fundId) {
      setExpandedFundId(null);
      return;
    }
    
    setExpandedFundId(fundId);
    
    if (!fundSections[fundId]) {
      const sections = await getFundAnalysisSections(fundId);
      setFundSections(prev => ({
        ...prev,
        [fundId]: sections
      }));
    }
  };
  
  useEffect(() => {
    // Refresh fund analyses when switching to the view tab
    if (activeTab === 'view') {
      refreshFundAnalyses();
    }
  }, [activeTab]);

  if (isLoading) {
    return (
      <div className="animate-scale-in">
        <h1 className="text-2xl font-bold mb-6">Fund Analysis</h1>
        <div className="bg-card border border-border rounded-lg shadow-sm p-6 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <span>Loading fund analysis data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-scale-in">
      <h1 className="text-2xl font-bold mb-6">Fund Analysis</h1>
      
      <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="create">Create Fund Analysis</TabsTrigger>
          <TabsTrigger value="view">View Fund Analyses</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="animate-fade-in">
          <div className="bg-card border border-border rounded-lg shadow-sm p-6 max-w-3xl mx-auto">
            {approvedEvents.length === 0 ? (
              <div className="text-center py-8">
                <h2 className="text-lg font-medium mb-2">No Approved Events</h2>
                <p className="text-muted-foreground mb-4">
                  You need to have an approved event before you can create a fund analysis.
                </p>
                <CustomButton 
                  onClick={() => window.location.href = '/dashboard/event-request'} 
                  className="mt-2"
                >
                  Create an Event Request
                </CustomButton>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="event" className="block text-sm font-medium">
                      Select Event
                    </label>
                    <select
                      id="event"
                      value={selectedEvent}
                      onChange={(e) => setSelectedEvent(e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Select an approved event</option>
                      {approvedEvents.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.event_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium">
                      Fund Analysis Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="E.g., Annual Tech Conference Budget"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Sections</h2>
                    <CustomButton 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={handleAddSection}
                      className="flex items-center"
                    >
                      <PlusCircle className="mr-1 h-4 w-4" />
                      Add Section
                    </CustomButton>
                  </div>
                  
                  <div className="space-y-3">
                    {sections.map((section, index) => (
                      <div key={index} className="grid grid-cols-12 gap-3 items-center">
                        <div className="col-span-7">
                          <input
                            type="text"
                            value={section.section}
                            onChange={(e) => handleSectionChange(index, 'section', e.target.value)}
                            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Section name"
                            required
                          />
                        </div>
                        <div className="col-span-4">
                          <input
                            type="number"
                            value={section.amount}
                            onChange={(e) => handleSectionChange(index, 'amount', e.target.value)}
                            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Amount"
                            min="0"
                            required
                          />
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveSection(index)}
                            className="text-destructive hover:text-destructive/80 transition-colors"
                            aria-label="Remove section"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-muted/30 rounded-md">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Total Amount</h3>
                    <span className="text-xl font-semibold">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                
                <div>
                  <CustomButton type="submit" className="w-full">
                    Submit Fund Analysis
                  </CustomButton>
                </div>
              </form>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="view" className="animate-fade-in">
          <div className="bg-card border border-border rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Your Fund Analysis Requests</h2>
            
            {fundAnalyses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                You haven't created any fund analysis requests yet.
              </div>
            ) : (
              <div className="space-y-4">
                {fundAnalyses.map((fund) => (
                  <div 
                    key={fund.id} 
                    className="border border-border rounded-md overflow-hidden"
                  >
                    <div 
                      className="p-4 bg-muted/20 cursor-pointer"
                      onClick={() => toggleFundDetails(fund.id)}
                    >
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <div>
                          <h3 className="font-medium text-base">{fund.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Created: {new Date(fund.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="font-medium">${fund.total_amount.toFixed(2)}</p>
                          <EventStatusBadge status={fund.status} />
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
                          <div className="mt-4 text-sm text-muted-foreground">
                            This fund analysis is pending approval from administrators.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FundAnalysis;
