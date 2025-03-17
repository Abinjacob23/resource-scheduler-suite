
import { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { FundAnalysisType } from '@/types/dashboard';
import CustomButton from '../ui/custom-button';
import { toast } from 'sonner';

const FundAnalysis = () => {
  const [sections, setSections] = useState<FundAnalysisType[]>([
    { section: 'Venue', amount: 0 },
    { section: 'Refreshments', amount: 0 },
    { section: 'Equipment', amount: 0 }
  ]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Fund analysis submitted:', sections);
    toast.success('Fund analysis saved successfully!');
  };

  return (
    <div className="animate-scale-in">
      <h1 className="text-2xl font-bold mb-6">Fund Analysis</h1>
      
      <div className="bg-card border border-border rounded-lg shadow-sm p-6 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
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
              Save Analysis
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FundAnalysis;
