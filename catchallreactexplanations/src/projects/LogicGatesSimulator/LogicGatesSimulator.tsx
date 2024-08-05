import React, { useState } from 'react';
import styled from 'styled-components';
import { FaLongArrowAltRight, FaEquals } from 'react-icons/fa';

// Styled components
const Container = styled.div`
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
`;

const InputSection = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const Input = styled.div`
  display: flex;
  align-items: center;
`;

const Switch = styled.input`
  margin-right: 10px;
`;

const GateSelector = styled.select`
  margin-bottom: 20px;
  padding: 5px;
`;

const StepButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  margin-right: 10px;
`;

const ResetButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
`;

const OutputDisplay = styled.div`
  font-size: 24px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StepDescription = styled.p`
  margin-top: 20px;
  font-style: italic;
`;

// Types
type Gate = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR';

// Logic Gates Simulator Component
const LogicGatesSimulator: React.FC = () => {
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);
  const [selectedGate, setSelectedGate] = useState<Gate>('AND');
  const [step, setStep] = useState(0);
  const [output, setOutput] = useState<boolean | null>(null);

  const gates: Gate[] = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR'];

  const resetSimulation = () => {
    setInputA(false);
    setInputB(false);
    setSelectedGate('AND');
    setStep(0);
    setOutput(null);
  };

  const performOperation = (gate: Gate, a: boolean, b: boolean): boolean => {
    switch (gate) {
      case 'AND': return a && b;
      case 'OR': return a || b;
      case 'NOT': return !a;
      case 'NAND': return !(a && b);
      case 'NOR': return !(a || b);
      case 'XOR': return a !== b;
    }
  };

  const handleStep = () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      setOutput(performOperation(selectedGate, inputA, inputB));
      setStep(2);
    } else {
      resetSimulation();
    }
  };

  const getStepDescription = (): string => {
    switch (step) {
      case 0:
        return "Set the inputs and select a logic gate.";
      case 1:
        return `Applying ${selectedGate} operation to inputs.`;
      case 2:
        return "Operation complete. Click 'Step' to reset.";
      default:
        return "";
    }
  };

  return (
    <Container>
      <Title>Logic Gates Simulator</Title>
      <InputSection>
        <Input>
          <Switch
            type="checkbox"
            checked={inputA}
            onChange={() => setInputA(!inputA)}
            disabled={step !== 0}
          />
          <label>Input A</label>
        </Input>
        <Input>
          <Switch
            type="checkbox"
            checked={inputB}
            onChange={() => setInputB(!inputB)}
            disabled={step !== 0 || selectedGate === 'NOT'}
          />
          <label>Input B</label>
        </Input>
      </InputSection>
      <GateSelector
        value={selectedGate}
        onChange={(e) => setSelectedGate(e.target.value as Gate)}
        disabled={step !== 0}
      >
        {gates.map((gate) => (
          <option key={gate} value={gate}>
            {gate}
          </option>
        ))}
      </GateSelector>
      <div>
        <StepButton onClick={handleStep}>Step</StepButton>
        <ResetButton onClick={resetSimulation}>Reset</ResetButton>
      </div>
      <OutputDisplay>
        {inputA.toString()} <FaLongArrowAltRight />
        {selectedGate} <FaLongArrowAltRight />
        {selectedGate !== 'NOT' && `${inputB.toString()} `}
        <FaEquals /> {output !== null ? output.toString() : '?'}
      </OutputDisplay>
      <StepDescription>{getStepDescription()}</StepDescription>
    </Container>
  );
};

export default LogicGatesSimulator;