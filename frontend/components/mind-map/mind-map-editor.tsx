'use client';

import { toast } from 'sonner';
import { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  NodeChange,
  EdgeChange,
  Connection,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { MindMap, User, Node, Task } from '@/lib/types';
import { useLanguage } from '@/context/language-context';
import { useMindMap } from '@/hooks/use-minmap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { generateId } from '@/lib/utils';
import { TaskModal } from './task-modal';
import { CustomNode } from './custom-node';
import { ImageUploadModal } from './image-upload-modal';
import { ArrowLeftIcon, DownloadIcon, ImageIcon, SaveIcon, UsersIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';

interface MindMapEditorProps {
  mindMap: MindMap;
  currentUser: User;
  onBack: () => void;
}

// Define node types for ReactFlow
const nodeTypes = {
  custom: CustomNode,
};

export function MindMapEditorContent({
  mindMap,
  currentUser,
  onBack,
}: MindMapEditorProps) {
  const { t } = useLanguage();
  const [title, setTitle] = useState(mindMap.title);
  const [description, setDescription] = useState(mindMap.description);
  const [nodes, setNodes, onNodesChange] = useNodesState(
    mindMap.nodes.map((n) => ({
      id: n.id,
      type: n.type,
      data: n.data,
      position: n.position,
      style: n.style,
    }))
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    mindMap.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: e.type,
      animated: e.animated,
      style: e.style,
      label: e.label,
    }))
  );
  const [selectedTask, setSelectedTask] = useState<{ task: Task; nodeId: string } | null>(null);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const reactFlowInstance = useReactFlow();
  const { createMindMap, updateMindMap } = useMindMap();

  // Auto-save timer
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [currentMindMap, setCurrentMindMap] = useState<MindMap>(mindMap);

  // Handle node selection for task editing
  const onNodeClick = useCallback(
    (
      event: React.MouseEvent,
      node: import('reactflow').Node<any, string | undefined>
    ) => {
      // If the node has a task, open the task modal
      if (node.data?.task) {
        setSelectedTask(null);
        setTimeout(() => {
          setSelectedTask({ task: node.data.task, nodeId: node.id });
        }, 0);
      } else {
        // Create a new task for this node
        const newTask: Task = {
          id: generateId(),
          title: node.data.label,
          description: '',
          status: 'not-started',
          progress: 0,
          assignedTo: null,
          deadline: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          history: [
            {
              id: generateId(),
              timestamp: new Date().toISOString(),
              user: currentUser.email,
              action: 'created',
            },
          ],
        };

        // Update the node with the new task
        setNodes((nds) =>
          nds.map((n) => {
            if (n.id === node.id) {
              return {
                ...n,
                data: {
                  ...n.data,
                  task: newTask,
                },
              };
            }
            return n;
          })
        );

        setSelectedTask(null);
        setTimeout(() => {
          setSelectedTask({ task: newTask, nodeId: node.id });
        }, 0);
        setUnsavedChanges(true);
      }
    },
    [setNodes, currentUser.email]
  );

  // Handle edge creation
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, id: `e-${generateId()}` }, eds));
      setUnsavedChanges(true);
    },
    [setEdges]
  );

  // Handle adding a new node
  const addNode = useCallback(() => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Get the center of the visible area from react-flow instance
    const { x, y, zoom } = reactFlowInstance.getViewport();

    // Calculate a position that would be in the visible area and center
    const position = reactFlowInstance.screenToFlowPosition({
      x: centerX,
      y: centerY,
    });

    const newNode = {
      id: `node-${generateId()}`,
      type: 'custom',
      data: { label: '新節點' },
      position,
    };

    setNodes((nds) => [...nds, newNode]);
    setUnsavedChanges(true);
  }, [reactFlowInstance, setNodes]);


  // Handle saving the mind map
  const handleSave = useCallback(async () => {
    const mindMapData = {
      title: title,
      description: description,
      nodes: nodes.map((n) => ({
        id: n.id,
        type: n.type as 'default' | 'input' | 'output' | 'custom',
        data: n.data,
        position: n.position,
        style: n.style,
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: e.type,
        animated: e.animated,
        style: e.style,
        label: typeof e.label === 'string' ? e.label : undefined,
      })),
      createdBy: currentUser.id,
      createdAt: currentMindMap.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (!currentMindMap.id) {
        const created = await createMindMap(mindMapData);
        if (created) setCurrentMindMap(created);
        toast.success(t.mindMapSavedSuccess);
      } else {
        await updateMindMap(currentMindMap.id, mindMapData);
        setCurrentMindMap(prev => ({ ...prev, ...mindMapData }));
        toast.success(t.mindMapSavedSuccess);
      }
      setLastSaved(new Date());
      setUnsavedChanges(false);
    } catch (error: any) {
      toast.error(error.message || '儲存心智圖失敗');
    }
  }, [currentMindMap, title, description, nodes, edges, createMindMap, updateMindMap, t]);

  // Handle task update
  const handleTaskUpdate = useCallback((task: Task, nodeId: string) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === nodeId) {
          // 每次都建立新的 data 與 style 物件參考
          const newData = {
            ...n.data,
            task: { ...task },
          };

          let nodeStyle = {};
          switch (task.status) {
            case 'not-started':
              nodeStyle = { border: '2px solid #d1d5db' };
              break;
            case 'in-progress':
              nodeStyle = { border: '2px solid #3b82f6' };
              break;
            case 'completed':
              nodeStyle = { border: '2px solid #10b981' };
              break;
          }

          return {
            ...n,
            data: newData,
            style: nodeStyle,
          };
        }
        return n;
      })
    );
    setUnsavedChanges(true);
    setSelectedTask(null);
  }, [setNodes]);

  // Handle nodes from image upload
  const handleNodesFromImage = useCallback((extractedNodes: { label: string; x: number; y: number }[]) => {
    const newNodes = extractedNodes.map((node) => ({
      id: `node-${generateId()}`,
      type: 'custom',
      data: { label: node.label },
      position: { x: node.x, y: node.y },
    }));

    setNodes((nds) => [...nds, ...newNodes]);
    setUnsavedChanges(true);
  }, [setNodes]);

  // Auto-save functionality
  useEffect(() => {
    if (unsavedChanges) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      autoSaveTimerRef.current = setTimeout(() => {
        handleSave();
      }, 30000); // Auto-save after 30 seconds of inactivity
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [unsavedChanges, handleSave]);

  // Export the mind map as JSON
  const handleExport = useCallback(() => {
    const exportData = {
      ...mindMap,
      title,
      description,
      nodes,
      edges,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `${title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [mindMap, title, description, nodes, edges]);

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setUnsavedChanges(true);
              }}
              className="font-bold text-lg h-8 w-full sm:w-[250px]"
              placeholder={t.mindMapTitle}
            />
            <Textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setUnsavedChanges(true);
              }}
              className="text-sm h-8 w-full sm:w-[300px] py-1 resize-none"
              placeholder={t.addDescription}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lastSaved && (
            <span className="text-xs text-gray-500 hidden md:inline-block">
              {t.lastSaved} {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={handleExport}>
            <DownloadIcon className="h-4 w-4 mr-2" />
            {t.export}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!unsavedChanges}>
            <SaveIcon className="h-4 w-4 mr-2" />
            {t.save}
          </Button>
        </div>
      </div>

      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.2}
          maxZoom={4}
        >
          <Controls />
          <Background />
          <Panel position="top-left" className="bg-background/80 p-2 rounded-md shadow-sm backdrop-blur flex gap-2">
            <Button onClick={addNode} size="sm">{t.addNode}</Button>
            <Button onClick={() => setIsImageUploadOpen(true)} size="sm" variant="outline">
              <ImageIcon className="h-4 w-4 mr-2" />
              {t.importFromImage}
            </Button>
          </Panel>
        </ReactFlow>
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask.task}
          nodeId={selectedTask.nodeId}
          onUpdate={handleTaskUpdate}
          onCancel={() => setSelectedTask(null)}
          currentUser={currentUser}
        />
      )}

      <ImageUploadModal
        isOpen={isImageUploadOpen}
        onClose={() => setIsImageUploadOpen(false)}
        onNodesExtracted={handleNodesFromImage}
      />
    </div>
  );
}

export function MindMapEditor(props: MindMapEditorProps) {
  return (
    <ReactFlowProvider>
      <MindMapEditorContent {...props} />
    </ReactFlowProvider>
  );
}