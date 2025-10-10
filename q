[1mdiff --git a/src/index.ts b/src/index.ts[m
[1mindex 078219a..82159e6 100644[m
[1m--- a/src/index.ts[m
[1m+++ b/src/index.ts[m
[36m@@ -124,7 +124,11 @@[m [mprogram[m
     }[m
     [m
     console.log(`Using ${provider} (${model})`);[m
[31m-    const embeddings = generateVectorEmbeddings(chunks) [m
[32m+[m[32m    console.time('embedding');[m
[32m+[m[32m    const embeddings = generateVectorEmbeddings(chunks)[m
[32m+[m[32m    console.timeEnd('embedding');[m[41m [m
[32m+[m[32m    console.log(process.memoryUsage());[m
[32m+[m
     saveConfig({ provider, model, apiKey })[m
 [m
   });[m
