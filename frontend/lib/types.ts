export interface Node {
  id: string;
  type: 'default' | 'input' | 'output' | 'custom';
  data: {
    label: string;
    task?: Task;
  };
  position: {
    x: number;
    y: number;
  };
  style?: Record<string, any>;
}

export interface Edge {
  _id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  style?: Record<string, any>;
  label?: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  assignedTo: string | null;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
  history: TaskHistory[];
}

export interface TaskHistory {
  _id: string;
  timestamp: string;
  user: string;
  action: string;
  previousStatus?: string;
  currentStatus?: string;
  previousProgress?: number;
  currentProgress?: number;
  note?: string;
}

export interface MindMap {
  _id: string;
  title: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  collaborators: [
    {
      user_id: string,
      role: 'viewer' | 'editor' | 'owner'
    }
  ];
}

export interface User {
  _id: string;
  email: string;
  role: 'demo' | 'user' | 'admin';
  image?: string;
}