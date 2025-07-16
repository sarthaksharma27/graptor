#!/usr/bin/env node

import { program } from 'commander';
import { generateASTs } from './generateAst';
import { generateCodeGraph } from './generateCodeGraph';
import path from 'path';
import fs from 'fs';
import { handleQuery } from './query';

const pkg = require('../package.json');

program
  .name('graptor')
  .description('Graptor is an open-source graph engine that understands your complex codebases.')
  .version(pkg.version);

// AST generation command
program
  .command('ast <directory>')
  .description('Generate AST from a directory of code')
  .action((dir: string) => {
    generateASTs(dir);
  });

// Graph generation command
program
  .command('graph')
  .description('Generate Code Graph from AST')
  .action(() => {
    generateCodeGraph();
  });

// Full pipeline: AST + Graph
program
  .command('run <directory>')
  .description('Generate code graph from source with a single command (recommended)')
  .action((dir: string) => {
    console.log(`Running Graptor on ${dir}`);
    generateASTs(dir);

    const astPath = path.join(process.cwd(), '.graptor', 'graptor.ast.json');
    if (!fs.existsSync(astPath)) {
      console.error('❌ AST generation failed. Graph not generated.');
      process.exit(1);
    }

    generateCodeGraph(astPath);
  });

// Query the graph
program
  .command('query <subcommand> [arg]')
  .description('Query your code graph (calls, defined-in, imports, imported-by, unused, stats)')
  .action((subcommand: string, arg: string | undefined) => {
    handleQuery([subcommand, arg ?? '']);
  });

program.parse();
