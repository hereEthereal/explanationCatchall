import React, { useState, useRef } from 'react';
import styled from 'styled-components';

const AudioPlayerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  margin: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 5px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;

const SpeedControl = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const SpeedButton = styled(Button)`
  padding: 5px 10px;
  font-size: 14px;
  background-color: #008CBA;
  &:hover {
    background-color: #007B9E;
  }
`;

const SpeedDisplay = styled.span`
  margin: 0 10px;
  font-size: 16px;
  font-weight: bold;
`;

const AudioPlayerComponent = ({ filePath, buttonText }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => setError(e.message));
    }
    setIsPlaying(!isPlaying);
  };

  const adjustSpeed = (adjustment) => {
    const newRate = Math.max(0.5, Math.min(2, playbackRate + adjustment));
    setPlaybackRate(newRate);
    audioRef.current.playbackRate = newRate;
  };

  return (
    <AudioPlayerWrapper>
      <audio
        ref={audioRef}
        src={filePath}
        onError={(e) => setError("Error loading audio file: " + e.target.error.message)}
      />
      <Button onClick={togglePlay}>
        {isPlaying ? 'Pause' : 'Play'} {buttonText}
      </Button>
      <SpeedControl>
        <SpeedButton onClick={() => adjustSpeed(-0.1)}>-0.1x</SpeedButton>
        <SpeedDisplay>{playbackRate.toFixed(1)}x</SpeedDisplay>
        <SpeedButton onClick={() => adjustSpeed(0.1)}>+0.1x</SpeedButton>
      </SpeedControl>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </AudioPlayerWrapper>
  );
};


export default AudioPlayerComponent;