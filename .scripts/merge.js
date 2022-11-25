#!/usr/bin/env node
const yargs = require("yargs");
const path = require("path");
const exec = require("child_process");
const NYC = require('nyc');
const istanbul = require('istanbul-lib-coverage');

const { existsSync, mkdirSync, rmSync, writeFileSync, readFileSync} = require("fs");

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
      default: 'reports/coverage-temp',
      describe: `Path to final report`,
    },
    report: {
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
const reportDir = path.resolve(argv.report);

const coveragePathCy = path.resolve(process.cwd(), cypressDir);
const coveragePathJest = path.resolve(process.cwd(), jestDir);

const removeDir = (dir) =>{
  const pathResolved = path.resolve(dir)
  if(existsSync(pathResolved)){
    rmSync(pathResolved, {recursive: true});
  }
}

const removeFile = (file) =>{
  const fileResolved = path.resolve(file)
  if(existsSync(fileResolved)){
    rmSync(fileResolved);
  }
}

console.log(' ======== MERGE COVERAGE REPORTS');

removeDir(reportDir);
removeDir(outDir);

if(!existsSync(outDir)){
  mkdirSync(outDir)
}
const jestFinal = path.resolve(`${coveragePathJest}/coverage-final.json`);
const cypressFinal = path.resolve(`${coveragePathCy}/coverage-final.json`);

function fixSourcePaths(coverage) {
  Object.values(coverage).forEach((file) => {
    const { path: absolutePath, inputSourceMap } = file
    const fileName = /([^\/\\]+)$/.exec(absolutePath)[1]
    if (!inputSourceMap || !fileName) return
    
    if (inputSourceMap.sourceRoot) inputSourceMap.sourceRoot = ''
    inputSourceMap.sources = inputSourceMap.sources.map((source) =>
      source.includes(fileName) ? absolutePath : source
    )
  })
}

function combineCoverage(tempDir, next) {
  const fileToSave = `${tempDir}/out.json`
  const coverage = existsSync(fileToSave)
    ? JSON.parse(readFileSync(fileToSave, 'utf8'))
    : {};
  
  fixSourcePaths(coverage)
  
  const previousCoverage = existsSync(next)
    ? JSON.parse(readFileSync(next, 'utf8'))
    : {}
  
  const coverageMap = istanbul.createCoverageMap(previousCoverage)
  coverageMap.merge(coverage)
  
  writeFileSync(fileToSave, JSON.stringify(coverageMap, null, 2))
  console.log('wrote coverage file %s', fileToSave)
  
  return null
};
const tempDir = path.resolve('reports/.nyc_output');
const cypress = path.resolve(`reports/.nyc_output/out.json`);
combineCoverage(outDir, cypress);
combineCoverage(outDir, jestFinal);
combineCoverage(outDir, cypress);
combineCoverage(outDir, jestFinal);

const nycReportOptions = {
  reportDir: reportDir,
  tempDir: outDir,
  reporter: ['json', 'lcov', 'text'],
};

const nyc = new NYC(nycReportOptions)

nyc.report().then(()=> {
  console.log("Report created");
})