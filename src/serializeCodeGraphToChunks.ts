import { Edge, Node } from "./codeGraph"


interface codeGraph {
    graphNodes: Node[]
    graphEdges: Edge[]
}

export function serializeCodeGraphToChunks(graph: codeGraph) {
    const fileNode = graph.graphNodes.filter(n => n.type === "File")
    console.log(fileNode);
    
}