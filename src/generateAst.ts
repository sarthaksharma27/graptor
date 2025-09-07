export function generateASTs(baseDir: string) {
  console.log(baseDir);
}




// import fs from 'fs';
// import path from 'path';
// import { parse } from '@babel/parser';
// import fg from 'fast-glob';
// import defaultIgnorePatterns from './defaultIgnore';
// import { extractSemantics } from './extractSemantics';

// export function generateASTs(baseDir: string): void {
//   const files = fg.sync(['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'], {
//     cwd: baseDir,
//     ignore: defaultIgnorePatterns,
//     absolute: true,
//   });

//   const result: Record<string, any[]> = {};

//   for (const file of files) {
//     try {
//       const code = fs.readFileSync(file, 'utf-8');
//       const ast = parse(code, {
//         sourceType: 'unambiguous',
//         plugins: ['typescript', 'jsx'],
//       });

//       const semantic = extractSemantics(ast);
//       const relativePath = path.relative(baseDir, file);
//       result[relativePath] = semantic;

//       console.log(`Parsed: ${relativePath}`);
//     } catch (error) {
//       console.warn(`Failed to parse ${file}: ${(error as Error).message}`);
//     }
//   }

//   const outputDir = '.graptor';
//   if (!fs.existsSync(outputDir)) {
//     fs.mkdirSync(outputDir);
//   }

//   fs.writeFileSync(path.join(outputDir, 'graptor.ast.json'), JSON.stringify(result, null, 2));
//   console.log('\n🎉 Semantic ASTs written to .graptor/graptor.ast.json');
// }
