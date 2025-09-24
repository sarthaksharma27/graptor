#!/usr/bin/env node

import { program } from 'commander';
import { generateASTs } from './generateAst';
import path from "path";
// import { generateCodeGraph } from './generateCodeGraph';

const pkg = require('../package.json');

program
  .name('graptor')
  .description('Graptor is an open-source graph engine that understands your complex codebases.')
  .version(pkg.version);

program
  .command('run <directory>')
  .description('Generate code graph from source with a single command')
  .action((dir: string) => {
    console.log(`Running Graptor on ${dir}`);
    // generateASTs(dir);
    console.log(dir);
    const abs = path.resolve(process.cwd(), dir);
    console.log(abs);
    

    
    


  });



program.parse();
