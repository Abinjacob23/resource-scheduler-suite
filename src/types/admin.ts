
export type EventRequest = {
  id: string;
  association: string;
  event_name: string;
  date: string;
  description: string | null;
  status: string;
  user_id: string;
};

export type AdminActionProps = {
  id: string;
  action: 'approved' | 'rejected';
};
