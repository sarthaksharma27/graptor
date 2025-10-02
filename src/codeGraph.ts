import { SemanticNode } from "./generateAst";

interface Node {
    id: string;
    type: "File" | "exported_function" | "external_module" | "variable";
} 

interface Edge {
    from: string;
    to: string;
    type: "exports" | "depends_on" | "requires" | "declares";
}

export async function generateCodegraph(astMaps: Record<string, SemanticNode[]>) {
    const graphNodes: Node[] = [];
    const graphEdges: Edge[] = [];
    for (const filePath in astMaps) {
        const nodes = astMaps[filePath];
        graphNodes.push({id: filePath, type: "File"})
        for(const node of nodes) {
            if(node.type === "import_statement") {
                const name = node.text;
                graphNodes.push({id: name, type: "external_module"});
                graphEdges.push({from: filePath, to: name, type: "depends_on"});
            } else if (node.type === "export_statement") {
                const name = node.text;
                graphNodes.push({id: name, type: "exported_function"});
                graphEdges.push({from: filePath, to: name, type: "exports"});
            } else if (node.type === "require_call") {
                const name = node.text;
                graphNodes.push({id: name, type: "external_module"});
                graphEdges.push({from: filePath, to: name, type: "requires"});
            } else if (node.type === "let declaration" || node.type === "const declaration" || node.type === "var declaration") {
                const name = node.text;
                graphNodes.push({id: name, type: "variable"});
                graphEdges.push({from: filePath, to: name, type: "declares"});
                
            }
            
        }
    } 
    
    return {graphNodes, graphEdges}
}

