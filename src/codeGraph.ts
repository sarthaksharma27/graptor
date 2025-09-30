import { SemanticNode } from "./generateAst";

interface node {
    id: string;
    type: "File" | "exported_function" | "external_module";
    
}

type EdgeType = "exports" | "depends_on" | "requires";

interface edge {
    from: string;
    to: string;
    edgeType: EdgeType 
}

export async function generateCodegraph(astMap: Record<string, SemanticNode[]>) {
    console.log(astMap)
}

