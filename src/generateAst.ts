import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';
import fg from 'fast-glob';

export function generateASTs(baseDir: string): void {
  const files = fg.sync(['**/*.ts', '**/*.js'], {
    cwd: baseDir,
    ignore: ['node_modules'],
    absolute: true,
  });

  const result: Record<string, any> = {};

  for (const file of files) {
    try {
      const code = fs.readFileSync(file, 'utf-8');
      const ast = parse(code, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx'],
      });

      const relativePath = path.relative(baseDir, file);
      result[relativePath] = ast;
      console.log(`✅ Parsed: ${relativePath}`);
    } catch (error) {
      console.warn(`❌ Failed to parse ${file}: ${(error as Error).message}`);
    }
  }

  fs.writeFileSync('graptor.ast.json', JSON.stringify(result, null, 2));
  console.log('\n🎉 ASTs written to graptor.ast.json');
}
