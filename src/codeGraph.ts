import { SemanticNode } from "./generateAst";

interface Node {
    id: string;
    type: "File" | "exported_function" | "external_module";
    
}

type Edge = "exports" | "depends_on" | "requires";

interface edge {
    from: string;
    to: string;
    type: Edge 
}

const graphNodes: Node[] = []
const graphEdges: Edge[] = []

export async function generateCodegraph(astMaps: Record<string, SemanticNode[]>) {
    for (const filePath in astMaps) {
        const nodes = astMaps[filePath];
        console.log(filePath, nodes);
    }
    
}

