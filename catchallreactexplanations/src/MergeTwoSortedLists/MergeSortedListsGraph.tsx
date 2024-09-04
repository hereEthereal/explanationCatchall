export {}
// import React, { useState, useEffect, useRef } from 'react';
// import Cytoscape from 'cytoscape';
// import CytoscapeComponent from 'react-cytoscapejs';

// class ListNode {
//   val: number;
//   next: ListNode | null;

//   constructor(val: number = 0, next: ListNode | null = null) {
//     this.val = val;
//     this.next = next;
//   }
// }

// function createLinkedList(arr: number[]): ListNode | null {
//   const dummy = new ListNode();
//   let current = dummy;
//   for (const val of arr) {
//     current.next = new ListNode(val);
//     current = current.next;
//   }
//   return dummy.next;
// }

// function linkedListToArray(head: ListNode | null): number[] {
//   const arr: number[] = [];
//   let current = head;
//   while (current) {
//     arr.push(current.val);
//     current = current.next;
//   }
//   return arr;
// }

// interface CytoscapeElementData {
//   id: string;
//   label?: string;
//   source?: string;
//   target?: string;
// }

// interface CytoscapeElement {
//   data: CytoscapeElementData;
//   position?: { x: number; y: number };
// }

// const MergeSortedListsGraph: React.FC = () => {
//   const [list1, setList1] = useState<number[]>([1, 2, 4]);
//   const [list2, setList2] = useState<number[]>([1, 3, 4]);
//   const [mergedList, setMergedList] = useState<number[]>([]);
//   const [step, setStep] = useState<number>(0);
//   const cyRef = useRef<Cytoscape.Core | null>(null);

//   const [list1Head, setList1Head] = useState<ListNode | null>(null);
//   const [list2Head, setList2Head] = useState<ListNode | null>(null);
//   const [mergedHead, setMergedHead] = useState<ListNode | null>(null);

//   useEffect(() => {
//     setList1Head(createLinkedList(list1));
//     setList2Head(createLinkedList(list2));
//     setMergedHead(null);
//     setStep(0);
//     setMergedList([]);
//   }, [list1, list2]);

//   const mergeLists = (): void => {
//     let p1: ListNode | null = list1Head;
//     let p2: ListNode | null = list2Head;
//     const dummy = new ListNode();
//     let current: ListNode = dummy;

//     if (step === 0) {
//       setMergedHead(dummy);
//     } else {
//       current = mergedHead as ListNode;
//       while (current.next) {
//         current = current.next;
//       }
//     }

//     if (p1 && p2) {
//       if (p1.val <= p2.val) {
//         current.next = new ListNode(p1.val);
//         p1 = p1.next;
//       } else {
//         current.next = new ListNode(p2.val);
//         p2 = p2.next;
//       }
//     } else if (p1) {
//       current.next = new ListNode(p1.val);
//       p1 = p1.next;
//     } else if (p2) {
//       current.next = new ListNode(p2.val);
//       p2 = p2.next;
//     }

//     setList1Head(p1);
//     setList2Head(p2);
//     setMergedList(linkedListToArray(dummy.next));
//   };

//   const handleStep = (): void => {
//     mergeLists();
//     setStep((prevStep) => prevStep + 1);
//   };

//   const generateGraphElements = (): CytoscapeElement[] => {
//     const elements: CytoscapeElement[] = [];
//     const addNodes = (arr: number[], prefix: string, yPosition: number): void => {
//       arr.forEach((val, index) => {
//         elements.push({
//           data: { id: `${prefix}${index}`, label: val.toString() },
//           position: { x: index * 100, y: yPosition }
//         });
//         if (index > 0) {
//           elements.push({
//             data: {
//               id: `${prefix}edge${index}`,
//               source: `${prefix}${index - 1}`,
//               target: `${prefix}${index}`
//             },
//           });
//         }
//       });
//     };

//     addNodes(linkedListToArray(list1Head), 'list1_', 0);
//     addNodes(linkedListToArray(list2Head), 'list2_', 100);
//     addNodes(mergedList, 'merged_', 200);

//     return elements;
//   };

//   const cytoscapeStylesheet: Cytoscape.Stylesheet[] = [
//     {
//       selector: 'node',
//       style: {
//         'background-color': '#666',
//         'label': 'data(label)',
//         'text-valign': 'center',
//         'text-halign': 'center',
//         'width': '40px',
//         'height': '40px',
//         'color': 'white',
//         'font-size': '18px',
//         'border-width': '2px',
//         'border-color': '#000'
//       }
//     },
//     {
//       selector: 'edge',
//       style: {
//         'width': 2,
//         'line-color': '#666',
//         'target-arrow-color': '#666',
//         'target-arrow-shape': 'triangle',
//         'curve-style': 'bezier'
//       }
//     },
//     {
//       selector: 'node[id^="list1_"]',
//       style: {
//         'background-color': '#e74c3c'
//       }
//     },
//     {
//       selector: 'node[id^="list2_"]',
//       style: {
//         'background-color': '#8e44ad'
//       }
//     },
//     {
//       selector: 'node[id^="merged_"]',
//       style: {
//         'background-color': '#2c3e50'
//       }
//     },
//     {
//       selector: 'edge[id^="list1_"]',
//       style: {
//         'line-color': '#e74c3c',
//         'target-arrow-color': '#e74c3c'
//       }
//     },
//     {
//       selector: 'edge[id^="list2_"]',
//       style: {
//         'line-color': '#8e44ad',
//         'target-arrow-color': '#8e44ad'
//       }
//     },
//     {
//       selector: 'edge[id^="merged_"]',
//       style: {
//         'line-color': '#2c3e50',
//         'target-arrow-color': '#2c3e50'
//       }
//     }
//   ];

//   return (
//     <div className="p-4">
//       <div className="mb-4">
//         <label className="mr-2">List 1:</label>
//         <input
//           type="text"
//           value={linkedListToArray(list1Head).join(',')}
//           onChange={(e) => setList1(e.target.value.split(',').map(Number))}
//           className="border p-1 mr-4"
//         />
//         <label className="mr-2">List 2:</label>
//         <input
//           type="text"
//           value={linkedListToArray(list2Head).join(',')}
//           onChange={(e) => setList2(e.target.value.split(',').map(Number))}
//           className="border p-1"
//         />
//       </div>
//       <button onClick={handleStep} className="bg-blue-500 text-white px-4 py-2 rounded">
//         Step
//       </button>
//       <div className="mt-4">
//         <p>Step: {step}</p>
//         <p>Merged List: {mergedList.join(' -> ')}</p>
//       </div>
//       <div style={{ width: '100%', height: '400px' }}>
//         <CytoscapeComponent
//           elements={generateGraphElements()}
//           style={{ width: '100%', height: '100%' }}
//           stylesheet={cytoscapeStylesheet}
//           layout={{ name: 'preset' }}
//           cy={(cy) => {
//             cyRef.current = cy;
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default MergeSortedListsGraph;