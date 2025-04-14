export interface Board {
  id: number;
  name: string;
  description: string;
  taskCount: number;
}

export interface UserProfile {
  avatarUrl: string;
  description: string;
  email: string;
  fullName: string;
  id: number;
  tasksCount: number;
  teamId: number;
  teamName: string;
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export const TaskPriorityColors = {
  [TaskPriority.High]: '#d77a7a',
  [TaskPriority.Medium]: '#e6a157',
  [TaskPriority.Low]: '#8bbabb',
};

export const TaskPriorityLabels = {
  [TaskPriority.Low]: 'Low Priority',
  [TaskPriority.Medium]: 'Medium Priority',
  [TaskPriority.High]: 'High Priority',
};

export enum TaskStatus {
  Backlog = 'Backlog',
  InProgress = 'InProgress',
  Done = 'Done',
}

export const TaskStatusLabels = {
  [TaskStatus.Backlog]: 'Backlog',
  [TaskStatus.InProgress]: 'In Progress',
  [TaskStatus.Done]: 'Done',
};

export interface Assignee {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignee: Assignee;
}

export interface TaskToCreate {
  assigneeId: number;
  boardId: number;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  title: string;
}

export interface TaskWithBoard extends Task {
  boardId: number;
  boardName: string;
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: string;
  message: string;
}

export interface ApiMessage {
  message: string;
}
