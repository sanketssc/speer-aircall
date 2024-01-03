export type CallDetails = {
  id: string;
  created_at: string;
  direction: string;
  from: number;
  to: number;
  via: number;
  duration: number;
  call_type: string;
  is_archived: boolean;
};
