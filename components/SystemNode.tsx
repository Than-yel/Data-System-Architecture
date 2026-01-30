import React from 'react';
import { NODE_ICONS, NODES } from '../constants';
import { NodeType } from '../types';

interface SystemNodeProps {
  id: NodeType;
  isActive?: boolean;
  isFlash?: 'success' | 'error' | 'process' | null;
}

const SystemNodeComponent: React.FC<SystemNodeProps> = ({ id, isActive, isFlash }) => {
  const node = NODES[id];
  const Icon = NODE_ICONS[node.icon as keyof typeof NODE_ICONS];

  // Dynamic classes for flashing effects
  let borderClass = 'border-slate-700';
  let bgClass = 'bg-slate-800';
  let shadowClass = '';

  if (isFlash === 'success') {
    borderClass = 'border-green-500';
    bgClass = 'bg-green-900/30';
    shadowClass = 'shadow-[0_0_20px_rgba(34,197,94,0.5)]';
  } else if (isFlash === 'error') {
    borderClass = 'border-red-500';
    bgClass = 'bg-red-900/30';
    shadowClass = 'shadow-[0_0_20px_rgba(239,68,68,0.5)]';
  } else if (isFlash === 'process') {
    borderClass = 'border-blue-500';
    bgClass = 'bg-blue-900/30';
    shadowClass = 'shadow-[0_0_20px_rgba(59,130,246,0.5)]';
  } else if (isActive) {
    borderClass = 'border-slate-500';
  }

  return (
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-32 md:w-40 flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-300 z-10 ${borderClass} ${bgClass} ${shadowClass}`}
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
    >
      <div className={`p-2 rounded-full mb-2 ${isFlash ? 'scale-110' : 'scale-100'} transition-transform bg-slate-900`}>
        <Icon size={24} className={isFlash ? (isFlash === 'error' ? 'text-red-400' : 'text-green-400') : 'text-slate-300'} />
      </div>
      <div className="text-xs md:text-sm font-bold text-slate-200">{node.label}</div>
      <div className="text-[10px] text-slate-400 text-center leading-tight mt-1">{node.description}</div>
    </div>
  );
};

export default SystemNodeComponent;