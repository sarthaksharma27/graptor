import { Edge, Node } from "./codeGraph"

interface TextChunk {
  id: string;
  text: string;
  metadata: Record<string, any>;
}

interface codeGraph {
    graphNodes: Node[]
    graphEdges: Edge[]
}

export function serializeCodeGraphToChunks(graph: codeGraph) {
    const fileNodes = graph.graphNodes.filter(n => n.type === "File")
    const chunks: TextChunk[] = [];
    
    for(const file of fileNodes) {
        const fileEdges = graph.graphEdges.filter(e => e.from === file.id )
        
        const grouped: Record<string, string[]> = {};
        for (const edge of fileEdges) {
            if (!grouped[edge.type]) grouped[edge.type] = [];
            grouped[edge.type].push(edge.to);
        }

        // console.log(grouped);

            const text = `
            File: ${file.id}

            Dependencies:
            ${(grouped["depends_on"] || []).map(x => `- ${x}`).join("\n") || "None"}

            Declarations:
            ${(grouped["declares"] || []).map(x => `- ${x}`).join("\n") || "None"}

            Functions:
            ${(grouped["function_defines"] || []).map(x => `- ${x}`).join("\n") || "None"}

            Exports:
            ${(grouped["exports"] || []).map(x => `- ${x}`).join("\n") || "None"}

            Function Calls:
            ${(grouped["function_call"] || []).map(x => `- ${x}`).join("\n") || "None"}
            `.trim();

            chunks.push({
                id: `chunk:${file.id}`,
                text,
                metadata: {
                    path: file.id,
                    dependencies: grouped["depends_on"] || [],
                    declarations: grouped["declares"] || [],
                    functions: grouped["function_defines"] || [],
                    exports: grouped["exports"] || [],
                    functionCalls: grouped["function_call"] || [],
                },
            });
    }

    return chunks
    
}