import { loadConfig } from "./config";
import { TextChunk } from "./serializeCodeGraphToChunks";

let config = loadConfig();
if (!config) {
    console.log("No config file found!");
    
}

export async function generateVectorEmbeddings(chunks: TextChunk[]) {
    console.log('Chunks:', chunks.length);
    console.log( "provider:", config?.provider, "model:", config?.model, "apiKey:", config?.apiKey);
}