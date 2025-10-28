export interface Task {
  id?: number;
  eventId?: number;
  projectReference: string;
  description: string;
  assignee: string;
  subteam: string;
  comments?: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export enum TaskStatus {
  IN_PROGRESS = "IN_PROGRESS",
  CREATED = "CREATED",
  NEEDS_MANAGER_REVIEW = "NEEDS_MANAGER_REVIEW"
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL"
}