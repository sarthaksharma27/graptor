import fs from 'fs';
import path from 'path';

type GraphNode = {
  id: string;
  type: 'file' | 'function' | 'class' | 'jsx' | 'interface' | 'type';
};

type GraphEdge = {
  from: string;
  to: string;
  relation: 'defines' | 'calls' | 'imports' | 'uses-jsx';
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
      switch (node.type) {
        case 'FunctionDeclaration':
        case 'VariableFunction': {
          const fnId = `${file}::${node.name}`;
          nodes.push({ id: fnId, type: 'function' });
          edges.push({ from: file, to: fnId, relation: 'defines' });
          funcToFile[node.name] = file;
          break;
        }

        case 'ClassDeclaration': {
          const classId = `${file}::${node.name}`;
          nodes.push({ id: classId, type: 'class' });
          edges.push({ from: file, to: classId, relation: 'defines' });
          break;
        }

        case 'JSXElement': {
          const jsxId = `${file}::jsx::${node.name}`;
          nodes.push({ id: jsxId, type: 'jsx' });
          edges.push({ from: file, to: jsxId, relation: 'uses-jsx' });
          break;
        }

        case 'InterfaceDeclaration': {
          const id = `${file}::interface::${node.name}`;
          nodes.push({ id, type: 'interface' });
          edges.push({ from: file, to: id, relation: 'defines' });
          break;
        }

        case 'TypeAlias': {
          const id = `${file}::type::${node.name}`;
          nodes.push({ id, type: 'type' });
          edges.push({ from: file, to: id, relation: 'defines' });
          break;
        }

        case 'ImportDeclaration':
        case 'DynamicImport':
        case 'CommonJSImport': {
          const imported = node.source;
          fileToImports[file] = fileToImports[file] || [];
          fileToImports[file].push(imported);
          break;
        }
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

    // Add import edges
    const imports = fileToImports[file] || [];
    for (const imported of imports) {
      let resolvedPath: string;

      if (imported.startsWith('.') || imported.startsWith('/')) {
        resolvedPath = path.join(path.dirname(file), imported);

        if (!resolvedPath.endsWith('.ts') && !resolvedPath.endsWith('.js')) {
          if (astMap[`${resolvedPath}.ts`]) resolvedPath += '.ts';
          else if (astMap[`${resolvedPath}.js`]) resolvedPath += '.js';
          else resolvedPath += '.ts';
        }
      } else {
        resolvedPath = imported;
      }

      if (!nodes.find(n => n.id === resolvedPath)) {
        nodes.push({ id: resolvedPath, type: 'file' });
      }

      edges.push({
        from: file,
        to: resolvedPath,
        relation: 'imports',
      });
    }
  }

  if (!fs.existsSync('.graptor')) fs.mkdirSync('.graptor');

  fs.writeFileSync('.graptor/graptor.graph.json', JSON.stringify({ nodes, edges }, null, 2));
  console.log('🎉 Code graph written to .graptor/graptor.graph.json');
}
