import React from 'react';
import { ScenarioType } from '../types';
import { Play, Database, Search, MessageSquare, Zap } from 'lucide-react';

interface ControlsProps {
  onTrigger: (type: ScenarioType) => void;
  isRunning: boolean;
}

const Controls: React.FC<ControlsProps> = ({ onTrigger, isRunning }) => {
  return (
    <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900 border-b border-slate-800 z-50">
      
      <button
        onClick={() => onTrigger('READ_HIT')}
        disabled={isRunning}
        className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-green-900/50 hover:border-green-500/50 text-green-100 py-2 px-4 rounded-lg transition-all"
      >
        <Zap size={16} className="text-green-400" />
        <div className="text-left">
          <div className="text-sm font-bold">Read Request</div>
          <div className="text-[10px] text-green-400/70">Cache Hit</div>
        </div>
      </button>

      <button
        onClick={() => onTrigger('READ_MISS')}
        disabled={isRunning}
        className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-900/50 hover:border-blue-500/50 text-blue-100 py-2 px-4 rounded-lg transition-all"
      >
        <Database size={16} className="text-blue-400" />
        <div className="text-left">
          <div className="text-sm font-bold">Read Request</div>
          <div className="text-[10px] text-blue-400/70">Cache Miss + DB</div>
        </div>
      </button>

      <button
        onClick={() => onTrigger('WRITE')}
        disabled={isRunning}
        className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-purple-900/50 hover:border-purple-500/50 text-purple-100 py-2 px-4 rounded-lg transition-all"
      >
        <Search size={16} className="text-purple-400" />
        <div className="text-left">
          <div className="text-sm font-bold">Write Request</div>
          <div className="text-[10px] text-purple-400/70">DB + Index Sync</div>
        </div>
      </button>

      <button
        onClick={() => onTrigger('ASYNC_TASK')}
        disabled={isRunning}
        className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-yellow-900/50 hover:border-yellow-500/50 text-yellow-100 py-2 px-4 rounded-lg transition-all"
      >
        <MessageSquare size={16} className="text-yellow-400" />
        <div className="text-left">
          <div className="text-sm font-bold">Async Task</div>
          <div className="text-[10px] text-yellow-400/70">Queue + Worker</div>
        </div>
      </button>

    </div>
  );
};

export default Controls;