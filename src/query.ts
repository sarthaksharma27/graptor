// src/query.ts

import fs from 'fs';

type GraphNode = {
  id: string;
  type: 'file' | 'function' | 'class';
};

type GraphEdge = {
  from: string;
  to: string;
  relation: 'defines' | 'calls' | 'imports';
};

type Graph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

function loadGraph(): Graph {
  const graphRaw = fs.readFileSync('.graptor/graptor.graph.json', 'utf8');
  return JSON.parse(graphRaw);
}

export function queryCalls(fnName: string) {
  const graph = loadGraph();
  const results = graph.edges.filter(
    e => e.relation === 'calls' && e.to.endsWith(`::${fnName}`)
  );
  results.forEach(e => console.log(`${e.from} → ${e.to}`));
}

export function queryDefinedIn(symbol: string) {
  const graph = loadGraph();
  const matches = graph.nodes.filter(n => n.id.endsWith(`::${symbol}`));
  matches.forEach(n => console.log(`${symbol} is defined in: ${n.id.split('::')[0]}`));
}

export function queryImports(file: string) {
  const graph = loadGraph();
  const edges = graph.edges.filter(e => e.relation === 'imports' && e.from === file);
  edges.forEach(e => console.log(`${file} imports ${e.to}`));
}

export function queryImportedBy(file: string) {
  const graph = loadGraph();
  const edges = graph.edges.filter(e => e.relation === 'imports' && e.to === file);
  edges.forEach(e => console.log(`${file} is imported by ${e.from}`));
}

export function queryUnused() {
  const graph = loadGraph();

  const defined = new Set(
    graph.nodes.filter(n => n.type === 'function' || n.type === 'class').map(n => n.id)
  );
  const used = new Set(graph.edges.filter(e => e.relation === 'calls').map(e => e.to));
  const unused = [...defined].filter(d => !used.has(d));

  unused.forEach(d => console.log(`❌ Unused: ${d}`));
}

export function queryStats() {
  const graph = loadGraph();

  const stats = {
    files: 0,
    functions: 0,
    classes: 0,
  };

  for (const node of graph.nodes) {
    if (node.type === 'file') stats.files++;
    if (node.type === 'function') stats.functions++;
    if (node.type === 'class') stats.classes++;
  }

  console.log('📊 Codebase Stats:');
  console.log(`Files: ${stats.files}`);
  console.log(`Functions: ${stats.functions}`);
  console.log(`Classes: ${stats.classes}`);
}
