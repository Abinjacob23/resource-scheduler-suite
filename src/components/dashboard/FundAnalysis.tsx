
import { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { FundAnalysisType } from '@/types/dashboard';
import CustomButton from '../ui/custom-button';

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
    alert('Fund analysis saved successfully!');
  };

  return (
    <div className="animate-scale-in">
      <h1 className="content-title">Fund Analysis</h1>
      
      <div className="dashboard-card max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
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
                      className="form-input"
                      placeholder="Section name"
                      required
                    />
                  </div>
                  <div className="col-span-4">
                    <input
                      type="number"
                      value={section.amount}
                      onChange={(e) => handleSectionChange(index, 'amount', e.target.value)}
                      className="form-input"
                      placeholder="Amount"
                      min="0"
                      required
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-muted/30 rounded-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Total Amount</h3>
              <span className="text-xl font-semibold">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-6">
            <CustomButton type="submit">
              Save Analysis
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FundAnalysis;
