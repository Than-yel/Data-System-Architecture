export type NodeType = 
  | 'CLIENT' 
  | 'APP' 
  | 'CACHE' 
  | 'DB' 
  | 'INDEX' 
  | 'QUEUE' 
  | 'WORKER' 
  | 'EXTERNAL';

export interface SystemNode {
  id: NodeType;
  label: string;
  icon: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  description: string;
}

export interface Packet {
  id: string;
  from: NodeType;
  to: NodeType;
  label?: string;
  type: 'request' | 'response' | 'error' | 'sync' | 'async';
  color?: string;
  onComplete?: () => void;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface FlowStep {
  from: NodeType;
  to: NodeType;
  label: string;
  delay?: number; // ms to wait before starting this step
  duration?: number; // ms travel time
  log: string;
  type?: Packet['type'];
  action?: () => void; // Side effect like "Cache Hit" flashing
}

export type ScenarioType = 'READ_HIT' | 'READ_MISS' | 'WRITE' | 'ASYNC_TASK';