import { SystemNode, NodeType } from './types';
import { 
  Monitor, 
  Server, 
  Database, 
  Layers, 
  Search, 
  MessageSquare, 
  Cpu, 
  Globe 
} from 'lucide-react';

// Position coordinates are in Percentages (0-100) relative to the container
export const NODES: Record<NodeType, SystemNode> = {
  CLIENT: {
    id: 'CLIENT',
    label: 'Client',
    icon: 'Monitor',
    x: 50,
    y: 10,
    description: 'Browser / Mobile App'
  },
  APP: {
    id: 'APP',
    label: 'App Server',
    icon: 'Server',
    x: 50,
    y: 45,
    description: 'API & Business Logic'
  },
  CACHE: {
    id: 'CACHE',
    label: 'Redis Cache',
    icon: 'Layers',
    x: 80,
    y: 45,
    description: 'In-Memory Store'
  },
  DB: {
    id: 'DB',
    label: 'Primary DB',
    icon: 'Database',
    x: 50,
    y: 80,
    description: 'PostgreSQL / MySQL'
  },
  INDEX: {
    id: 'INDEX',
    label: 'Search Index',
    icon: 'Search',
    x: 80,
    y: 80,
    description: 'Elasticsearch'
  },
  QUEUE: {
    id: 'QUEUE',
    label: 'Msg Queue',
    icon: 'MessageSquare',
    x: 20,
    y: 45,
    description: 'RabbitMQ / Kafka'
  },
  WORKER: {
    id: 'WORKER',
    label: 'Worker',
    icon: 'Cpu',
    x: 20,
    y: 70,
    description: 'Async Processor'
  },
  EXTERNAL: {
    id: 'EXTERNAL',
    label: 'External',
    icon: 'Globe',
    x: 20,
    y: 90,
    description: 'Email / 3rd Party API'
  }
};

export const NODE_ICONS = {
  Monitor,
  Server,
  Database,
  Layers,
  Search,
  MessageSquare,
  Cpu,
  Globe
};

// Colors for packet types
export const PACKET_COLORS = {
  request: 'bg-blue-400',
  response: 'bg-green-400',
  error: 'bg-red-500',
  sync: 'bg-purple-400',
  async: 'bg-yellow-400'
};