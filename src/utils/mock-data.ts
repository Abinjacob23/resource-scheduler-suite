
import { 
  EventRequestType, 
  ResourceRequestType, 
  FundAnalysisType, 
  ReportType,
  ResourceType,
  ResourceLabel,
  CalendarBookingType
} from '@/types/dashboard';

export const RESOURCE_LABELS: ResourceLabel = {
  'mba-seminar-hall': 'MBA Seminar Hall',
  'main-seminar-hall': 'Main Seminar Hall',
  'ccf-lab': 'CCF Lab',
  'auditorium': 'Auditorium',
  'pes-field': 'PES Field'
};

// Mock data for event requests
export const mockEventRequests: EventRequestType[] = [
  {
    association: 'Computer Science Association',
    eventName: 'Tech Symposium 2023',
    date: '2023-11-25',
    description: 'Annual technology symposium with guest speakers and workshops',
    status: 'approved'
  },
  {
    association: 'Cultural Club',
    eventName: 'Annual Cultural Fest',
    date: '2023-12-15',
    description: 'Cultural events including dance, music and drama performances',
    status: 'pending'
  },
  {
    association: 'Sports Committee',
    eventName: 'Inter-College Sports Meet',
    date: '2024-01-10',
    description: 'Sports competitions between various colleges',
    status: 'rejected'
  }
];

// Mock data for resource requests
export const mockResourceRequests: ResourceRequestType[] = [
  {
    eventName: 'Tech Symposium 2023',
    date: '2023-11-25',
    resources: ['auditorium', 'ccf-lab'],
    status: 'approved'
  },
  {
    eventName: 'Workshop on AI',
    date: '2023-12-05',
    resources: ['mba-seminar-hall'],
    status: 'pending'
  },
  {
    eventName: 'Annual Sports Day',
    date: '2024-01-20',
    resources: ['pes-field'],
    status: 'approved'
  }
];

// Mock data for fund analysis
export const mockFundAnalysis: FundAnalysisType[] = [
  { section: 'Venue Booking', amount: 25000 },
  { section: 'Equipment Rental', amount: 15000 },
  { section: 'Refreshments', amount: 10000 },
  { section: 'Marketing', amount: 5000 },
  { section: 'Guest Honorarium', amount: 20000 }
];

// Mock data for reports
export const mockReports: ReportType[] = [
  {
    id: '1',
    title: 'Tech Symposium 2023 Report',
    content: 'The Tech Symposium was successfully conducted with over 500 participants. The event included workshops on AI, blockchain, and cloud computing. Guest speakers from leading tech companies shared their insights.',
    createdAt: '2023-11-30',
    updatedAt: '2023-12-01'
  },
  {
    id: '2',
    title: 'Cultural Fest 2023 Report',
    content: 'The Cultural Fest attracted participants from 15 colleges. Events included music, dance, and theatrical performances. The fest was appreciated for its organization and diverse cultural representation.',
    createdAt: '2023-12-20',
    updatedAt: '2023-12-21'
  },
  {
    id: '3',
    title: 'Annual Budget Analysis',
    content: 'This report analyzes the budget utilization for events conducted in 2023. It includes a breakdown of expenses, cost-saving measures implemented, and recommendations for future budgeting.',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05'
  }
];

// Mock data for resource availability (calendar bookings)
export const mockCalendarBookings: CalendarBookingType[] = [
  {
    id: '1',
    resourceId: 'auditorium',
    title: 'Tech Symposium',
    start: '2023-11-25T09:00:00',
    end: '2023-11-25T17:00:00'
  },
  {
    id: '2',
    resourceId: 'ccf-lab',
    title: 'Coding Workshop',
    start: '2023-11-26T10:00:00',
    end: '2023-11-26T13:00:00'
  },
  {
    id: '3',
    resourceId: 'mba-seminar-hall',
    title: 'Management Lecture',
    start: '2023-11-27T14:00:00',
    end: '2023-11-27T16:00:00'
  },
  {
    id: '4',
    resourceId: 'pes-field',
    title: 'Sports Practice',
    start: '2023-11-28T07:00:00',
    end: '2023-11-28T10:00:00'
  },
  {
    id: '5',
    resourceId: 'main-seminar-hall',
    title: 'Annual Meeting',
    start: '2023-11-29T11:00:00',
    end: '2023-11-29T15:00:00'
  }
];
