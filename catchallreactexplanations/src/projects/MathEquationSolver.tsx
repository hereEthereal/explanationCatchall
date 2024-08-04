import React, { useState } from 'react';
import * as math from 'mathjs';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0051bb;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const Result = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: #0070f3;
`;

const Error = styled.p`
  color: #d32f2f;
  background-color: #ffcdd2;
  padding: 8px;
  border-radius: 4px;
`;

const StepContainer = styled.div`
  margin-top: 16px;
  padding: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
`;

// TypeScript interfaces for MathNode types
interface OperatorNode extends math.MathNode {
  op: string;
  args: math.MathNode[];
}

interface ParenthesisNode extends math.MathNode {
  content: math.MathNode;
}

// Main component
const MathEquationSolver: React.FC = () => {
  const [equation, setEquation] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [steps, setSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Solve the equation and generate steps
  const solveEquation = () => {
    try {
      const solution = math.evaluate(equation);
      console.log('Solution:', solution);
      setResult(`Result: ${solution}`);
      setError('');
      generateSteps();
    } catch (err) {
      setError('Invalid equation. Please check your input.');
      setResult('');
      setSteps([]);
      setCurrentStep(0);
    }
  };

  // Generate step-by-step solution
  const generateSteps = () => {
    try {
      const node = math.parse(equation);
      const steps: string[] = [];

      const traverse = (node: math.MathNode): string => {
        if (node.type === 'OperatorNode') {
          const opNode = node as OperatorNode;
          const leftResult = traverse(opNode.args[0]);
          const rightResult = traverse(opNode.args[1]);
          const result = math.evaluate(`${leftResult} ${opNode.op} ${rightResult}`);
          steps.push(`${leftResult} ${opNode.op} ${rightResult} = ${result}`);
          return result.toString();
        } else if (node.type === 'ParenthesisNode') {
          const parenNode = node as ParenthesisNode;
          return traverse(parenNode.content);
        } else {
          return node.toString();
        }
      };

      traverse(node);
      setSteps(steps);
      setCurrentStep(0);
    } catch (err) {
      setError('Error generating steps. Please check your input.');
      setSteps([]);
      setCurrentStep(0);
    }
  };

  // Handle step button click
  const handleStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <Container>
      <Title>Math Equation Solver</Title>
      <InputContainer>
        <Input
          type="text"
          value={equation}
          onChange={(e) => setEquation(e.target.value)}
          placeholder="Enter your equation (e.g., 3*4+4)"
        />
        <Button onClick={solveEquation}>Solve</Button>
        <Button onClick={handleStep} disabled={currentStep >= steps.length}>
          Step
        </Button>
      </InputContainer>
      {result && <Result>{result}</Result>}
      {error && <Error>{error}</Error>}
      {steps.length > 0 && (
        <StepContainer>
          <h3>Steps:</h3>
          {steps.slice(0, currentStep).map((step, index) => (
            <p key={index}>{step}</p>
          ))}
        </StepContainer>
      )}
    </Container>
  );
};

export default MathEquationSolver;