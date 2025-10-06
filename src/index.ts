#!/usr/bin/env node

import { program } from 'commander';
import { generateASTs } from './generateAst';
import path from "path";
import fs from "fs";
import { generateCodegraph } from './codeGraph';
import { serializeCodeGraphToChunks } from './serializeCodeGraphToChunks';

const pkg = require('../package.json');

program
  .name('graptor')
  .description('Graptor is an open-source graph engine that understands your complex codebases.')
  .version(pkg.version);

program
  .command('run <directory>')
  .description('Generate code graph from source with a single command')
  .action(async (dir: string) => {
    const abs = path.resolve(process.cwd(), dir);

    if (!fs.existsSync(abs)) {
      console.error(`Error: Directory "${abs}" does not exist.`);
      process.exit(1);
    }

    if (!fs.lstatSync(abs).isDirectory()) {
      console.error(`Error: "${abs}" is not a directory.`);
      process.exit(1);
    }

    console.log(`✅ Directory is valid. Running Graptor on ${dir} dir`);

    const ast = await generateASTs(abs);
    fs.writeFileSync(`${abs}/ast.json`, JSON.stringify(ast, null, 2), 'utf8');
    console.log('Ast written successfully!');

    const codeGraph = await generateCodegraph(ast)
    fs.writeFileSync(`${abs}/codeGraph.json`, JSON.stringify(codeGraph, null, 2), 'utf8');
    console.log('codeGraph written successfully!');

    const chunks = serializeCodeGraphToChunks(codeGraph);
    fs.writeFileSync(`${abs}/chunks.json`, JSON.stringify(chunks, null, 2), 'utf8');
    console.log('Text chunks written successfully!');
    
  });

program.parse();
