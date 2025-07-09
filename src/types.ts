// src/types.ts

export type SemanticNode =
  | { type: 'FunctionDeclaration'; name: string }
  | { type: 'ClassDeclaration'; name: string }
  | { type: 'VariableFunction'; name: string }
  | { type: 'CallExpression'; callee: string }
  | {
      type: 'ImportDeclaration';
      source: string;
      specifiers: { local: string; imported: string }[];
    }
  | { type: 'ExportNamedDeclaration'; name: string | null };
