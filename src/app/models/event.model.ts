export interface Event {
  id? : number;
  recordID: string;
  name: string;
  location: string;
  startDate: Date | null;
  endDate: Date | null;
  type: string;
  description: string;
  attendees: number;
  estimateBudget: number;
  status: string;
}