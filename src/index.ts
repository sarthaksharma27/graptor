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
  .description('Generate code graph from source with a single command (recommended)')
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

const query = program.command('query').description('Query your code graph');

query
  .command('calls <functionName>')
  .description('Show all places where a function is called')
  .action((fn) => handleQuery(['calls', fn]));

query
  .command('defined-in <functionName>')
  .description('Show the file where a function is defined')
  .action((fn) => handleQuery(['defined-in', fn]));

query
  .command('imports <filePath>')
  .description('Show all files that are imported by the given file')
  .action((file) => handleQuery(['imports', file]));

query
  .command('imported-by <filePath>')
  .description('Show all files that import the given file')
  .action((file) => handleQuery(['imported-by', file]));

query
  .command('unused-fun')
  .description('List functions that are defined but never called or used')
  .action(() => handleQuery(['unused-fun']));

query
  .command('stats')
  .description('Show statistics about your codebase (files, functions, classes)')
  .action(() => handleQuery(['stats']));


program.parse();
