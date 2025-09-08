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

interface SemanticNode {
  type: string;      
  text: string;     
}

function cstToSemantic(node: SyntaxNode) {
  console.log("Top-level named children:", node.namedChildren.length);
  const SemanticNode: SemanticNode[] = []

  node.namedChildren.forEach(child => {
    if (SEMANTIC_NODE_TYPES.has(child.type)) { 
       SemanticNode.push({
          type: child.type,
          text: child.text
       })
        
    }
  });

  return SemanticNode;
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
    console.log(ast);
    
    fs.writeFileSync('graptor.ast', JSON.stringify(ast, null, 2), 'utf8');
    console.log('Ast written successfully!');
  }
}
