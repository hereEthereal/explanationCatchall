import { parse, Node } from "acorn";
import * as walk from "acorn-walk";
import cytoscape, { Core } from "cytoscape";
import dagre from "cytoscape-dagre";

// Register the dagre layout
cytoscape.use(dagre);

type CFGNode = {
  id: number;
  type: string;
  label: string;
  node: Node;
  next?: number[];
};

class TSAlgorithmAnalyzer {
  private ast: Node;
  private cfg: Map<number, CFGNode>;
  private dataFlow: Array<[string, string, number]> = [];
  private nodeId: number;
  private sourceCode: string;

  constructor(functionString: string) {
    // Remove TypeScript types from the function string
    this.sourceCode = functionString.replace(/:\s*([^=,)]+)(\s*[=,)])/g, "$2");

    this.ast = parse(this.sourceCode, {
      ecmaVersion: "latest",
      sourceType: "module",
    });
    this.cfg = new Map();
    this.nodeId = 0;
  }

  generateCFG(): void {
    const addNode = (node: Node, type: string, label: string): number => {
      const id = this.nodeId++;
      this.cfg.set(id, { id, type, label, node });
      return id;
    };

    const addEdge = (from: number, to: number): void => {
      const fromNode = this.cfg.get(from);
      if (fromNode) {
        if (!fromNode.next) fromNode.next = [];
        fromNode.next.push(to);
      }
    };

    walk.recursive(this.ast, null, {
      FunctionDeclaration: (node: any, state: any, c: any) => {
        const funcId = addNode(node, "Function", `Function: ${node.id.name}`);
        c(node.body, funcId);
      },
      BlockStatement: (node: any, state: any, c: any) => {
        node.body.forEach((stmt: Node) => c(stmt, state));
      },
      ForStatement: (node: any, state: any, c: any) => {
        const forId = addNode(node, "For", `For: ${this.getSource(node.init)}`);
        if (state) addEdge(state, forId);
        c(node.body, forId);
      },
      IfStatement: (node: any, state: any, c: any) => {
        const ifId = addNode(node, "If", `If: ${this.getSource(node.test)}`);
        if (state) addEdge(state, ifId);
        c(node.consequent, ifId);
        if (node.alternate) c(node.alternate, ifId);
      },
      ReturnStatement: (node: any, state: any) => {
        const returnId = addNode(
          node,
          "Return",
          `Return: ${this.getSource(node.argument)}`
        );
        if (state) addEdge(state, returnId);
      },
    });
  }


  analyzeDataFlow(): void {
    const visitors: walk.RecursiveVisitors<{ loopDepth: number }> = {
      FunctionDeclaration: (node: any, state, c) => {
        console.log("Visiting FunctionDeclaration");
        this.dataFlow.push(["function_name", node.id.name, node.start]);
        this.dataFlow.push(["function_params", node.params.map((param: any) => param.name).join(", "), node.start]);
        c(node.body, state);
      },
      ForStatement: (node: any, state, c) => {
        console.log("Visiting ForStatement");
        state.loopDepth++;
        const forLoop = this.getSource(node.init) + "; " + 
                        this.getSource(node.test) + "; " + 
                        this.getSource(node.update);
        const loopType = state.loopDepth === 1 ? "outer_for_loop" : "inner_for_loop";
        this.dataFlow.push([loopType, forLoop, node.start]);
        
        if (node.update && node.update.type === "UpdateExpression") {
          const updateType = state.loopDepth === 1 ? "i_update" : "j_update";
          this.dataFlow.push([updateType, this.getSource(node.update), node.update.start]);
        }

        c(node.body, state);
        state.loopDepth--;
      },
      IfStatement: (node: any, state, c) => {
        console.log("Visiting IfStatement");
        this.dataFlow.push(["if_comparison", this.getSource(node.test), node.start]);
        c(node.consequent, state);
        if (node.alternate) c(node.alternate, state);
      },
      ReturnStatement: (node: any, state, c) => {
        console.log("Visiting ReturnStatement");
        const returnType = state.loopDepth > 0 ? "inner_return" : "last_return";
        this.dataFlow.push([returnType, this.getSource(node.argument), node.start]);
      },
      BlockStatement: (node: any, state, c) => {
        console.log("Visiting BlockStatement");
        node.body.forEach((stmt: Node) => c(stmt, state));
      }
    };

    console.log("Starting AST traversal");
    walk.recursive(this.ast, { loopDepth: 0 }, visitors);
    console.log("Finished AST traversal");

    this.sortDataFlow();
  }

  private sortDataFlow(): void {
    this.dataFlow.sort((a, b) => a[2] - b[2]);
  }
  private getSource(node: Node | null): string {
    if (!node) return "";
    return this.sourceCode.slice(node.start, node.end);
  }

  generateCytoscapeElements(): cytoscape.ElementDefinition[] {
    const elements: cytoscape.ElementDefinition[] = [];
    this.cfg.forEach((node) => {
      elements.push({ data: { id: node.id.toString(), label: node.label } });
      if (node.next) {
        node.next.forEach((nextId) => {
          elements.push({
            data: { source: node.id.toString(), target: nextId.toString() },
          });
        });
      }
    });
    return elements;
  }

  visualize(container: HTMLElement): Core {
    const elements = this.generateCytoscapeElements();
    return cytoscape({
      container: container,
      elements: elements,
      style: [
        {
          selector: "node",
          style: {
            "background-color": "#666",
            label: "data(label)",
            color: "#fff",
            "text-valign": "center",
            "text-halign": "center",
            "text-wrap": "wrap",
          },
        },
        {
          selector: "edge",
          style: {
            width: 3,
            "line-color": "#ccc",
            "target-arrow-color": "#ccc",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
          },
        },
      ],
      layout: {
        name: "dagre",
      },
    });
  }

  printDataFlow(): void {
    console.log("Data Flow Analysis:");
    this.dataFlow.forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
  }

  getCFG(): Map<number, CFGNode> {
    return this.cfg;
  }
}



export const createAnalyzer = (functionString: string): TSAlgorithmAnalyzer => new TSAlgorithmAnalyzer(functionString);

// For running directly
if (import.meta.url === new URL(import.meta.url).href) {
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

  

  const analyzer = new TSAlgorithmAnalyzer(twoSum);
  analyzer.generateCFG();
  analyzer.analyzeDataFlow();
  analyzer.printDataFlow();
  
  // console.log("Control Flow Graph:");
  // console.log(JSON.stringify([...analyzer.getCFG()], null, 2));
}