
export type MenuItemType = {
  id: string;
  label: string;
  icon: string;
};

export type EventRequestType = {
  association: string;
  eventName: string;
  date: string;
  description: string;
  status?: 'pending' | 'approved' | 'rejected';
};

export type ResourceType = 
  | 'mba-seminar-hall'
  | 'main-seminar-hall'
  | 'ccf-lab'
  | 'auditorium'
  | 'pes-field';

export type ResourceLabel = {
  [key in ResourceType]: string;
};

export type ResourceRequestType = {
  eventName: string;
  date: string;
  resources: ResourceType[];
  status?: 'pending' | 'approved' | 'rejected';
};

export type FundAnalysisType = {
  section: string;
  amount: number;
};

export type ReportType = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type CollaborationRequestType = {
  eventId: string;
  eventName: string;
  message: string;
};

export type CalendarBookingType = {
  id: string;
  resourceId: ResourceType;
  title: string;
  start: string;
  end: string;
};
