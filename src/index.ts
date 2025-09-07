#!/usr/bin/env node

import { program } from 'commander';
import { generateASTs } from './generateAst';
import { generateCodeGraph } from './generateCodeGraph';
import path from 'path';
import fs from 'fs';

const pkg = require('../package.json');

program
  .name('graptor')
  .description('Graptor is an open-source graph engine that understands your complex codebases.')
  .version(pkg.version);

program
  .command('run <directory>')
  .description('Generate code graph from source with a single command (recommended)')
  .action((dir: string) => {
    console.log(`Running Graptor on ${dir}`);
    generateASTs(dir);

    // const astPath = path.join(process.cwd(), '.graptor', 'graptor.ast.json');
    // if (!fs.existsSync(astPath)) {
    //   console.error('AST generation failed. Graph not generated.');
    //   process.exit(1);
    // }

    // generateCodeGraph(astPath);
  });



program.parse();
