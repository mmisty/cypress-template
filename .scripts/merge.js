#!/usr/bin/env node
const yargs = require("yargs");
const path = require("path");
const exec = require("child_process");
const { existsSync, copyFileSync, mkdirSync, writeFileSync } = require("fs");

const argv = yargs(process.argv.slice(2))
  .options({
    cypress: {
      type: 'string',
      demandOption: true,
      default: 'reports/coverage-cypress',
      describe: `Path to coverage reports directory (relative to current working directory)
      Path with directories - each of them should contain coverage report (coverage-final.json)`,
    },
    jest: {
      type: 'string',
      demandOption: true,
      default: 'reports/coverage-jest',
      describe: `Path to jet coverage report, should contain coverage report (coverage-final.json)`,
    },
    out: {
      type: 'string',
      demandOption: true,
      default: 'reports/coverage-full',
      describe: `Path to final report`,
    },
  })
  .alias('c', 'cypress')
  .alias('j', 'jest')
  .alias('h', 'help')
  .help('help')
  .parseSync();

const jestDir = argv.jest;
const cypressDir = argv.cypress;
const outDir = path.resolve(argv.out);
const reportDir = path.resolve(outDir);

const coveragePathCy = path.resolve(process.cwd(), cypressDir);
const coveragePathJest = path.resolve(process.cwd(), jestDir);

/**
 * Copies coverage-final.json to outDir and renames for further merge
 * @param fromDir directory with coverage-final.json
 * @param toFileName  file name to move to
 */
const copy = (fromDir, toFileName) =>{
  const fromFile = path.resolve(`${fromDir}/coverage-final.json`);
  const toFile = path.resolve(outDir, toFileName);
  
  console.log(`   Copy file ${fromFile} to: ${toFile}`);
  copyFileSync(fromFile, toFile);
}

/**
 * Execute command a log
 * @param cmd
 */
const execute = (cmd) => {
  console.log(cmd);
  exec.execSync(cmd, { stdio: 'inherit'});
  console.log('');
}

console.log(' ======== MERGE COVERAGE REPORTS');

if(!existsSync(outDir)){
  mkdirSync(outDir)
}

copy(coveragePathCy, `coverage-final-cypress.json`);
copy(coveragePathJest, `coverage-final-jest.json`);

execute(`nyc report -t ${outDir} --report-dir ${reportDir} --reporter=lcov`)
