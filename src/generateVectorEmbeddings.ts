import { loadConfig } from "./config";
import { TextChunk } from "./serializeCodeGraphToChunks";
import { pipeline } from '@xenova/transformers';

// let config = loadConfig();
// if (!config) {
//     console.log("No config file found!");
    
// }

export async function generateVectorEmbeddings(chunks: TextChunk[]) {
    console.log('Chunks:', chunks.length);
    // console.log( "provider:", config?.provider, "model:", config?.model, "apiKey:", config?.apiKey);
    

        const embedder = await pipeline('feature-extraction', 'Xenova/bge-small-en-v1.5');

        const text = 'Machine learning models extract features automatically.';
        const result = await embedder(text, { pooling: 'mean', normalize: true });

        const embedding = result.data; 
        console.log('Embedding length:', embedding.length);
        console.log('First 5 values:', Array.from(embedding.slice(0, 5)));
}


