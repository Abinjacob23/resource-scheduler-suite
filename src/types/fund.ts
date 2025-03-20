
export type FundAnalysis = {
  id: string;
  user_id: string;
  event_id: string;
  title: string;
  total_amount: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
};

export type FundAnalysisSection = {
  id: string;
  fund_analysis_id: string;
  section_name: string;
  amount: number;
  created_at: string;
};

export type NewFundAnalysis = {
  event_id: string;
  title: string;
  sections: {
    section_name: string;
    amount: number;
  }[];
};
