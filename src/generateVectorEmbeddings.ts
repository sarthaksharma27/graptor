import { TextChunk } from "./serializeCodeGraphToChunks";

export async function generateVectorEmbeddings(chunks: TextChunk[], options: { provider: string, model: string, apiKey: string } ) {
    const { provider, model, apiKey } = options
    console.log('Chunks:', chunks.length);
    console.log('Provider:', provider, 'Model:', model, 'API Key:', apiKey);
    
    
}