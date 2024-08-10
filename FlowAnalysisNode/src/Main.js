import { JSAlgorithmAnalyzer } from './JSAlgorithmAnalyzer.js';

// ... (previous code remains the same)

// Add this at the end of the file
if (import.meta.url === `file://${process.argv[1]}`) {
  const twoSum = `
  function twoSum(numbers, target) {
    for (let i = 0; i < numbers.length; i++) {
      for (let j = i + 1; j < numbers.length; j++) {
        if (numbers[i] + numbers[j] === target) {
          return [i, j];
        }
      }
    }
    return [];
  }
  `;

  const analyzer = new JSAlgorithmAnalyzer(twoSum);
  analyzer.generateCFG();
  analyzer.analyzeDataFlow();
  analyzer.printDataFlow();
  
  console.log("Control Flow Graph:");
  console.log(JSON.stringify([...analyzer.cfg], null, 2));
}