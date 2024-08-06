import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

// Global styles
const GlobalStyle = createGlobalStyle`
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f0f0f0;
  }
`;

// Styled components
const StyledBinaryTreeVisualization = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  margin-bottom: 20px;
`;

const StyledTraversalOrderDisplay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  font-size: 18px;
`;

const StyledControlPanel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const StyledStepExplanation = styled.div`
  text-align: center;
  margin-bottom: 20px;
  font-size: 16px;
`;

const Button = styled.button`
  margin: 0 5px;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
`;

const TreeNode = styled.div<{ isActive: boolean; isVisited: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) =>
    props.isActive ? '#ff0000' : props.isVisited ? '#00ff00' : '#ffffff'};
  border: 2px solid #000000;
  margin: 5px;
`;

// TypeScript interfaces and types
interface BinaryTreeNode {
  value: number;
  left: BinaryTreeNode | null;
  right: BinaryTreeNode | null;
}

type TraversalOrder = 'inorder' | 'preorder' | 'postorder';

// Binary tree class
class BinaryTree {
  root: BinaryTreeNode | null;

  constructor() {
    this.root = null;
  }

  insert(value: number) {
    const newNode: BinaryTreeNode = { value, left: null, right: null };
    if (!this.root) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          break;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          break;
        }
        current = current.right;
      }
    }
  }
}

// Traversal functions
function* inorderTraversal(
  node: BinaryTreeNode | null
): Generator<BinaryTreeNode> {
  if (node) {
    yield* inorderTraversal(node.left);
    yield node;
    yield* inorderTraversal(node.right);
  }
}

function* preorderTraversal(
  node: BinaryTreeNode | null
): Generator<BinaryTreeNode> {
  if (node) {
    yield node;
    yield* preorderTraversal(node.left);
    yield* preorderTraversal(node.right);
  }
}

function* postorderTraversal(
  node: BinaryTreeNode | null
): Generator<BinaryTreeNode> {
  if (node) {
    yield* postorderTraversal(node.left);
    yield* postorderTraversal(node.right);
    yield node;
  }
}

// Main component
const BinaryTreeTraversalsComponent: React.FC = () => {
  const [tree, setTree] = useState<BinaryTree>(new BinaryTree());
  const [traversalOrder, setTraversalOrder] = useState<TraversalOrder>('inorder');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [traversalPath, setTraversalPath] = useState<BinaryTreeNode[]>([]);
  const [explanation, setExplanation] = useState<string>('');

  useEffect(() => {
    const newTree = new BinaryTree();
    [5, 3, 7, 1, 4, 6, 8].forEach((value) => newTree.insert(value));
    setTree(newTree);
  }, []);

  useEffect(() => {
    resetTraversal();
  }, [traversalOrder, tree]);

  const resetTraversal = () => {
    setCurrentStep(0);
    setTraversalPath([]);
    setExplanation('');
    const traversalFunction = getTraversalFunction(traversalOrder);
    setTraversalPath([...traversalFunction(tree.root)]);
  };

  const getTraversalFunction = (order: TraversalOrder) => {
    switch (order) {
      case 'inorder':
        return inorderTraversal;
      case 'preorder':
        return preorderTraversal;
      case 'postorder':
        return postorderTraversal;
    }
  };

  const handleNextStep = () => {
    if (currentStep < traversalPath.length) {
      setCurrentStep(currentStep + 1);
      updateExplanation();
    }
  };

  const updateExplanation = () => {
    const node = traversalPath[currentStep];
    let explanation = '';
    switch (traversalOrder) {
      case 'inorder':
        explanation = `Visit left subtree, process node ${node.value}, then visit right subtree`;
        break;
      case 'preorder':
        explanation = `Process node ${node.value}, visit left subtree, then visit right subtree`;
        break;
      case 'postorder':
        explanation = `Visit left subtree, visit right subtree, then process node ${node.value}`;
        break;
    }
    setExplanation(explanation);
  };

  const renderTree = (node: BinaryTreeNode | null, x: number, y: number, level: number) => {
    if (!node) return null;

    const isActive = traversalPath[currentStep] === node;
    const isVisited = traversalPath.indexOf(node) < currentStep;

    return (
      <g key={node.value}>
        <TreeNode
          isActive={isActive}
          isVisited={isVisited}
          style={{ transform: `translate(${x}px, ${y}px)` }}
        >
          {node.value}
        </TreeNode>
        {node.left &&
          renderTree(node.left, x - 60 / (level + 1), y + 60, level + 1)}
        {node.right &&
          renderTree(node.right, x + 60 / (level + 1), y + 60, level + 1)}
      </g>
    );
  };

  return (
    <>
      <GlobalStyle />
      <StyledBinaryTreeVisualization>
        <svg width="400" height="300">
          {renderTree(tree.root, 200, 30, 0)}
        </svg>
      </StyledBinaryTreeVisualization>
      <StyledTraversalOrderDisplay>
        Current Traversal: {traversalOrder}
      </StyledTraversalOrderDisplay>
      <StyledControlPanel>
        <Button onClick={() => setTraversalOrder('inorder')}>Inorder</Button>
        <Button onClick={() => setTraversalOrder('preorder')}>Preorder</Button>
        <Button onClick={() => setTraversalOrder('postorder')}>Postorder</Button>
        <Button onClick={handleNextStep}>Next Step</Button>
        <Button onClick={resetTraversal}>Reset</Button>
      </StyledControlPanel>
      <StyledStepExplanation>{explanation}</StyledStepExplanation>
    </>
  );
};

export default BinaryTreeTraversalsComponent;