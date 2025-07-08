#!/usr/bin/env node

import { program } from 'commander';
import { generateASTs } from './generateAst';

program
  .name('graptor')
  .description('Generate AST from codebase')
  .version('0.1.0');

program
  .command('ast <directory>')
  .description('Generate AST from a directory of code')
  .action((dir: string) => {
    generateASTs(dir);
  });

program.parse();
