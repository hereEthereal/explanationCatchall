"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnalyzer = exports.TSAlgorithmAnalyzer = void 0;
const acorn_1 = require("acorn");
const walk = __importStar(require("acorn-walk"));
const cytoscape_1 = __importDefault(require("cytoscape"));
const cytoscape_dagre_1 = __importDefault(require("cytoscape-dagre"));
// Register the dagre layout
cytoscape_1.default.use(cytoscape_dagre_1.default);
class TSAlgorithmAnalyzer {
    constructor(functionString) {
        this.ast = (0, acorn_1.parse)(functionString, { ecmaVersion: 2022 });
        this.cfg = new Map();
        this.dataFlow = new Map();
        this.nodeId = 0;
    }
    generateCFG() {
        const addNode = (node, type, label) => {
            const id = this.nodeId++;
            this.cfg.set(id, { id, type, label, node });
            return id;
        };
        const addEdge = (from, to) => {
            const fromNode = this.cfg.get(from);
            if (fromNode) {
                if (!fromNode.next)
                    fromNode.next = [];
                fromNode.next.push(to);
            }
        };
        walk.recursive(this.ast, null, {
            FunctionDeclaration: (node, state, c) => {
                const funcId = addNode(node, 'Function', `Function: ${node.id.name}`);
                c(node.body, funcId);
            },
            BlockStatement: (node, state, c) => {
                node.body.forEach((stmt) => c(stmt, state));
            },
            ForStatement: (node, state, c) => {
                const forId = addNode(node, 'For', `For: ${this.getSource(node.init)}`);
                if (state)
                    addEdge(state, forId);
                c(node.body, forId);
            },
            IfStatement: (node, state, c) => {
                const ifId = addNode(node, 'If', `If: ${this.getSource(node.test)}`);
                if (state)
                    addEdge(state, ifId);
                c(node.consequent, ifId);
                if (node.alternate)
                    c(node.alternate, ifId);
            },
            ReturnStatement: (node, state) => {
                const returnId = addNode(node, 'Return', `Return: ${this.getSource(node.argument)}`);
                if (state)
                    addEdge(state, returnId);
            }
        });
    }
    analyzeDataFlow() {
        walk.simple(this.ast, {
            VariableDeclarator: (node) => {
                this.dataFlow.set(node.id.name, this.getSource(node.init));
            },
            AssignmentExpression: (node) => {
                this.dataFlow.set(this.getSource(node.left), this.getSource(node.right));
            },
            UpdateExpression: (node) => {
                this.dataFlow.set(this.getSource(node.argument), `${this.getSource(node.argument)} ${node.operator}`);
            }
        });
    }
    getSource(node) {
        if (!node)
            return '';
        return this.ast.source.slice(node.start, node.end);
    }
    generateCytoscapeElements() {
        const elements = [];
        this.cfg.forEach((node) => {
            elements.push({ data: { id: node.id.toString(), label: node.label } });
            if (node.next) {
                node.next.forEach(nextId => {
                    elements.push({ data: { source: node.id.toString(), target: nextId.toString() } });
                });
            }
        });
        return elements;
    }
    visualize(container) {
        const elements = this.generateCytoscapeElements();
        return (0, cytoscape_1.default)({
            container: container,
            elements: elements,
            style: [
                {
                    selector: 'node',
                    style: {
                        'background-color': '#666',
                        'label': 'data(label)',
                        'color': '#fff',
                        'text-valign': 'center',
                        'text-halign': 'center',
                        'text-wrap': 'wrap'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 3,
                        'line-color': '#ccc',
                        'target-arrow-color': '#ccc',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier'
                    }
                }
            ],
            layout: {
                name: 'dagre'
            }
        });
    }
    printDataFlow() {
        console.log("Data Flow Analysis:");
        this.dataFlow.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });
    }
    getCFG() {
        return this.cfg;
    }
}
exports.TSAlgorithmAnalyzer = TSAlgorithmAnalyzer;
// Example usage
const twoSum = `
function twoSum(numbers: number[], target: number): number[] {
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
const createAnalyzer = (functionString) => new TSAlgorithmAnalyzer(functionString);
exports.createAnalyzer = createAnalyzer;
// For running directly
if (require.main === module) {
    const analyzer = new TSAlgorithmAnalyzer(twoSum);
    analyzer.generateCFG();
    analyzer.analyzeDataFlow();
    analyzer.printDataFlow();
    console.log("Control Flow Graph:");
    console.log(JSON.stringify([...analyzer.getCFG()], null, 2));
}
