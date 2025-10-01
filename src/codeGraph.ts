import { SemanticNode } from "./generateAst";

interface Node {
    id: string;
    type: "File" | "exported_function" | "external_module";
} 

interface Edge {
    from: string;
    to: string;
    type: "exports" | "depends_on" | "requires";
}

const graphNodes: Node[] = []
const graphEdges: Edge[] = []

export async function generateCodegraph(astMaps: Record<string, SemanticNode[]>) {
    for (const filePath in astMaps) {
        const nodes = astMaps[filePath];
        console.log(filePath, nodes);
    }
    
}

