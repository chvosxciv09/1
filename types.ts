export enum ProjectStatus {
  PLANNING = '规划中',
  IN_PROGRESS = '进行中',
  REVIEW = '客户评审',
  COMPLETED = '已完成',
  ON_HOLD = '暂停'
}

export enum DesignPhase {
  RESEARCH = '用户研究',
  CONCEPT = '概念草图',
  CAD = '3D 建模 (CAD)',
  RENDERING = '渲染与表现',
  PROTOTYPING = '手板样机',
  DFM = '量产设计 (DFM)'
}

export interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface FeedbackAnalysis {
  summary: string;
  sentiment: '正面' | '中立' | '负面' | '混合';
  key_requests: string[];
  ambiguities: string[];
  suggested_questions: string[];
  next_steps_suggestion: string;
}

export interface LogEntry {
  id: string;
  date: string;
  author: string;
  rawText: string;
  analysis?: FeedbackAnalysis;
}

export interface WhiteboardNote {
  id: string;
  x: number;
  y: number;
  content: string;
  color: 'yellow' | 'blue' | 'green' | 'red' | 'purple';
  authorId: string;
  createdAt: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
}

export interface ProjectPhase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface Project {
  id: string;
  name: string;
  client: string;
  description: string;
  thumbnail: string;
  status: ProjectStatus;
  progress: number; // 0-100
  currentPhase: DesignPhase;
  startDate: string;
  dueDate: string;
  team: Member[];
  feedbackLogs: LogEntry[];
  whiteboardNotes: WhiteboardNote[];
  phases: ProjectPhase[];
  files: ProjectFile[];
}