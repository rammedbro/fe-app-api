/**
 * @issue https://github.com/lukeautry/tsoa/issues/868
 * @solution https://github.com/lukeautry/tsoa/issues/868#issuecomment-1445941911
 */
const path = require('node:path');
const fs = require('node:fs');
const process = require('node:process');
const ts = require('typescript');
const tsoa = require('tsoa');

const cwd = process.cwd();
const tsConfigFileName = path.resolve(cwd, 'tsconfig.json');
const tsConfigFile = ts.readConfigFile(tsConfigFileName, ts.sys.readFile);
const tsConfigContent = ts.parseJsonConfigFileContent(tsConfigFile.config, ts.sys, cwd);
const tsoaConfigFileName = path.resolve(cwd, 'tsoa.json');
const {
  spec: specConfig,
  routes: routesConfig,
  ...tsoaConfig
} = JSON.parse(fs.readFileSync(tsoaConfigFileName, 'utf-8'));

function generateSpec() {
  return tsoa.generateSpec({ ...tsoaConfig, ...specConfig }, tsConfigContent.options);
}

function generateRoutes() {
  return tsoa.generateRoutes({ ...tsoaConfig, ...routesConfig }, tsConfigContent.options);
}

(async function () {
  switch (process.argv[2]) {
    case'spec':
      await generateSpec();
      break;
    case 'routes':
      await generateRoutes();
      break;
    case 'spec-and-routes':
      await Promise.all([generateRoutes(), generateSpec()]);
      break;
    default:
      console.error('Invalid command. Use either "spec", "routes" or "spec-and-routes" as an argument.');
  }
})();
