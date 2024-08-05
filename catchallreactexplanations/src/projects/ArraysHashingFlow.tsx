import React from 'react';
import ReactFlow, { 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState 
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 250, y: 0 }, data: { label: 'Arrays & Hashing', url: 'https://example.com/arrays-hashing' } },
  { id: '2', position: { x: 100, y: 100 }, data: { label: 'Two Pointers', url: 'https://example.com/two-pointers' } },
  { id: '3', position: { x: 400, y: 100 }, data: { label: 'Stack', url: 'https://example.com/stack' } },
  { id: '4', position: { x: 0, y: 200 }, data: { label: 'Sliding Window', url: 'https://example.com/sliding-window' } },
  { id: '5', position: { x: 150, y: 200 }, data: { label: 'Linked List', url: 'https://example.com/linked-list' } },
  { id: '6', position: { x: 300, y: 200 }, data: { label: 'Binary Search', url: 'https://example.com/binary-search' } },
  { id: '7', position: { x: 250, y: 300 }, data: { label: 'Trees', url: 'https://example.com/trees' } },
  { id: '8', position: { x: 100, y: 400 }, data: { label: 'Tries', url: 'https://example.com/tries' } },
  { id: '9', position: { x: 250, y: 400 }, data: { label: 'Heap / Priority Queue', url: 'https://example.com/heap-priority-queue' } },
  { id: '10', position: { x: 400, y: 400 }, data: { label: 'Backtracking', url: 'https://example.com/backtracking' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e2-5', source: '2', target: '5' },
  { id: 'e2-6', source: '2', target: '6' },
  { id: 'e5-7', source: '5', target: '7' },
  { id: 'e6-7', source: '6', target: '7' },
  { id: 'e7-8', source: '7', target: '8' },
  { id: 'e7-9', source: '7', target: '9' },
  { id: 'e7-10', source: '7', target: '10' },
];

const nodeColor = '#4e73df';

const customNodeStyle = {
  background: nodeColor,
  color: 'white',
  border: '1px solid #222138',
  width: 180,
  borderRadius: '5px',
  padding: '10px',
  cursor: 'pointer',
};

const ArraysHashingFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = (event : any , node : any) => {
    if (node.data.url) {
      window.open(node.data.url, '_blank');
    }
  };

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default ArraysHashingFlow;