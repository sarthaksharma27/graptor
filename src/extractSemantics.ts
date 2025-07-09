import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { SemanticNode } from './types';

export function extractSemantics(ast: t.File): SemanticNode[] {
  const semanticNodes: SemanticNode[] = [];

  traverse(ast, {
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
        });
      }
    },

    ClassDeclaration(path) {
      semanticNodes.push({
        type: 'ClassDeclaration',
        name: path.node.id?.name || 'anonymous',
      });
    },

    CallExpression(path) {
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
  if (t.isLiteral(node) && 'value' in node) return String((node as any).value); // quick fix
  return 'unknown';
}
