import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { SemanticNode } from './types';

export function extractSemantics(ast: t.File): SemanticNode[] {
  const semanticNodes: SemanticNode[] = [];

  traverse(ast, {
    // Static import
    ImportDeclaration(path) {
      semanticNodes.push({
        type: 'ImportDeclaration',
        source: path.node.source.value,
        specifiers: path.node.specifiers.map(s => ({
          local: s.local.name,
          imported:
            'imported' in s && t.isIdentifier(s.imported)
              ? s.imported.name
              : 'default',
        })),
      });
    },

    // Dynamic import (import())
    CallExpression(path) {
      if (
        t.isImport(path.node.callee) &&
        t.isStringLiteral(path.node.arguments[0])
      ) {
        semanticNodes.push({
          type: 'DynamicImport',
          source: path.node.arguments[0].value,
        });
        return;
      }

      let calleeName = 'unknown';
      if (t.isIdentifier(path.node.callee)) {
        calleeName = path.node.callee.name;
      } else if (t.isMemberExpression(path.node.callee)) {
        const object = path.node.callee.object;
        const property = path.node.callee.property;
        calleeName = `${getNodeName(object)}.${getNodeName(property)}`;
      }

      semanticNodes.push({
        type: 'CallExpression',
        callee: calleeName,
      });
    },

    ExportNamedDeclaration(path) {
      semanticNodes.push({
        type: 'ExportNamedDeclaration',
        name: path.node.declaration
          ? getNameFromDeclaration(path.node.declaration)
          : null,
      });
    },

    FunctionDeclaration(path) {
      semanticNodes.push({
        type: 'FunctionDeclaration',
        name: path.node.id?.name || 'anonymous',
        params: path.node.params.map(param =>
          t.isIdentifier(param) ? param.name : 'unknown'
        ),
      });
    },

    VariableDeclarator(path) {
      if (
        t.isFunctionExpression(path.node.init) ||
        t.isArrowFunctionExpression(path.node.init)
      ) {
        semanticNodes.push({
          type: 'VariableFunction',
          name: (path.node.id as t.Identifier).name,
          params: path.node.init.params.map(param =>
            t.isIdentifier(param) ? param.name : 'unknown'
          ),
        });
      }
    },

    ClassDeclaration(path) {
      const className = path.node.id?.name || 'anonymous';
      const methods: string[] = [];

      path.traverse({
        ClassMethod(methodPath) {
          if (t.isIdentifier(methodPath.node.key)) {
            methods.push(methodPath.node.key.name);
          }
        },
      });

      semanticNodes.push({
        type: 'ClassDeclaration',
        name: className,
        methods,
      });
    },

    // React JSX usage
    JSXElement(path) {
      if (t.isJSXIdentifier(path.node.openingElement.name)) {
        semanticNodes.push({
          type: 'JSXElement',
          name: path.node.openingElement.name.name,
        });
      }
    },

    // TypeScript: Interface declarations
    TSInterfaceDeclaration(path) {
      semanticNodes.push({
        type: 'InterfaceDeclaration',
        name: path.node.id.name,
      });
    },

    // TypeScript: Type aliases
    TSTypeAliasDeclaration(path) {
      semanticNodes.push({
        type: 'TypeAlias',
        name: path.node.id.name,
      });
    },
  });

  return semanticNodes;
}

function getNameFromDeclaration(decl: t.Declaration): string | null {
  if ('id' in decl && decl.id && t.isIdentifier(decl.id)) {
    return decl.id.name;
  }
  return null;
}

function getNodeName(node: t.Node): string {
  if (t.isIdentifier(node)) return node.name;
  if (t.isLiteral(node) && 'value' in node) return String((node as any).value);
  return 'unknown';
}
