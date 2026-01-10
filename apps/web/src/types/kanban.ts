export type JobStatus = 'pending' | 'sent' | 'reply' | 'interview';

export type Market = 'India' | 'US' | 'DE' | 'UK' | 'SG';

export type WorkMode = 'remote' | 'hybrid' | 'onsite';

export interface Job {
  id: string;
  title: string;
  company: string;
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  market: Market;
  workMode: WorkMode;
  status: JobStatus;
  progress: number; // 0-100
  appliedDate: string;
  location?: string;
  description?: string;
}

export interface Column {
  id: JobStatus;
  title: string;
  jobs: Job[];
}

export interface KanbanState {
  columns: Column[];
  selectedJobIds: Set<string>;
  groupBy: 'none' | 'market' | 'workMode';
}

export interface DragState {
  draggedJobId: string | null;
  sourceColumnId: JobStatus | null;
  targetColumnId: JobStatus | null;
}
