/**
 * @issue https://github.com/lukeautry/tsoa/issues/868
 * @solution https://github.com/lukeautry/tsoa/issues/868#issuecomment-1445941911
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import * as tsoa from 'tsoa';
import ts from 'typescript';

const cwd = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.resolve(cwd, 'package.json'), 'utf-8'));
const tsConfigFile = ts.readConfigFile(path.resolve(cwd, 'tsconfig.json'), ts.sys.readFile);
const tsConfigContent = ts.parseJsonConfigFileContent(tsConfigFile.config, ts.sys, cwd);
const {
  spec: specConfig,
  routes: routesConfig,
  ...tsoaConfig
} = JSON.parse(fs.readFileSync(path.resolve(cwd, 'tsoa.json'), 'utf-8'));

function generateSpec() {
  return tsoa.generateSpec(
    {
      ...tsoaConfig,
      ...specConfig,
      name: packageJson.name,
      description: packageJson.description,
      version: packageJson.version,
    },
    tsConfigContent.options
  );
}

function generateRoutes() {
  return tsoa.generateRoutes({ ...tsoaConfig, ...routesConfig }, tsConfigContent.options);
}

async function main() {
  switch (process.argv[2]) {
    case 'spec':
      await generateSpec();
      break;
    case 'routes':
      await generateRoutes();
      break;
    case 'spec-and-routes':
      await Promise.all([generateRoutes(), generateSpec()]);
      break;
    default:
      throw new Error('Invalid command. Available commands are "spec", "routes", "spec-and-routes".');
  }
}

main().catch(console.error);
