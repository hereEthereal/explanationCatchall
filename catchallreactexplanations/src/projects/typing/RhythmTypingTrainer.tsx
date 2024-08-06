import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import styled from "styled-components";

type RhythmMode = "quarter" | "triplet" | "sixteenth";

interface KeyPress {
  timestamp: number;
  key: string;
  isCorrect: boolean;
  isOnBeat: boolean;
  timingDifference: number;
}

interface TextOption {
  id: string;
  text: string;
}


const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Card = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const CardHeader = styled.div`
  margin-bottom: 20px;
`;

const CardTitle = styled.h2`
  font-size: 24px;
  color: #333;
  margin: 0;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

const TextDisplay = styled.div`
  font-size: 18px;
  line-height: 1.5;
  margin-bottom: 20px;
  height: 150px;
  overflow: hidden;
`;

const CountInDisplay = styled.div<{ active: boolean }>`
  font-size: 48px;
  font-weight: bold;
  text-align: center;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s;
  color: ${(props) => (props.active ? "#007bff" : "#999")};
  transform: ${(props) => (props.active ? "scale(1.5)" : "scale(1)")};
`;

const TypingInput = styled(Input)<{ feedbackColor: string }>`
  background-color: ${(props) => props.feedbackColor};
  transition: background-color 0.1s;
`;

const ReportCard = styled(Card)`
  white-space: pre-wrap;
`;

const Word = styled.span<{ isActive: boolean; isTyped: boolean }>`
  background-color: ${(props) =>
    props.isActive ? "#90EE90" : props.isTyped ? "#E0E0E0" : "transparent"};
  padding: 2px 0;
`;

const PageIndicator = styled.div`
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
  color: #666;
`;

const ToleranceDisplay = styled.div`
  font-size: 16px;
  margin-top: 10px;
  text-align: center;
`;
interface AlertWrapperProps {
  visible: boolean;
}
const AlertWrapper = styled.div<AlertWrapperProps>`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
`;
const StyledAlert = styled.div`
  background-color: #f0f8ff;
  border: 1px solid #b0d4ff;
  border-radius: 4px;
  padding: 10px 15px;
  color: #0066cc;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const AverageTimingDisplay = styled.div`
  font-size: 16px;
  margin-top: 10px;
  text-align: center;
`;

const RhythmTypingTrainer: React.FC = () => {

  const textOptions: TextOption[] = [
    {
      id: "simple",
      text: `the sun rose over the hills casting a warm glow on the sleepy town below birds began to chirp as people slowly woke up and started their day children walked to school with backpacks full of books while adults rushed to work carrying cups of coffee the smell of fresh bread wafted from the local bakery as the baker pulled hot loaves from the oven a group of friends met at the park to play frisbee and enjoy the nice weather as the day went on people went about their routines shopping gardening and chatting with neighbors when evening came families gathered for dinner sharing stories about their day before settling in to watch television or read books as night fell the town grew quiet with only the occasional sound of a car passing by or a dog barking in the distance the moon shone brightly in the sky surrounded by twinkling stars signaling the end of another peaceful day in the small town`
    },
    {
      id: "olympics",
      text: `the olympic games are a massive international sporting event that takes place every four years bringing together thousands of athletes from hundreds of countries around the world the games alternate between summer and winter editions each featuring a unique set of sports and disciplines the summer olympics typically include popular events like swimming track and field gymnastics and team sports such as basketball and volleyball while the winter olympics showcase sports like skiing snowboarding figure skating and ice hockey
  the modern olympic games have their roots in ancient greece where athletic competitions were held to honor the god zeus the first modern olympics were held in athens greece in eighteen ninety six and have since grown into a global phenomenon watched by billions of people worldwide
  the international olympic committee oversees the organization of the games and works with host cities to plan and execute the event which often requires years of preparation and significant investment in infrastructure and facilities the olympics are not just about sports but also serve as a platform for cultural exchange diplomacy and promoting international goodwill
  one of the most iconic symbols of the olympics is the olympic flame which is lit in olympia greece and carried by torch bearers to the host city where it burns throughout the duration of the games the opening and closing ceremonies are elaborate spectacles that showcase the host countrys culture and history while also celebrating the olympic spirit
  athletes train for years to compete at the olympic level with many dedicating their entire lives to their sport the games provide a stage for these individuals to showcase their skills and potentially win medals for their countries olympic records are highly prestigious and breaking them is considered one of the greatest achievements in sports
  the paralympic games which feature athletes with disabilities are held shortly after the olympic games in the same host city using many of the same venues these games have grown in popularity and recognition highlighting the incredible abilities of paralympic athletes
  the olympics have also been the site of many historic moments and have sometimes intersected with global politics such as the nineteen eighty boycotts or the black power salute at the nineteen sixty eight games in mexico city despite occasional controversies the olympic games continue to captivate audiences worldwide and inspire new generations of athletes and sports enthusiasts`
    },
    {
      id: "olympics a",
      text: `the olympic games are a worldwide celebration of sports and athleticism that occurs every four years athletes from countries all around the globe come together to compete in various events ranging from swimming and track to gymnastics and team sports the olympics have a rich history dating back to ancient greece and have evolved over time to include modern sports and reflect changing cultural values the games provide a unique opportunity for people to witness incredible feats of human performance and to feel a sense of unity with others from different nations many viewers are inspired by the dedication and skill of the athletes and the olympics often spark interest in sports and fitness among people of all ages the event also serves as a platform for host cities to showcase their culture and infrastructure to the world making it a significant economic and cultural occasion for the chosen location`
    },{
      id: "lorem",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      id: "typing",
      text: "Typing quickly and accurately is an essential skill in today's digital world.",
    },
    {
      id: "rhythm",
      text: "Rhythm is the soul of life. The whole universe revolves in rhythm. Everything and every human action revolves in rhythm.",
    },
    {
      id: "ocean",
      text: `The depths of our oceans remain one of the last great frontiers on Earth, with vast areas still unexplored and teeming with undiscovered life forms. Scientists estimate that we have only identified about 5 percent of the ocean's species, leaving a staggering 95% yet to be discovered. The deep sea, in particular, holds countless mysteries, from bioluminescent creatures that create their own light in the darkness to extremophiles thriving in scorching hydrothermal vents. Recent expeditions have uncovered bizarre and fascinating animals like the vampire squid, the barreleye fish with its transparent head, and the immortal jellyfish, which can potentially live forever by reverting to its juvenile stage. As technology advances, allowing us to probe deeper into the abyss, we continue to be amazed by the incredible diversity and adaptability of life in these harsh, alien-like environments.`,
    },
    {
      id: "linear algebra",
      text: `Linear Algebra is a branch of mathematics that deals with lines, planes, and vectors in multiple dimensions. It's like the math you learned in school about lines and graphs, but taken to the next level. Imagine you're organizing a party, and you need to figure out how many chairs, tables, and decorations you need. Linear Algebra helps you solve these kinds of problems, but for much more complex situations. Here are some key concepts in Linear Algebra: 1. Vectors: Think of these as arrows pointing in a specific direction. They can represent things like force, velocity, or even data points. 2. Matrices: These are like spreadsheets filled with numbers. They're used to organize and manipulate large amounts of data efficiently. 3. Systems of equations: Remember those word problems where you had to solve for x and y? Linear Algebra deals with many of these equations at once, sometimes with hundreds of variables. 4. Transformations: This is like taking a shape and stretching, rotating, or squishing it. Linear Algebra helps describe these changes mathematically. 5. Eigenvalues and eigenvectors: These are special numbers and directions that remain unchanged when a transformation is applied. They're like the "skeleton" of a complex system. Linear Algebra is used in many real-world applications, such as computer graphics and animation, machine learning and artificial intelligence, economic modeling, engineering and physics simulations, and data compression (like in JPEG images). In essence, Linear Algebra provides tools to handle complex problems involving multiple variables and dimensions. It's a powerful way to represent and solve problems in many fields of science, technology, and beyond.`,
    },
    {
      id: "more lorm",
      text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    }
  ];
  const INITIAL_TIMING_TOLERANCE = 0.3; // 10% of beat interval
  const [bpm, setBpm] = useState<number>(86);
  const [bpmIncreaseInterval, setBpmIncreaseInterval] = useState<number>(40);
  const [rhythmMode, setRhythmMode] = useState<RhythmMode>("sixteenth");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedTextId, setSelectedTextId] = useState<string>("fox");
  const [text, setText] = useState<string>(textOptions[0].text);
  const [userInput, setUserInput] = useState<string>("");
  const [keyPresses, setKeyPresses] = useState<KeyPress[]>([]);
  const [report, setReport] = useState<string>("");
  const [feedbackColor, setFeedbackColor] = useState<string>("transparent");
  const [countIn, setCountIn] = useState<string>("");
  const [isCountInActive, setIsCountInActive] = useState<boolean>(false);
  const [timingTolerance, setTimingTolerance] = useState<number>(
    INITIAL_TIMING_TOLERANCE
  );

  const [recentAccuracy, setRecentAccuracy] = useState<[number, number][]>([]);
  const [lastAccuracyCheckTime, setLastAccuracyCheckTime] = useState<number>(0);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pages, setPages] = useState<string[][]>([]);
  const [wordsPerPage, setWordsPerPage] = useState<number>(20);

  const audioContext = useRef<AudioContext | null>(null);
  const nextNoteTime = useRef<number>(0);
  const timerID = useRef<number | null>(null);
  const lastBeatTime = useRef<number>(0);
  const countInBeats = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const isTimingStarted = useRef<boolean>(false);
  const bpmIncreaseTimerRef = useRef<number | null>(null);
  const textDisplayRef = useRef<HTMLDivElement>(null);

  const feedbackTimeoutRef = useRef<number | null>(null);

  const [toleranceMessage, setToleranceMessage] = useState<string>("");
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  const [averageTimingDifference, setAverageTimingDifference] =
    useState<number>(0);
  const toleranceMessageTimeoutRef = useRef<number | null>(null);
  const averageTimingUpdateIntervalRef = useRef<number | null>(null);
  const AVERAGE_TIMING_UPDATE_INTERVAL = 15000; // 15 seconds
  const recentTimingDifferences = useRef<number[]>([]);
  const AVERAGE_TIMING_WINDOW = 100; // Consider the last 100 key presses

  useEffect(() => {
    const words = text.split(" ");
    const newPages = [];
    for (let i = 0; i < words.length; i += wordsPerPage) {
      newPages.push(words.slice(i, i + wordsPerPage));
    }
    setPages(newPages);
    setCurrentPage(0);
    setCurrentWordIndex(0);
  }, [text, wordsPerPage]);

  useEffect(() => {
    audioContext.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const selectedText = textOptions.find(
      (option) => option.id === selectedTextId
    );
    if (selectedText) {
      setText(selectedText.text);
    }
  }, [selectedTextId]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      bpmIncreaseTimerRef.current = window.setInterval(() => {
        setBpm((prevBpm) => prevBpm + 1);
      }, bpmIncreaseInterval * 1000);
    } else if (bpmIncreaseTimerRef.current) {
      clearInterval(bpmIncreaseTimerRef.current);
    }

    return () => {
      if (bpmIncreaseTimerRef.current) {
        clearInterval(bpmIncreaseTimerRef.current);
      }
    };
  }, [isPlaying, bpmIncreaseInterval]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isPlaying) {
        updateAverageTimingDifference();
      }
    }, AVERAGE_TIMING_UPDATE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [isPlaying]);

  const updateAverageTimingDifference = () => {
    if (recentTimingDifferences.current.length > 0) {
      const sum = recentTimingDifferences.current.reduce(
        (acc, val) => acc + val,
        0
      );
      const avg = sum / recentTimingDifferences.current.length;
      setAverageTimingDifference(avg);
    }
  };

  // Update the scheduleNote function to log when a beat occurs
  const scheduleNote = (time: number, frequency: number = 440): void => {
    if (!audioContext.current) return;
    const osc = audioContext.current.createOscillator();
    osc.frequency.value = frequency;
    osc.connect(audioContext.current.destination);
    osc.start(time);
    osc.stop(time + 0.1);
    lastBeatTime.current = time;
    console.log("Beat scheduled at:", time);
  };

  const nextNote = (): void => {
    const secondsPerBeat = 60.0 / bpm;
    nextNoteTime.current += getIntervalForMode(rhythmMode) * secondsPerBeat;
  };

  const getIntervalForMode = (mode: RhythmMode): number => {
    switch (mode) {
      case "quarter":
        return 1;
      case "triplet":
        return 1 / 3;
      case "sixteenth":
        return 1 / 4;
    }
  };

  const scheduler = (): void => {
    if (!audioContext.current) return;
    while (nextNoteTime.current < audioContext.current.currentTime + 0.1) {
      if (countInBeats.current < 2) {
        scheduleNote(nextNoteTime.current, 330);
        setCountIn(String(3 - countInBeats.current));
        setIsCountInActive(true);
        countInBeats.current++;
      } else if (countInBeats.current === 2) {
        scheduleNote(nextNoteTime.current, 440);
        setCountIn("Start");
        setIsCountInActive(true);
        countInBeats.current++;
        isTimingStarted.current = true;
      } else {
        scheduleNote(nextNoteTime.current);
        setCountIn("");
        setIsCountInActive(false);
      }
      nextNote();
    }
    timerID.current = window.setTimeout(scheduler, 25);
  };

  const startStop = (): void => {
    if (isPlaying) {
      stopExercise();
    } else {
      setUserInput("");
      setKeyPresses([]);
      setReport("");
      setTimingTolerance(INITIAL_TIMING_TOLERANCE);
      setRecentAccuracy([]);
      setCurrentWordIndex(0);
      setCurrentPage(0);
      countInBeats.current = 0;
      isTimingStarted.current = false;
      nextNoteTime.current = audioContext.current?.currentTime || 0;
      scheduler();
      setIsPlaying(true);
    }
  };

  const stopExercise = (): void => {
    if (timerID.current) {
      window.clearTimeout(timerID.current);
    }
    if (bpmIncreaseTimerRef.current) {
      clearInterval(bpmIncreaseTimerRef.current);
    }
    setIsPlaying(false);
    setCountIn("");
    setIsCountInActive(false);
    isTimingStarted.current = false;
    generateReport();
  };

  const updateTimingTolerance = (currentTime: number) => {
    const twoSecondsAgo = currentTime - 2000;
    const twentySecondsAgo = currentTime - 20000;

    const updatedRecentAccuracy = recentAccuracy.filter(
      (entry) => entry[0] > twentySecondsAgo
    );

    const recentEntries = updatedRecentAccuracy.filter(
      (entry) => entry[0] > twoSecondsAgo
    );
    const averageAccuracy =
      recentEntries.reduce((sum, entry) => sum + entry[1], 0) /
      recentEntries.length;

    if (recentEntries.length > 0) {
      const beatInterval = (60 / bpm) * getIntervalForMode(rhythmMode);
      if (averageAccuracy >= 0.9) {
        const newTolerance = Math.max(
          timingTolerance - 0.01 * beatInterval,
          0.01
        );
        setTimingTolerance(newTolerance);
        setToleranceMessage("Great job! Your timing tolerance has decreased.");
      } else if (averageAccuracy < 0.8) {
        setTimingTolerance(INITIAL_TIMING_TOLERANCE);
        setToleranceMessage(
          "Keep practicing! Your timing tolerance has been reset."
        );
      }
    }

    setRecentAccuracy(updatedRecentAccuracy);
    setLastAccuracyCheckTime(currentTime);

    // Clear any existing timeout
    if (toleranceMessageTimeoutRef.current !== null) {
      clearTimeout(toleranceMessageTimeoutRef.current);
    }

    if (toleranceMessage) {
      setIsAlertVisible(true);
      // Clear any existing timeout
      if (toleranceMessageTimeoutRef.current !== null) {
        clearTimeout(toleranceMessageTimeoutRef.current);
      }

      // Set a new timeout to clear the message after 3 seconds
      toleranceMessageTimeoutRef.current = window.setTimeout(() => {
        setIsAlertVisible(false);
        toleranceMessageTimeoutRef.current = null;
      }, 3000);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const input = e.target.value;
    setUserInput(input);

    if (!isTimingStarted.current || !audioContext.current) {
      console.log("Timing not started or audio context not available");
      return;
    }

    const words = text.split(" ");
    const typedWords = input.split(" ");
    const newWordIndex = typedWords.length - 1;

    const isLastCharCorrect =
      input[input.length - 1] === text[input.length - 1];

    setCurrentWordIndex(newWordIndex);
    const newPage = Math.floor(newWordIndex / wordsPerPage);
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
    }

    const currentTime = audioContext.current.currentTime;
    const timeSinceLastBeat = currentTime - lastBeatTime.current;
    const beatInterval = (60 / bpm) * getIntervalForMode(rhythmMode);
    const timingDifference = timeSinceLastBeat % beatInterval;
    const adjustedTimingDifference =
      timingDifference > beatInterval / 2
        ? timingDifference - beatInterval
        : timingDifference;

    const isOnBeat =
      Math.abs(adjustedTimingDifference) <= beatInterval * timingTolerance;

    recentTimingDifferences.current.push(Math.abs(adjustedTimingDifference));
    if (recentTimingDifferences.current.length > AVERAGE_TIMING_WINDOW) {
      recentTimingDifferences.current.shift();
    }

    console.log("Debug Info:", {
      currentTime,
      lastBeatTime: lastBeatTime.current,
      timeSinceLastBeat,
      beatInterval,
      timingDifference,
      adjustedTimingDifference,
      isOnBeat,
      timingTolerance,
      toleranceWindow: beatInterval * timingTolerance,
    });

    const newKeyPress: KeyPress = {
      timestamp: Date.now(),
      key: input[input.length - 1],
      isCorrect: isLastCharCorrect,
      isOnBeat,
      timingDifference: adjustedTimingDifference,
    };

    setKeyPresses((prevPresses) => [...prevPresses, newKeyPress]);
    setRecentAccuracy((prev) => [...prev, [Date.now(), isOnBeat ? 1 : 0]]);

    if (Date.now() - lastAccuracyCheckTime > 500) {
      updateTimingTolerance(Date.now());
    }

    console.log("Feedback Conditions:", {
      isLastCharCorrect,
      isOnBeat,
    });

    // Clear any existing timeout
    if (feedbackTimeoutRef.current !== null) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    // Set the new feedback color
    if (isOnBeat) {
      setFeedbackColor(isLastCharCorrect ? "green" : "yellow");
    } else {
      setFeedbackColor("red");
    }

    // Schedule the color to be reset after a brief period
    feedbackTimeoutRef.current = window.setTimeout(() => {
      setFeedbackColor("transparent");
      feedbackTimeoutRef.current = null;
    }, 100); // Adjust this value to control how long the color stays visible

    console.log("Set Feedback Color:", feedbackColor);

    if (input === text) {
      stopExercise();
    }
  };

  const renderText = () => {
    if (pages.length === 0) return null;

    return pages[currentPage].map((word, index) => {
      const globalWordIndex = currentPage * wordsPerPage + index;
      const isTyped = globalWordIndex < currentWordIndex;
      const isActive = globalWordIndex === currentWordIndex;
      return (
        <React.Fragment key={globalWordIndex}>
          <Word isActive={isActive} isTyped={isTyped}>
            {word}
          </Word>
          {index < pages[currentPage].length - 1 && " "}
        </React.Fragment>
      );
    });
  };

  const generateReport = (): void => {
    if (keyPresses.length === 0) return;

    const totalTime =
      (keyPresses[keyPresses.length - 1].timestamp - keyPresses[0].timestamp) /
      1000;
    const wpm = Math.round(text.length / 5 / (totalTime / 60));
    const accuracyPercentage =
      (keyPresses.filter((kp) => kp.isCorrect).length / keyPresses.length) *
      100;
    const rhythmAccuracyPercentage =
      (keyPresses.filter((kp) => kp.isOnBeat).length / keyPresses.length) * 100;

    const beatInterval = (60 / bpm) * getIntervalForMode(rhythmMode);
    const toleranceMs = beatInterval * timingTolerance * 1000;

    const sortedKeyPresses = [...keyPresses].sort(
      (a, b) => Math.abs(a.timingDifference) - Math.abs(b.timingDifference)
    );
    const bestTimed = sortedKeyPresses[0];
    const worstTimed = sortedKeyPresses[sortedKeyPresses.length - 1];

    const avgTimingDifference =
      keyPresses.reduce((sum, kp) => sum + kp.timingDifference, 0) /
      keyPresses.length;

    const tolerancePercentage =
      (timingTolerance / INITIAL_TIMING_TOLERANCE) * 100;

    setReport(
      `Words per minute: ${wpm}\n` +
        `Accuracy: ${accuracyPercentage.toFixed(2)}%\n` +
        `Rhythm accuracy: ${rhythmAccuracyPercentage.toFixed(2)}%\n\n` +
        `Current timing tolerance: ${tolerancePercentage.toFixed(
          2
        )}% of original\n` +
        `Timing tolerance: ±${toleranceMs.toFixed(2)}ms\n` +
        `Average timing: ${(avgTimingDifference * 1000).toFixed(2)}ms ` +
        `(${avgTimingDifference > 0 ? "behind" : "ahead"} the beat)\n\n` +
        `Best timed keystroke: '${bestTimed.key}' ` +
        `(${(bestTimed.timingDifference * 1000).toFixed(2)}ms ${
          bestTimed.timingDifference > 0 ? "late" : "early"
        })\n` +
        `Worst timed keystroke: '${worstTimed.key}' ` +
        `(${(worstTimed.timingDifference * 1000).toFixed(2)}ms ${
          worstTimed.timingDifference > 0 ? "late" : "early"
        })`
    );
  };

  return (
    <Container>
      <AlertWrapper visible={isAlertVisible}>
        <StyledAlert>{toleranceMessage}</StyledAlert>
      </AlertWrapper>
      <Card>
        <CardHeader>
          <CardTitle>Rhythm Typing Trainer</CardTitle>
        </CardHeader>
        <CardContent>
          <ControlsContainer>
            <Input
              type="number"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              placeholder="BPM"
              style={{ width: "80px" }}
            />
            <Input
              type="number"
              value={bpmIncreaseInterval}
              onChange={(e) => setBpmIncreaseInterval(Number(e.target.value))}
              placeholder="BPM Increase Interval (seconds)"
              style={{ width: "160px" }}
            />
            <Select
              value={rhythmMode}
              onChange={(e) => setRhythmMode(e.target.value as RhythmMode)}
            >
              <option value="quarter">Quarter Notes</option>
              <option value="triplet">Triplets</option>
              <option value="sixteenth">Sixteenth Notes</option>
            </Select>
            <Select
              value={selectedTextId}
              onChange={(e) => setSelectedTextId(e.target.value)}
            >
              {textOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.text.substring(0, 20)}...
                </option>
              ))}
            </Select>
            <Button onClick={startStop}>{isPlaying ? "Stop" : "Start"}</Button>
          </ControlsContainer>
          <ToleranceDisplay>
            Current Timing Tolerance: {(timingTolerance * 100).toFixed(2)}% of
            initial
          </ToleranceDisplay>
          <AverageTimingDisplay>
            Average Timing Difference:{" "}
            {(averageTimingDifference * 1000).toFixed(2)}ms
          </AverageTimingDisplay>
          <TextDisplay ref={textDisplayRef}>{renderText()}</TextDisplay>
          <PageIndicator>
            Page {currentPage + 1} of {pages.length}
          </PageIndicator>
          <CountInDisplay active={isCountInActive}>{countIn}</CountInDisplay>
          <TypingInput
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            placeholder="Start typing here..."
            onBlur={() => inputRef.current?.focus()}
            feedbackColor={feedbackColor}
            style={{ transition: "background-color 0.1s" }}
          />
          {report && (
            <ReportCard>
              <CardHeader>
                <CardTitle>Typing Report</CardTitle>
              </CardHeader>
              <CardContent>{report}</CardContent>
            </ReportCard>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default RhythmTypingTrainer;
