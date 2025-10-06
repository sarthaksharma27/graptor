#!/usr/bin/env node

import { program } from 'commander';
import { generateASTs } from './generateAst';
import path from "path";
import fs from "fs";
import { generateCodegraph } from './codeGraph';
import { serializeCodeGraphToChunks } from './serializeCodeGraphToChunks';
import inquirer from 'inquirer';
import { generateVectorEmbeddings } from './generateVectorEmbeddings';

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
    // fs.writeFileSync(`${abs}/ast.json`, JSON.stringify(ast, null, 2), 'utf8');
    console.log('Ast written successfully!');

    const codeGraph = await generateCodegraph(ast)
    fs.writeFileSync(`${abs}/codeGraph.json`, JSON.stringify(codeGraph, null, 2), 'utf8');
    console.log('codeGraph written successfully!');

    const chunks = serializeCodeGraphToChunks(codeGraph);
    fs.writeFileSync(`${abs}/chunks.json`, JSON.stringify(chunks, null, 2), 'utf8');
    console.log('Text chunks written successfully!');
    
      const { embedNow } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'embedNow',
      message: 'Do you want to embed this chunks into vectors now?',
      default: true,
    },
  ]);

  if (!embedNow) {
    console.log('Skipped embedding. codeGraph written successfully!');
    return;
  }

  const { useOwnModel } = await inquirer.prompt([
    {
      type: 'list',
      name: 'useOwnModel',
      message: 'Do you want to use your own model or want to go with the Free model?',
      choices: [
        { name: 'Use my own model (requires API key)', value: true },
        { name: 'Use free/local model (no API key required)', value: false },
      ],
    },
  ]);

  let provider: string;
  let model: string;
  let apiKey: string;

  if (useOwnModel) {
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'provider',
          message: 'Select your embedding provider:',
          choices: ['OpenAI', 'Hugging Face Transformers', 'Ollama'],
        },
        {
          type: 'input',
          name: 'model',
          message: 'Enter the model name:',
          default: 'text-embedding-3-small',
        },
        {
          type: 'input',
          name: 'apiKey',
          message: 'Enter your API key:',
        },
      ]);

      provider = answers.provider;
      model = answers.model;
      apiKey = answers.apiKey;
    } else {
      provider = 'local';
      model = 'nomic-embed-text'; 
      apiKey = "local";
    }

    console.log(`Using ${provider} (${model})`);
    generateVectorEmbeddings( chunks, { provider, model, apiKey })

  });

program.parse();
