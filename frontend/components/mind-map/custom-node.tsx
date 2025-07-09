'use client';

import { useState } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function CustomNode({ data, isConnectable, selected }: NodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  
  // Determine task status and progress
  const taskStatus = data.task?.status || 'not-started';
  const progress = data.task?.progress || 0;
  
  // Get color based on status
  let statusColor = 'bg-gray-200';
  if (taskStatus === 'in-progress') statusColor = 'bg-blue-500';
  if (taskStatus === 'completed') statusColor = 'bg-green-500';

  return (
    <div className="relative" style={{ width: 200, height: 100 }}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-400 dark:bg-gray-600"
      />
      
      <Card className={`min-w-[180px] p-3 ${selected ? 'ring-2 ring-primary' : ''}`}>
        {isEditing ? (
          <input
            className="w-full p-1 border rounded"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={() => {
              data.label = label;
              setIsEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                data.label = label;
                setIsEditing(false);
              }
            }}
            autoFocus
          />
        ) : (
          <div
            className="font-medium text-sm mb-1 cursor-pointer"
            onDoubleClick={() => setIsEditing(true)}
          >
            {data.label}
          </div>
        )}
        
        {data.task && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{taskStatus.replace('-', ' ')}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}
      </Card>
      
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-400 dark:bg-gray-600"
      />
      
      <Handle
        type="source"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-400 dark:bg-gray-600"
      />
      
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-400 dark:bg-gray-600"
      />
    </div>
  );
}