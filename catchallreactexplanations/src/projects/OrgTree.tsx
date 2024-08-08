import React, { useState } from 'react';
import Tree from 'react-d3-tree';

interface TreeNode {
  name: string;
  attributes?: {
    department?: string;
  };
  children?: TreeNode[];
}

const OrgChartTree: React.FC = () => {
  const [orgChart, setOrgChart] = useState<TreeNode>({
    name: 'CEO',
    children: [
      {
        name: 'Manager',
        attributes: {
          department: 'Production',
        },
        children: [
          {
            name: 'Foreman',
            attributes: {
              department: 'Fabrication',
            },
            children: [
              {
                name: 'Worker',
              },
            ],
          },
          {
            name: 'Foreman',
            attributes: {
              department: 'Assembly',
            },
            children: [
              {
                name: 'Worker',
              },
            ],
          },
        ],
      },
    ],
  });

  const handleNameChange = (node: TreeNode, newName: string) => {
    node.name = newName;
    setOrgChart({ ...orgChart });
  };

  const addChild = (node: TreeNode, position: 'left' | 'right') => {
    if (!node.children) {
      node.children = [];
    }
    const newChild: TreeNode = { name: 'New Node' };
    if (position === 'left') {
      node.children.unshift(newChild);
    } else {
      node.children.push(newChild);
    }
    setOrgChart({ ...orgChart });
  };

  const renderCustomNode = ({ nodeDatum, toggleNode }: any) => (
    <g>
      <circle r={15} onClick={toggleNode} />
      <text dy=".31em" x={20} strokeWidth="1" onClick={toggleNode}>
        <tspan>
          <input
            value={nodeDatum.name}
            onChange={(e) => handleNameChange(nodeDatum, e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </tspan>
      </text>
      <text dy="1.31em" x={20} strokeWidth="1">
        {nodeDatum.attributes?.department}
      </text>
      <g>
        <circle cx="-15" cy="30" r="10" onClick={() => addChild(nodeDatum, 'left')} />
        <text x="-19" y="35">+L</text>
      </g>
      <g>
        <circle cx="15" cy="30" r="10" onClick={() => addChild(nodeDatum, 'right')} />
        <text x="11" y="35">+R</text>
      </g>
    </g>
  );

  return (
    <div id="treeWrapper" style={{ width: '100em', height: '80em' }}>
      <p>unsorted: [1,9,2,8,3,7]</p>
      <Tree
        data={orgChart}
        orientation="vertical"
        renderCustomNodeElement={renderCustomNode}
        pathFunc="step"
        separation={{ siblings: 2, nonSiblings: 2 }}
      />
    </div>
  );
};

export default OrgChartTree;