import { SemanticNode } from "./generateAst";

interface node {
    id: string;
    type: "File" | "exported_function" | "external_module";
    
}

type EdgeType = "exports" | "depends_on" | "requires";

interface edge {
    from: string;
    to: string;
    type: EdgeType 
}

export async function generateCodegraph(astMaps: Record<string, SemanticNode[]>) {
    // console.log(astMaps)
    for (const filePath in astMaps) {
        const nodes = astMaps[filePath]; // nodes is SemanticNode[]
        console.log(filePath, nodes);
    }
    
}

