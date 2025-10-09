import { loadConfig } from "./config";
import { TextChunk } from "./serializeCodeGraphToChunks";
import { pipeline } from '@xenova/transformers';

// let config = loadConfig();
// if (!config) {
//     console.log("No config file found!");
    
// }

export async function generateVectorEmbeddings(chunks: TextChunk[]) {
    console.log('Chunks:', chunks.length);
    const embedder = await pipeline('feature-extraction', 'Xenova/bge-small-en-v1.5');
    chunks.forEach(async chunk => {
        const text = chunk.text;
        const result = await embedder(text, { pooling: 'mean', normalize: true });

        const embedding = result.data; 
        console.log('Embedding length:', embedding.length);
        console.log('First 5 values:', Array.from(embedding.slice(0, 5)));
    });

}


