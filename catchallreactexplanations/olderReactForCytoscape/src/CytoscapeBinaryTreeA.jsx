import React, { useState, useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CytoscapeContainer = styled.div`
  width: 100%;
  height: 400px;
  background-color: #f0f0f0;
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #6FB1FC;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #4A90E2;
  }
`;

const Message = styled.p`
  font-size: 0.875rem;
  color: #666;
`;

const CytoscapeBinaryTreeA = () => {
  const containerRef = useRef(null);
  const [cyInstance, setCyInstance] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');

  class TreeNode {
    constructor(value) {
      this.value = value;
      this.left = null;
      this.right = null;
    }
  }

  class BinarySearchTree {
    constructor() {
      this.root = null;
    }

    insert(value) {
      this.root = this._insertNode(this.root, value);
    }

    _insertNode(node, value) {
      if (node === null) {
        return new TreeNode(value);
      }

      if (value < node.value) {
        node.left = this._insertNode(node.left, value);
      } else if (value > node.value) {
        node.right = this._insertNode(node.right, value);
      }

      return node;
    }

    delete(value) {
      this.root = this._deleteNode(this.root, value);
    }

    _deleteNode(node, value) {
      if (node === null) return null;

      if (value < node.value) {
        node.left = this._deleteNode(node.left, value);
      } else if (value > node.value) {
        node.right = this._deleteNode(node.right, value);
      } else {
        if (node.left === null) return node.right;
        if (node.right === null) return node.left;

        let minNode = this._findMin(node.right);
        node.value = minNode.value;
        node.right = this._deleteNode(node.right, minNode.value);
      }

      return node;
    }

    _findMin(node) {
      while (node.left !== null) {
        node = node.left;
      }
      return node;
    }

    search(value) {
      return this._searchNode(this.root, value);
    }

    _searchNode(node, value) {
      if (node === null || node.value === value) return node;
      if (value < node.value) return this._searchNode(node.left, value);
      return this._searchNode(node.right, value);
    }
  }

  const [bst] = useState(() => {
    const tree = new BinarySearchTree();
    let init =     [30,15,45,7,22,37,52,3,11,18,26,33,41,48,56];
    // [30, 15, 45, 7, 22, 37, 52].forEach(value => tree.insert(value));
    init.forEach(value => tree.insert(value));
    
    return tree;
  });

  const createTreeElements = (bst) => {
    const elements = [];
    const addNodeToCytoscape = (node, x, y, level) => {
      if (node === null) return;

      elements.push({ 
        data: { id: `node${node.value}`, label: node.value },
        position: { x, y }
      });

      if (node.left) {
        elements.push({ 
          data: { 
            id: `edge${node.value}-${node.left.value}`, 
            source: `node${node.value}`, 
            target: `node${node.left.value}` 
          }
        });
        addNodeToCytoscape(node.left, x - 100 / (level + 1), y + 80, level + 1);
      }

      if (node.right) {
        elements.push({ 
          data: { 
            id: `edge${node.value}-${node.right.value}`, 
            source: `node${node.value}`, 
            target: `node${node.right.value}` 
          }
        });
        addNodeToCytoscape(node.right, x + 100 / (level + 1), y + 80, level + 1);
      }
    };

    addNodeToCytoscape(bst.root, 0, 0, 0);
    return elements;
  };

  const updateCytoscape = () => {
    if (cyInstance) {
      cyInstance.elements().remove();
      cyInstance.add(createTreeElements(bst));
      cyInstance.fit();
      cyInstance.center();
    }
  };

  useEffect(() => {
    const cy = cytoscape({
      container: containerRef.current,
      elements: createTreeElements(bst),
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#6FB1FC',
            'label': 'data(label)',
            'color': '#fff',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '12px',
            'width': '30px',
            'height': '30px'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1,
            'line-color': '#ccc',
            'curve-style': 'bezier'
          }
        }
      ],
      layout: {
        name: 'preset'
      }
    });

    cy.fit();
    cy.center();
    setCyInstance(cy);

    return () => {
      cy.destroy();
    };
  }, []);

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      bst.insert(value);
      updateCytoscape();
      setMessage(`Inserted ${value}`);
    } else {
      setMessage('Invalid input');
    }
    setInputValue('');
  };

  const handleDelete = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      bst.delete(value);
      updateCytoscape();
      setMessage(`Deleted ${value}`);
    } else {
      setMessage('Invalid input');
    }
    setInputValue('');
  };

  const handleSearch = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      const result = bst.search(value);
      setMessage(result ? `Found ${value}` : `${value} not found`);
    } else {
      setMessage('Invalid input');
    }
    setInputValue('');
  };

  return (
    <Container>
      <CytoscapeContainer ref={containerRef} />
      <ControlsContainer>
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a number"
        />
        <Button onClick={handleInsert}>Insert</Button>
        <Button onClick={handleDelete}>Delete</Button>
        <Button onClick={handleSearch}>Search</Button>
      </ControlsContainer>
      {message && <Message>{message}</Message>}
    </Container>
  );
};

export default CytoscapeBinaryTreeA;

