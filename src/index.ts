#!/usr/bin/env node

import { program } from 'commander';
import { generateASTs } from './generateAst';
import { generateCodeGraph } from './generateCodeGraph';

program
  .name('graptor')
  .description('Graptor CLI - Understand your codebase')
  .version('0.1.0');

program
  .command('ast <directory>')
  .description('Generate AST from a directory of code')
  .action((dir: string) => {
    generateASTs(dir);
  });

program
  .command('graph')
  .description('Generate Code Graph from AST')
  .action(() => {
    generateCodeGraph();
  });

program.parse();
