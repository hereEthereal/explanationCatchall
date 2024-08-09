import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import cytoscape from 'cytoscape';

// Styled components for Alert
const Alert = styled.div`
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  margin-top: 1rem;
`;

const AlertTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const AlertDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

const TwoSumSolver = () => {
  const [numberArray, setNumberArray] = useState('');
  const [targetNumber, setTargetNumber] = useState('');
  const [result, setResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(null);
  const cyRef = useRef(null);

  useEffect(() => {
    // Initialize cytoscape
    cyRef.current = cytoscape({
      container: document.getElementById('cy'),
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            'label': 'data(id)'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle'
          }
        }
      ],
      layout: {
        name: 'grid',
        rows: 1
      }
    });
  }, []);

  const updateVisualization = (numbers, i, j) => {
    const cy = cyRef.current;
    cy.elements().remove();
    
    numbers.forEach((num, index) => {
      cy.add({
        group: 'nodes',
        data: { id: index.toString(), label: num.toString() }
      });
      if (index > 0) {
        cy.add({
          group: 'edges',
          data: { source: (index - 1).toString(), target: index.toString() }
        });
      }
    });

    cy.nodes().removeClass('highlighted');
    cy.nodes(`#${i}`).addClass('highlighted');
    cy.nodes(`#${j}`).addClass('highlighted');

    cy.layout({ name: 'grid', rows: 1 }).run();
  };

  const twoSum = (numbers, target) => {
    for (let i = 0; i < numbers.length - 1; i++) {
      for (let j = i + 1; j < numbers.length; j++) {
        setCurrentStep({ i, j, sum: numbers[i] + numbers[j] });
        updateVisualization(numbers, i, j);
        
        if (numbers[i] + numbers[j] === target) {
          return [i, j];
        }
      }
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numbers = numberArray.split(',').map(num => parseInt(num.trim(), 10));
    const target = parseInt(targetNumber, 10);
    
    const solution = twoSum(numbers, target);
    
    if (solution) {
      setResult({ indices: solution, sum: target });
    } else {
      setResult({ error: 'No solution found' });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">2Sum Solver</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-4">
        <div>
          <label htmlFor="numberArray" className="block text-sm font-medium text-gray-700">
            Number Array (comma-separated):
          </label>
          <input
            type="text"
            id="numberArray"
            value={numberArray}
            onChange={(e) => setNumberArray(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label htmlFor="targetNumber" className="block text-sm font-medium text-gray-700">
            Target Number:
          </label>
          <input
            type="number"
            id="targetNumber"
            value={targetNumber}
            onChange={(e) => setTargetNumber(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Solve
        </button>
      </form>

      <div id="cy" style={{ width: '100%', height: '300px', border: '1px solid #ccc' }}></div>

      {currentStep && (
        <div className="mt-4">
          <p>Current step: i = {currentStep.i}, j = {currentStep.j}, sum = {currentStep.sum}</p>
        </div>
      )}

      {result && (
        <Alert className="mt-4">
          <AlertTitle>{result.error ? 'No Solution' : 'Solution Found!'}</AlertTitle>
          <AlertDescription>
            {result.error ? result.error : `Indices: [${result.indices[0]}, ${result.indices[1]}], Sum: ${result.sum}`}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default TwoSumSolver;