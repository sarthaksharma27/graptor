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

type CodeGraph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

function loadGraph(): CodeGraph {
  const graphPath = path.join(process.cwd(), '.graptor', 'graptor.graph.json');
  if (!fs.existsSync(graphPath)) {
    console.error('❌ Code graph not found. Run `graptor run <directory>` first.');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(graphPath, 'utf-8'));
}

function getAllFunctionNames(graph: CodeGraph): Set<string> {
  return new Set(
    graph.nodes
      .filter(node => node.type === 'function')
      .map(node => node.id.split('::')[1])
  );
}

export function handleQuery(args: string[]) {
  const command = args[0];
  const param = args[1];
  const graph = loadGraph();
  const functionNames = getAllFunctionNames(graph);

  switch (command) {
    case 'calls': {
      if (!param) {
        console.error('❌ Please specify a function name. Example: `graptor query calls add`');
        process.exit(1);
      }

      if (!functionNames.has(param)) {
        console.error(`❌ Function "${param}" not found. Function names are case-sensitive.`);
        process.exit(1);
      }

      const matches = graph.edges.filter(e => e.relation === 'calls' && e.to.endsWith(`::${param}`));
      if (matches.length === 0) {
        console.log(`ℹ️ No calls to "${param}" found.`);
      } else {
        for (const match of matches) {
          console.log(`${match.from} → ${match.to}`);
        }
      }
      break;
    }

    case 'defined-in': {
      if (!param) {
        console.error('❌ Please specify a function name. Example: `graptor query defined-in add`');
        process.exit(1);
      }

      if (!functionNames.has(param)) {
        console.error(`❌ Function "${param}" not found. Function names are case-sensitive.`);
        process.exit(1);
      }

      const def = graph.nodes.find(n => n.type === 'function' && n.id.endsWith(`::${param}`));
      if (def) {
        console.log(`${param} is defined in: ${def.id.split('::')[0]}`);
      }
      break;
    }

    case 'imports': {
      if (!param) {
        console.error('❌ Please specify a file. Example: `graptor query imports file.ts`');
        process.exit(1);
      }

      const imports = graph.edges.filter(e => e.relation === 'imports' && e.from === param);
      if (imports.length === 0) {
        console.log(`ℹ️ No imports found in ${param}`);
      } else {
        for (const imp of imports) {
          console.log(`${param} imports ${imp.to}`);
        }
      }
      break;
    }

    case 'imported-by': {
      if (!param) {
        console.error('❌ Please specify a file. Example: `graptor query imported-by file.ts`');
        process.exit(1);
      }

      const importedBy = graph.edges.filter(e => e.relation === 'imports' && e.to === param);
      if (importedBy.length === 0) {
        console.log(`ℹ️ No files import ${param}`);
      } else {
        for (const imp of importedBy) {
          console.log(`${param} is imported by ${imp.from}`);
        }
      }
      break;
    }

    case 'unused': {
      const definedFunctions = graph.nodes
        .filter(n => n.type === 'function')
        .map(n => n.id);

      const calledFunctions = new Set(
        graph.edges
          .filter(e => e.relation === 'calls')
          .map(e => e.to)
      );

      for (const fn of definedFunctions) {
        if (!calledFunctions.has(fn)) {
          console.log(`❌ Unused: ${fn}`);
        }
      }
      break;
    }

    case 'stats': {
      const fileCount = graph.nodes.filter(n => n.type === 'file').length;
      const functionCount = graph.nodes.filter(n => n.type === 'function').length;
      const classCount = graph.nodes.filter(n => n.type === 'class').length;

      console.log(`📊 Codebase Stats:`);
      console.log(`Files: ${fileCount}`);
      console.log(`Functions: ${functionCount}`);
      console.log(`Classes: ${classCount}`);
      break;
    }

    default:
      console.error(`❌ Unknown query command "${command}". Try: calls | defined-in | imports | imported-by | unused | stats`);
      process.exit(1);
  }
}
