#!/usr/bin/env node

import { program } from 'commander';
import { generateASTs } from './generateAst';
import { generateCodeGraph } from './generateCodeGraph';
const pkg = require('../package.json');
import path from 'path';
import fs from 'fs';

program
  .name('graptor')
  .description('Graptor is an Open source graph engine that understand your complex codebases')
  .version(pkg.version);

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

program
  .command('run <directory>')
  .description('Generate code graph with single command (Recommended)')
  .action((dir: string) => {
    console.log(`Running Graptor on ${dir}`);
    generateASTs(dir);

    const astPath = path.join(process.cwd(), '.graptor', 'graptor.ast.json');
    if (!fs.existsSync(astPath)) {
      console.error('AST generation failed. Graph not generated.');
      process.exit(1);
    }

    generateCodeGraph(astPath);
  });

program.parse();
