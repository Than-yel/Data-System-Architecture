import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal, Clock, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface LogConsoleProps {
  logs: LogEntry[];
}

const LogConsole: React.FC<LogConsoleProps> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'error': return <AlertCircle size={14} className="text-red-400" />;
      case 'success': return <CheckCircle size={14} className="text-green-400" />;
      case 'warning': return <Clock size={14} className="text-yellow-400" />;
      default: return <Info size={14} className="text-blue-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border-t border-slate-800 md:border-t-0 md:border-l">
      <div className="flex items-center gap-2 p-3 bg-slate-900 border-b border-slate-800">
        <Terminal size={16} className="text-slate-400" />
        <h3 className="font-mono text-sm font-semibold text-slate-300">System Logs</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2 font-mono text-xs space-y-1">
        {logs.length === 0 && (
          <div className="text-slate-600 italic p-2">System ready. Waiting for requests...</div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="flex gap-2 items-start animate-fade-in hover:bg-slate-900/50 p-1 rounded">
            <span className="mt-0.5">{getIcon(log.type)}</span>
            <div className="flex-1">
              <span className="text-slate-500 mr-2">
                [{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second:'2-digit' })}]
              </span>
              <span className={
                log.type === 'error' ? 'text-red-300' : 
                log.type === 'success' ? 'text-green-300' : 
                log.type === 'warning' ? 'text-yellow-300' : 'text-slate-300'
              }>
                {log.message}
              </span>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default LogConsole;