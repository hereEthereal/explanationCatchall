import React from "react";
import styled from "styled-components";
import { ExecutiveCoordinator } from "./simulationUtils";

const InfoPanelContainer = styled.div`
  width: 300px;
  height: 600px;
  margin-left: 20px;
  padding: 10px;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  overflow-y: auto;
`;

interface InfoPanelProps {
  totalEnergyCreated: number;
  amountOfStoredEnergyInNexus: number;
  largestRewardCount: number;
  executiveCoordinator: ExecutiveCoordinator | null;
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  totalEnergyCreated,
  amountOfStoredEnergyInNexus,
  largestRewardCount,
  executiveCoordinator
}) => {
  const entityColors = {
    EN: "rgba(0, 255, 0, 0.2)",
    EM: "red",
    EC: "blue",
    ECv: "orange",
  };

  return (
    <InfoPanelContainer>
      <h2>Entity Information</h2>
      <h3>Color Mapping:</h3>
      <ul>
        {Object.entries(entityColors).map(([entity, color]) => (
          <li key={entity}>
            <span style={{ color }}>{entity}</span>: {color}
          </li>
        ))}
      </ul>
      <div>Total Energy Created: {totalEnergyCreated}</div>
      <div>Stored Energy in Nexus: {amountOfStoredEnergyInNexus}</div>
      <div>Largest Reward Count: {largestRewardCount}</div>
      <h3>Executive Coordinator Knowledge:</h3>
      {executiveCoordinator && (
        <>
          <div>Number of Converters: {executiveCoordinator.knownLocations.converters.length}</div>
          <div>Nexus Location: ({executiveCoordinator.knownLocations.nexus.x}, {executiveCoordinator.knownLocations.nexus.y})</div>
          <div>Self Location: ({executiveCoordinator.knownLocations.self.x}, {executiveCoordinator.knownLocations.self.y})</div>
        </>
      )}
    </InfoPanelContainer>
  );
};

export default InfoPanel;