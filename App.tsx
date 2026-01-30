import React, { useState, useEffect, useRef } from 'react';
import { NODES } from './constants';
import { NodeType, FlowStep, ScenarioType, LogEntry, Packet } from './types';
import SystemNodeComponent from './components/SystemNode.tsx';
import DataPacket from './components/DataPacket.tsx';
import LogConsole from './components/LogConsole.tsx';
import Controls from './components/Controls.tsx';

// --- CONNECTIONS DEFINITION ---
// We render lines between these nodes
const CONNECTIONS: [NodeType, NodeType][] = [
  ['CLIENT', 'APP'],
  ['APP', 'CACHE'],
  ['APP', 'DB'],
  ['APP', 'INDEX'],
  ['APP', 'QUEUE'],
  ['QUEUE', 'WORKER'],
  ['WORKER', 'EXTERNAL'],
];

const App: React.FC = () => {
  const [activePackets, setActivePackets] = useState<Packet[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [flashingNodes, setFlashingNodes] = useState<Record<string, 'success' | 'error' | 'process' | null>>({});

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, { id: Math.random().toString(36), timestamp: Date.now(), message, type }]);
  };

  const flashNode = (nodeId: NodeType, type: 'success' | 'error' | 'process', duration = 500) => {
    setFlashingNodes(prev => ({ ...prev, [nodeId]: type }));
    setTimeout(() => {
      setFlashingNodes(prev => ({ ...prev, [nodeId]: null }));
    }, duration);
  };

  // --- FLOW ENGINE ---
  const executeFlow = async (steps: FlowStep[]) => {
    setIsRunning(true);
    
    // Recursive execution of steps
    const runStep = (index: number) => {
      if (index >= steps.length) {
        setIsRunning(false);
        addLog("Flow complete.", 'success');
        return;
      }

      const step = steps[index];
      const packetId = `${step.from}-${step.to}-${Date.now()}`;
      const duration = step.duration || 800;

      // 1. Log Start
      addLog(step.log, step.type === 'error' ? 'error' : 'info');

      // 2. Perform actions (like flashing nodes before move)
      if (step.action) step.action();
      flashNode(step.from, 'process', 300);

      // 3. Create Packet
      const newPacket: Packet = {
        id: packetId,
        from: step.from,
        to: step.to,
        label: step.label,
        type: step.type || 'request'
      };

      setActivePackets(prev => [...prev, newPacket]);

      // 4. Schedule Cleanup & Next Step
      setTimeout(() => {
        // Remove packet
        setActivePackets(prev => prev.filter(p => p.id !== packetId));
        
        // Flash destination
        if (step.type === 'error') {
           flashNode(step.to, 'error', 500);
        } else {
           flashNode(step.to, 'success', 300);
        }

        // Delay before next step
        setTimeout(() => {
          runStep(index + 1);
        }, step.delay || 100);

      }, duration);
    };

    runStep(0);
  };

  const handleTrigger = (type: ScenarioType) => {
    setLogs([]); // Clear logs for new run
    
    let steps: FlowStep[] = [];

    switch (type) {
      case 'READ_HIT':
        steps = [
          { from: 'CLIENT', to: 'APP', label: 'GET /user/123', log: 'Client requests user profile via API.' },
          { from: 'APP', to: 'CACHE', label: 'Check Key', log: 'App checks Memcached for user_123.' },
          { from: 'CACHE', to: 'APP', label: 'Data Found', type: 'response', log: 'Cache Hit! Returning data immediately.', action: () => flashNode('CACHE', 'success') },
          { from: 'APP', to: 'CLIENT', label: 'JSON Res', type: 'response', log: 'App returns response to Client.' }
        ];
        break;

      case 'READ_MISS':
        steps = [
          { from: 'CLIENT', to: 'APP', label: 'GET /user/123', log: 'Client requests user profile.' },
          { from: 'APP', to: 'CACHE', label: 'Check Key', log: 'App checks cache.' },
          { from: 'CACHE', to: 'APP', label: 'Null', type: 'error', log: 'Cache Miss. Data not found.', action: () => flashNode('CACHE', 'error') },
          { from: 'APP', to: 'DB', label: 'SELECT *', log: 'App queries Primary Database.' },
          { from: 'DB', to: 'APP', label: 'Row Data', type: 'response', log: 'Database returns user record.' },
          { from: 'APP', to: 'CACHE', label: 'SET Key', type: 'sync', log: 'App populates cache for future requests.' },
          { from: 'APP', to: 'CLIENT', label: 'JSON Res', type: 'response', log: 'App returns response to Client.' }
        ];
        break;

      case 'WRITE':
        steps = [
          { from: 'CLIENT', to: 'APP', label: 'POST /posts', log: 'Client submits new post.' },
          { from: 'APP', to: 'DB', label: 'INSERT', log: 'App writes source of truth to Primary DB.' },
          { from: 'DB', to: 'APP', label: 'OK', type: 'response', log: 'DB confirms write success.' },
          // Parallel-ish visual flows handled by fast sequential steps for clarity in this simple engine
          { from: 'APP', to: 'CACHE', label: 'INVALIDATE', type: 'error', log: 'App invalidates stale cache entries.', delay: 0 },
          { from: 'APP', to: 'INDEX', label: 'INDEX DOC', type: 'sync', log: 'App updates Elasticsearch index.', delay: 500 },
          { from: 'APP', to: 'CLIENT', label: '201 Created', type: 'response', log: 'App confirms success to Client.' }
        ];
        break;
      
      case 'ASYNC_TASK':
        steps = [
          { from: 'CLIENT', to: 'APP', label: 'POST /email', log: 'Client requests email notification.' },
          { from: 'APP', to: 'QUEUE', label: 'Pub Task', type: 'async', log: 'App offloads task to RabbitMQ.' },
          { from: 'APP', to: 'CLIENT', label: '202 Accepted', type: 'response', log: 'App responds immediately (Non-blocking).', delay: 500 },
          { from: 'QUEUE', to: 'WORKER', label: 'Sub Task', type: 'async', log: 'Worker service pulls task from Queue.', delay: 500 },
          { from: 'WORKER', to: 'EXTERNAL', label: 'Send Mail', type: 'async', log: 'Worker sends email to external provider.' }
        ];
        break;
    }

    executeFlow(steps);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-200">
      
      {/* Top Controls */}
      <Controls onTrigger={handleTrigger} isRunning={isRunning} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
        
        {/* Visual Map Area */}
        <div className="flex-1 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950 min-h-[500px]">
          
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ 
                 backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', 
                 backgroundSize: '40px 40px' 
               }}>
          </div>

          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {CONNECTIONS.map(([start, end], i) => {
              const s = NODES[start];
              const e = NODES[end];
              return (
                <g key={i}>
                  <line 
                    x1={`${s.x}%`} y1={`${s.y}%`} 
                    x2={`${e.x}%`} y2={`${e.y}%`} 
                    stroke="#334155" 
                    strokeWidth="2" 
                    strokeDasharray="5,5"
                  />
                  {/* Small animated dots on the lines to show connectivity */}
                  <circle r="2" fill="#475569">
                     <animateMotion 
                       dur="3s" 
                       repeatCount="indefinite" 
                       path={`M ${s.x * window.innerWidth / 100} ${s.y * window.innerHeight / 100} L ${e.x * window.innerWidth / 100} ${e.y * window.innerHeight / 100}`} 
                       calcMode="linear"
                     />
                     {/* NOTE: animateMotion with calculated pixels in React is tricky because of resize. 
                         We will skip complex SVG path animation for static background and rely on CSS Packets 
                     */}
                  </circle>
                </g>
              );
            })}
          </svg>

          {/* Connection Lines (Redrawn simpler for React without resize listeners for calcMode) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
             <defs>
               <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                 <polygon points="0 0, 10 3.5, 0 7" fill="#334155" />
               </marker>
             </defs>
             {CONNECTIONS.map(([start, end], i) => {
               const s = NODES[start];
               const e = NODES[end];
               return (
                 <line 
                   key={i}
                   x1={`${s.x}%`} y1={`${s.y}%`} 
                   x2={`${e.x}%`} y2={`${e.y}%`} 
                   stroke="#334155" 
                   strokeWidth="2" 
                   markerEnd="url(#arrowhead)"
                   opacity="0.6"
                 />
               );
             })}
          </svg>

          {/* Render Nodes */}
          {Object.values(NODES).map(node => (
            <SystemNodeComponent 
              key={node.id} 
              id={node.id} 
              isFlash={flashingNodes[node.id]}
            />
          ))}

          {/* Render Active Packets */}
          {activePackets.map(packet => (
            <DataPacket key={packet.id} packet={packet} />
          ))}

        </div>

        {/* Logs Sidebar */}
        <div className="h-64 md:h-auto md:w-80 flex-shrink-0 z-20 shadow-xl">
          <LogConsole logs={logs} />
        </div>

      </div>
    </div>
  );
};

export default App;