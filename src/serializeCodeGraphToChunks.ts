import { Edge, Node } from "./codeGraph"


interface codeGraph {
    graphNodes: Node[]
    graphEdges: Edge[]
}

export function serializeCodeGraphToChunks(graph: codeGraph) {
    const fileNodes = graph.graphNodes.filter(n => n.type === "File")
    
    for(const file of fileNodes) {
        const fileEdges = graph.graphEdges.filter(e => e.from === file.id )
        console.log(fileEdges);
        
    }
    
}