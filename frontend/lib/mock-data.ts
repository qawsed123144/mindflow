import { MindMap, Node, Edge } from './types';
import { generateId } from './utils';

// Helper to create a simple node
const createNode = (id: string, label: string, x: number, y: number, status?: string): Node => {
  let style = {};

  if (status === 'not-started') {
    style = { border: '2px solid #d1d5db' };
  } else if (status === 'in-progress') {
    style = { border: '2px solid #3b82f6' };
  } else if (status === 'completed') {
    style = { border: '2px solid #10b981' };
  }

  return {
    id,
    type: 'custom',
    data: {
      label,
      task: status ? {
        id: generateId(),
        title: label,
        description: `Description for ${label}`,
        status: status as any,
        progress: status === 'not-started' ? 0 : status === 'in-progress' ? 50 : 100,
        assignedTo: null,
        deadline: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        history: [
          {
            id: generateId(),
            timestamp: new Date().toISOString(),
            user: 'Demo User',
            action: 'created',
          }
        ],
      } : undefined
    },
    position: { x, y },
    style
  };
};

// Helper to create an edge
const createEdge = (id: string, source: string, target: string): Edge => ({
  id,
  source,
  target,
});

// Sample project mind map
const projectMindMap: MindMap = {
  id: 'map-1',
  title: 'Project Roadmap',
  description: 'Our project roadmap with tasks and assignments',
  createdBy: '1',
  createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  collaborators: ['1'],
  nodes: [
    createNode('1', 'Project Planning', 250, 25, 'completed'),
    createNode('2', 'Design Phase', 100, 150, 'in-progress'),
    createNode('3', 'Development', 400, 150, 'not-started'),
    createNode('4', 'UI Components', 100, 275, 'in-progress'),
    createNode('5', 'Wireframes', 100, 350, 'completed'),
    createNode('6', 'Backend API', 400, 275, 'not-started'),
    createNode('7', 'Database Schema', 400, 350, 'in-progress'),
    createNode('8', 'Testing', 250, 450, 'not-started'),
  ],
  edges: [
    createEdge('e1-2', '1', '2'),
    createEdge('e1-3', '1', '3'),
    createEdge('e2-4', '2', '4'),
    createEdge('e2-5', '2', '5'),
    createEdge('e3-6', '3', '6'),
    createEdge('e3-7', '3', '7'),
    createEdge('e4-8', '4', '8'),
    createEdge('e5-8', '5', '8'),
    createEdge('e6-8', '6', '8'),
    createEdge('e7-8', '7', '8'),
  ],
};

// Sample market research mind map
const marketResearchMindMap: MindMap = {
  id: 'map-2',
  title: 'Market Research',
  description: 'Analysis of market trends and competitors',
  createdBy: '1',
  createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
  updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  collaborators: ['1'],
  nodes: [
    createNode('1', 'Market Analysis', 250, 50, 'in-progress'),
    createNode('2', 'Competitors', 50, 175, 'completed'),
    createNode('3', 'Customer Segments', 250, 175, 'in-progress'),
    createNode('4', 'Trends', 450, 175, 'not-started'),
    createNode('5', 'Direct Competitors', 50, 300, 'completed'),
    createNode('6', 'Indirect Competitors', 50, 400, 'in-progress'),
  ],
  edges: [
    createEdge('e1-2', '1', '2'),
    createEdge('e1-3', '1', '3'),
    createEdge('e1-4', '1', '4'),
    createEdge('e2-5', '2', '5'),
    createEdge('e2-6', '2', '6'),
  ],
};

// Empty mind map template
const emptyMindMap: MindMap = {
  id: 'map-3',
  title: 'New Project',
  description: 'Start a new mind map project',
  createdBy: '1',
  createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  collaborators: ['1'],
  nodes: [
    createNode('1', 'Central Topic', 250, 150),
  ],
  edges: [],
};

export const mockMindMaps: MindMap[] = [
  projectMindMap,
  marketResearchMindMap,
  emptyMindMap,
];