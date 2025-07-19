// src/types.ts

export type SemanticNode =
  | {
      type: 'FunctionDeclaration';
      name: string;
      params?: string[];
    }
  | {
      type: 'VariableFunction';
      name: string;
      params?: string[];
    }
  | {
      type: 'ClassDeclaration';
      name: string;
      methods?: string[];
    }
  | {
      type: 'CallExpression';
      callee: string;
    }
  | {
      type: 'ImportDeclaration';
      source: string;
      specifiers: { local: string; imported: string }[];
    }
  | {
    type: 'CommonJSImport';
    source: string;
    specifiers: { local: string; imported: string }[];
    }
  | {
      type: 'DynamicImport';
      source: string;
    }
  | {
      type: 'ExportNamedDeclaration';
      name: string | null;
    }
  | {
      type: 'JSXElement';
      name: string;
    }
  | {
      type: 'InterfaceDeclaration';
      name: string;
    }
  | {
      type: 'TypeAlias';
      name: string;
    };
