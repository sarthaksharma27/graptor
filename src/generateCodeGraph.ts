import fs from 'fs';
import path from 'path';

type GraphNode = {
  id: string;
  type: 'file' | 'function' | 'class';
};

type GraphEdge = {
  from: string;
  to: string;
  relation: 'defines' | 'calls' | 'imports';
};

type SemanticAST = Record<string, any[]>;

export function generateCodeGraph(astPath: string = '.graptor/graptor.ast.json') {
  const astRaw = fs.readFileSync(astPath, 'utf-8');
  const astMap: SemanticAST = JSON.parse(astRaw);

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  const funcToFile: Record<string, string> = {};
  const fileToImports: Record<string, string[]> = {};

  for (const [file, nodesInFile] of Object.entries(astMap)) {
    nodes.push({ id: file, type: 'file' });

    for (const node of nodesInFile) {
      if (node.type === 'FunctionDeclaration' || node.type === 'VariableFunction') {
        const fnId = `${file}::${node.name}`;
        nodes.push({ id: fnId, type: 'function' });
        edges.push({ from: file, to: fnId, relation: 'defines' });
        funcToFile[node.name] = file;
      }

      if (node.type === 'ClassDeclaration') {
        const classId = `${file}::${node.name}`;
        nodes.push({ id: classId, type: 'class' });
        edges.push({ from: file, to: classId, relation: 'defines' });
      }

      if (node.type === 'ImportDeclaration') {
        const imported = node.source;
        fileToImports[file] = fileToImports[file] || [];
        fileToImports[file].push(imported);
      }
    }
  }

  // Add call edges
  for (const [file, nodesInFile] of Object.entries(astMap)) {
    for (const node of nodesInFile) {
      if (node.type === 'CallExpression') {
        const callee = node.callee;
        const targetFile = funcToFile[callee];
        if (targetFile) {
          edges.push({
            from: file,
            to: `${targetFile}::${callee}`,
            relation: 'calls',
          });
        }
      }
    }

    if (fileToImports[file]) {
      for (const imported of fileToImports[file]) {
        let resolved = imported;
        if (!resolved.endsWith('.ts') && !resolved.endsWith('.js')) {
          resolved += '.ts';
        }

        const importPath = path.join(path.dirname(file), resolved);
        if (astMap[importPath]) {
          edges.push({
            from: file,
            to: importPath,
            relation: 'imports',
          });
        }
      }
    }
  }

  if (!fs.existsSync('.graptor')) fs.mkdirSync('.graptor');

  fs.writeFileSync('.graptor/graptor.graph.json', JSON.stringify({ nodes, edges }, null, 2));
  console.log('🎉 Code graph written to .graptor/graptor.graph.json');
}
