#!/usr/bin/env node
/*
 * Script merges several coverage reports
 *
 * */

const fs = require('fs');
const path = require('path');
const exec = require('child_process');
const yargs = require('yargs');

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
      describe: `Path to final report`,
    },
  })
  .alias('c', 'cypress')
  .alias('j', 'jest')
  .alias('h', 'help')
  .help('help')
  .parseSync();

const outDir = argv.out;
const jestDir = argv.jest;

const coveragePath = path.resolve(process.cwd(), argv.cypress);
const coverageFullDir = path.resolve(`${coveragePath}/full`);
const coverageFullFile = `${coverageFullDir}/coverage.json`;

try {
  console.log('Merge cypress reports...');
  console.log(`   COVERAGE RESULTS PATH: ${coveragePath}`);
  if(fs.existsSync(outDir)){
    fs.rmSync(outDir, { recursive: true });
  }
  if(fs.existsSync(coverageFullDir)) {
    fs.rmSync(coverageFullDir, {recursive: true});
  }

  const dirs = fs.readdirSync(coveragePath);

  const copyCovFiles = () => {
    if (dirs.length < 1) {
      throw new Error(`No coverage found in ${coveragePath}`);
    }

    dirs.forEach(covDir => {
      const entry = path.resolve(coveragePath, covDir);
      const coverageFinal = path.resolve(entry, 'coverage-final.json');

      if (fs.lstatSync(entry).isFile()) {
        fs.rmSync(entry);
        return;
      }

      if (!fs.existsSync(coverageFinal)) {
        throw new Error(`File doesn't exist ${coverageFinal}`);
      }

      const toFile = path.resolve(coveragePath, `coverage-final-${covDir}.json`);

      console.log(`   Copy file to: ${toFile}`);
      fs.copyFileSync(coverageFinal, toFile);
    });
  };

  copyCovFiles();
  const reportCmd = `npx nyc report --reporter lcov --reporter html -t ${coverageFullDir} --report-dir ${coverageFullDir} --check-coverage false`;

  exec.execSync(`npx nyc merge ${coveragePath} ${coverageFullFile}`);

  console.log(`   Report command: ${reportCmd}`);
  exec.execSync(reportCmd);

  console.log('Cypress coverage merged successfully!');
} catch (err) {
  err.message = `Could not merge coverage report!
  
  Looking for coverage info in ${coveragePath}
  
    1. Before running the script make sure that tests provide coverage information
    2. Specify correct coverage reports path
    2. Make sure 'istanbul-merge' and 'nyc' packages are installed
    
    -----
    ${err.message}`;
  throw err;
}

console.log('Merge cypress and jest...');

exec.execSync(
  `istanbul-merge --out ${outDir}/coverage.json ${jestDir}/coverage-final.json ${coverageFullDir}/coverage.json`,
);
exec.execSync(`istanbul report --include ${outDir}/coverage.json --dir ${outDir} lcov`);

console.log('Success!');
