import fg from "fast-glob";
import Parser, { SyntaxNode } from 'tree-sitter';
const JavaScript = require('tree-sitter-javascript');
import fs from 'fs'

const parser = new Parser();
parser.setLanguage(JavaScript);

const SEMANTIC_NODE_TYPES = new Set([
  'import_statement',
  'export_statement',
]);

function cstToSemantic(node: SyntaxNode) {
  console.log("Top-level named children:", node.namedChildren.length);

  node.namedChildren.forEach(child => {
    if (SEMANTIC_NODE_TYPES.has(child.type)) {
      console.log(child.type, "->", child.text);
    }
  });
}


export async function generateASTs(baseDir: string) {
  const files = await fg("**/*.{js,ts}", {
    cwd: baseDir,        
    absolute: true,    
    ignore: [
      "**/node_modules/**",
      "**/.git/**",
      "**/dist/**",
      "**/build/**"
    ]
  });


  for (const file of files) {
    console.log("Found file:", file);
    const readedfile = fs.readFileSync(file, "utf8")
    const tree = parser.parse(readedfile)
    const ast = cstToSemantic(tree.rootNode)
  }
}
