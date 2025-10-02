This repo is under maintenance as we are moving from Babel to Tree Sitter

1. SyntaxNode basics

Every node in the CST/AST represents a piece of the code:

n.type → what kind of syntax it is (e.g., call_expression, function_declaration, lexical_declaration).

n.text → the raw text for that node (everything under it).

n.firstChild → the first child node (direct child, including punctuation, keywords, etc).

n.namedChildren → only meaningful “named” nodes, like identifiers, literals, expressions — ignores commas, parentheses, semicolons, etc.

n.namedChildren[0] → the first named child.