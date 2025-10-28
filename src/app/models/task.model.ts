export interface Task {
  id?: number;
  // eventId is a numeric identifier that maps to a Long on the backend
  eventId: number;
  projectReference: string;
  description: string;
  assignee: string;
  subteam: string;
  comments: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: string;
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum TaskStatus {
  CREATED = 'CREATED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum Subteam {
  FOOD = 'Food',
  MUSIC = 'Music'
}
