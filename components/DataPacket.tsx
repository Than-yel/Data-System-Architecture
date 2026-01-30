import React, { useEffect, useState } from 'react';
import { NODES, PACKET_COLORS } from '../constants';
import { Packet } from '../types';

interface DataPacketProps {
  packet: Packet;
  duration?: number;
}

const DataPacket: React.FC<DataPacketProps> = ({ packet, duration = 600 }) => {
  const startNode = NODES[packet.from];
  const endNode = NODES[packet.to];

  // We use local state to trigger the animation frame
  // The packet spawns at 'startNode' then immediately transitions to 'endNode'
  const [position, setPosition] = useState({ x: startNode.x, y: startNode.y });
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    // Small timeout to ensure the initial render at start position happens before moving
    const timeout = setTimeout(() => {
      setPosition({ x: endNode.x, y: endNode.y });
      setIsMoving(true);
    }, 50);

    return () => clearTimeout(timeout);
  }, [endNode]);

  return (
    <div
      className={`absolute w-4 h-4 rounded-full shadow-md transform -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center pointer-events-none transition-all ease-linear`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transitionDuration: isMoving ? `${duration}ms` : '0ms',
        backgroundColor: 'white' // Inner core
      }}
    >
      {/* Outer Glow Ring */}
      <div className={`absolute w-full h-full rounded-full animate-ping opacity-75 ${PACKET_COLORS[packet.type]}`}></div>
      {/* Colored Shell */}
      <div className={`absolute w-full h-full rounded-full opacity-90 ${PACKET_COLORS[packet.type]}`}></div>
      
      {packet.label && (
        <div className="absolute -top-6 whitespace-nowrap text-[10px] bg-black/70 px-1 rounded text-white font-mono">
          {packet.label}
        </div>
      )}
    </div>
  );
};

export default DataPacket;