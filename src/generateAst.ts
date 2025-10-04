import fg from "fast-glob";
import Parser, { SyntaxNode } from 'tree-sitter';
const JavaScript = require('tree-sitter-javascript');
import fs from 'fs'
import { generateCodegraph } from "./codeGraph";

const parser = new Parser();
parser.setLanguage(JavaScript);

export interface SemanticNode {
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
  const declaredFunctions = new Set<string>();

  function visit(n: SyntaxNode) {
    if (n.type === "import_statement" || n.type === "export_statement") {
      semanticNodes.push({ type: n.type, text: n.text });
    }

    if (isRequireCall(n)) {
      semanticNodes.push({ type: "require_call", text: n.text });
    }

    if (n.type === "lexical_declaration" || n.type === "variable_declaration") {
      const keyword = n.firstChild?.text;
      if (keyword === "let" || keyword === "const" || keyword === "var") {
        semanticNodes.push({ type: `${keyword} declaration`, text: n.text})
      }
    } 

    if (n.type === "function_declaration") {
      const nameNode = n.namedChildren[0];
      declaredFunctions.add(nameNode.text);
      semanticNodes.push({ type: n.type, text: n.text });
    }

    if (n.type === "call_expression") {
      const funcNode = n.firstChild;
      const funcName = funcNode?.text;
      if (funcName && declaredFunctions.has(funcName)) {
          semanticNodes.push({ type: "function_call", text: funcName });
      }
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

  fs.writeFileSync(`${absDir}/ast.json`, JSON.stringify(allASTs, null, 2), 'utf8');
  console.log('Ast written successfully!');

  const codeGraph = await generateCodegraph(allASTs)
  
  fs.writeFileSync(`${absDir}/codeGraph.json`, JSON.stringify(codeGraph, null, 2), 'utf8');
  console.log('codeGraph written successfully!');
}
