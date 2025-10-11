import { loadConfig } from "./config";
import { TextChunk } from "./serializeCodeGraphToChunks";
import { pipeline } from '@xenova/transformers';

// let config = loadConfig();
// if (!config) {
//     console.log("No config file found!");
    
// }

export async function generateVectorEmbeddings(chunks: TextChunk[]) {
    // console.log('Chunks:', chunks.length);
    console.log('Files count:', chunks.length);
    const embedder = await pipeline('feature-extraction', 'Xenova/bge-small-en-v1.5');

    const embeddings = await Promise.all(
        chunks.map(async (chunk) => {
            const result = await embedder(chunk.text, { pooling: 'mean', normalize: true });
            const embedding = result.data;
            // console.log('Embedding length:', embedding.length);
            return embedding;
        })
    );

    return embeddings;
}



