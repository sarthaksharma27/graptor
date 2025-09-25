import fg from "fast-glob";
import Parser, { SyntaxNode } from 'tree-sitter';
const JavaScript = require('tree-sitter-javascript');
import fs from 'fs'

const parser = new Parser();
parser.setLanguage(JavaScript);

const SEMANTIC_NODE_TYPES = new Set([
  "import_statement",           // ESM imports
  "export_statement",           // ESM exports
  "call_expression",            // catch require() and dynamic import()
]);

interface SemanticNode {
  type: string;      
  text: string;     
}

function isRequireCall(node: SyntaxNode): boolean {
  if (node.type !== "call_expression") return false;
  const functionNode = node.firstChild;
  return functionNode?.type === "identifier" && functionNode.text === "require";
}

function cstToSemantic(node: SyntaxNode): SemanticNode[] {
  const semanticNodes: SemanticNode[] = [];

  function visit(n: SyntaxNode) {
    if (n.type === "import_statement" || n.type === "export_statement") {
      semanticNodes.push({ type: n.type, text: n.text });
    }

    if (isRequireCall(n)) {
      semanticNodes.push({ type: "require_call", text: n.text });
    }

    n.namedChildren.forEach(visit);
  }

  visit(node);
  return semanticNodes;
}


export async function generateASTs(absDir: string) {
  const files = await fg("**/*.{js,ts}", {
    cwd: absDir,        
    absolute: true,    
    ignore: [
      "**/node_modules/**",
      "**/.git/**",
      "**/dist/**",
      "**/build/**"
    ]
  });

  const allASTs: Record<string, SemanticNode[]> = {};

    for (const file of files) {
    const code = fs.readFileSync(file, "utf8");
    const tree = parser.parse(code);
    const ast = cstToSemantic(tree.rootNode);
    allASTs[file] = ast; 
  }

  fs.writeFileSync('ast.json', JSON.stringify(allASTs, null, 2), 'utf8');
  console.log('Ast written successfully!');
}
