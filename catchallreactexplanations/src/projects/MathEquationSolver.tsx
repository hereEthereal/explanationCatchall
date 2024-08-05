import React, { useState, ChangeEvent } from 'react';
import * as math from 'mathjs';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StyledSelect = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
  margin-bottom: 8px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: ${props => props.disabled ? '#cccccc' : '#0070f3'};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.disabled ? '#cccccc' : '#0051bb'};
  }
`;

const WorkingLine = styled.div`
  margin-top: 16px;
  padding: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-family: monospace;
  font-size: 18px;
`;

const InfoText = styled.p`
  font-size: 14px;
  color: #666;
  margin-top: 8px;
`;

const exampleEquations = [
  '(8 - 3) * 2 + 5',
  'sqrt(16) + 3^2',
  '2 * pi * 5',
  '(15 % 4) * 3',
  
];


const MathEquationSolver: React.FC = () => {
    const [equation, setEquation] = useState<string>('');
    const [currentStep, setCurrentStep] = useState<string>('');
    const [steps, setSteps] = useState<string[]>([]);
    const [stepIndex, setStepIndex] = useState<number>(0);
    const [buildUpSteps, setBuildUpSteps] = useState<string[]>([]);
    const [currentBuildUpStep, setCurrentBuildUpStep] = useState<number>(0);
  
    const solveEquation = () => {
      try {
        const node = math.parse(equation);
        const newSteps = generateSteps(node);
        setSteps(newSteps);
        setCurrentStep(newSteps[0]);
        setStepIndex(0);
      } catch (err) {
        setCurrentStep('Invalid equation. Please check your input.');
        setSteps([]);
      }
    };
  
    const generateSteps = (node: math.MathNode): string[] => {
      const steps: string[] = [node.toString()];
      
      const traverse = (node: math.MathNode): string => {
        if (node.type === 'OperatorNode') {
          const opNode = node as math.OperatorNode;
          const left = traverse(opNode.args[0]);
          const right = traverse(opNode.args[1]);
          const result = math.evaluate(`${left} ${opNode.op} ${right}`);
          let newStep = steps[steps.length - 1].replace(`${left} ${opNode.op} ${right}`, result.toString());
          newStep = removeUnnecessaryParentheses(newStep);
          if (newStep !== steps[steps.length - 1]) {
            steps.push(newStep);
          }
          return result.toString();
        } else if (node.type === 'ParenthesisNode') {
          const parenNode = node as math.ParenthesisNode;
          const innerResult = traverse(parenNode.content);
          let newStep = steps[steps.length - 1].replace(`(${parenNode.content.toString()})`, innerResult);
          newStep = removeUnnecessaryParentheses(newStep);
          if (newStep !== steps[steps.length - 1]) {
            steps.push(newStep);
          }
          return innerResult;
        } else if (node.type === 'FunctionNode') {
          const funcNode = node as math.FunctionNode;
          const args = funcNode.args.map(arg => traverse(arg));
          const funcName = funcNode.fn.toString();
          const result = math.evaluate(`${funcName}(${args.join(',')})`);
          let newStep = steps[steps.length - 1].replace(`${funcName}(${args.join(',')})`, result.toString());
          newStep = removeUnnecessaryParentheses(newStep);
          if (newStep !== steps[steps.length - 1]) {
            steps.push(newStep);
          }
          return result.toString();
        } else {
          return node.toString();
        }
      };
  
      traverse(node);
      return steps;
    };
  
    const removeUnnecessaryParentheses = (expression: string): string => {
      return expression.replace(/\((\d+(\.\d+)?)\)/g, '$1');
    };
  
    const handleStep = () => {
      if (stepIndex < steps.length - 1) {
        setStepIndex(stepIndex + 1);
        setCurrentStep(steps[stepIndex + 1]);
      }
    };
  
    const handleExampleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        setEquation(event.target.value);
      };

    const generateBuildUpSteps = () => {
      const operators = ['+', '-', '*', '/', '^'];
      const functions = ['sqrt', 'sin', 'cos', 'tan', 'log', 'abs'];
      let currentEquation = Math.floor(Math.random() * 10).toString();
      const steps: string[] = [currentEquation];
  
      for (let i = 0; i < 5; i++) {
        const rand = Math.random();
        if (rand < 0.7) {
          // Add an operator and a number
          const operator = operators[Math.floor(Math.random() * operators.length)];
          const number = Math.floor(Math.random() * 10);
          currentEquation = `(${currentEquation}) ${operator} ${number}`;
        } else {
          // Wrap in a function
          const func = functions[Math.floor(Math.random() * functions.length)];
          currentEquation = `${func}(${currentEquation})`;
        }
        steps.push(currentEquation);
      }
  
      setBuildUpSteps(steps);
      setCurrentBuildUpStep(0);
      setEquation(steps[0]);
    };
  
    const handleBuildUpStep = () => {
      if (currentBuildUpStep < buildUpSteps.length - 1) {
        setCurrentBuildUpStep(currentBuildUpStep + 1);
        setEquation(buildUpSteps[currentBuildUpStep + 1]);
      }
    };
  
    return (
        <Container>
          <Title>Math Equation Solver</Title>
          <InputContainer>
            <StyledSelect
              onChange={handleExampleSelect}
              value={equation}
            >
              <option value="">Select an example equation</option>
              {exampleEquations.map((eq, index) => (
                <option key={index} value={eq}>
                  {eq}
                </option>
              ))}
            </StyledSelect>
            <Input
              type="text"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              placeholder="Enter your equation (e.g., (8 - 3) * 2 + 5)"
            />
            <ButtonContainer>
              <Button onClick={solveEquation}>Solve</Button>
              <Button onClick={handleStep} disabled={stepIndex >= steps.length - 1 || steps.length === 0}>
                Step
              </Button>
              <Button onClick={generateBuildUpSteps}>Generate Build-up</Button>
              <Button onClick={handleBuildUpStep} disabled={currentBuildUpStep >= buildUpSteps.length - 1}>
                Build Up Step
              </Button>
            </ButtonContainer>
          </InputContainer>
          {currentStep && <WorkingLine>{currentStep}</WorkingLine>}
          <InfoText>
            Supported operations: + (add), - (subtract), * (multiply), / (divide), 
            ^ or ** (exponent), sqrt() (square root), sin(), cos(), tan(), log(), abs()
          </InfoText>
        </Container>
      );
  };

export default MathEquationSolver;