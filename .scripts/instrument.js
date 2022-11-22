#!/usr/bin/env node
const fse = require('fs-extra');
const fs = require('fs');
const exec = require('child_process');
const yargs = require('yargs');

const argv = yargs(process.argv.slice(2))
  .options({
    src: {
      type: 'string',
      demandOption: true,
      describe: `source folder to build/instrument`,
    },
    dest: {
      type: 'string',
      demandOption: true,
      describe: `destination folder where put instrumented code`,
    },
    cypress: {
      type: 'string',
      demandOption: true,
      default: 'reports/coverage-cypress',
      describe: `path where coverage is stored`,
    },
  })
  .alias('c', 'cypress')
  .alias('h', 'help')
  .help('help')
  .parseSync();

const group = process.env.CYPRESS_GROUP ? '_' + process.env.CYPRESS_GROUP : '';

const srcDir = argv.src;
const destDir = argv.dest;

try {
  if (fs.existsSync(destDir)) {
    fs.rmdirSync(destDir, { recursive: true });
  }

  if (process.env.COVERAGE === 'true') {
    console.log(`Will instrument ${srcDir} to ${destDir}...`);

    try {
      const cyGroup = `${argv.cypress}/cypress${group}`;
      const nyc = `reports/coverage-cypress-temp/.nyc_output_cypress${group}`;

      if (fs.existsSync(cyGroup)) {
        fs.rmdirSync(cyGroup, { recursive: true });
      }

      if (fs.existsSync(nyc)) {
        fs.rmdirSync(nyc, { recursive: true });
      }
      const instrumentCommand = `npx nyc instrument --compact=false ${srcDir} ${destDir}`;
      console.log(instrumentCommand);
      exec.execSync(instrumentCommand);
    } catch (err) {
      err.message = `Could not instrument ${srcDir}.
      -----
      ${err.message}`;

      throw err;
    }
  } else {
    console.log(`Will copy ${srcDir} to ${destDir}...`);
    fse.copySync(srcDir, destDir, { overwrite: true }, function (err) {
      if (err) {
        console.error(err);
      } else {
        console.log('success!');
      }
    });
  }
  console.log(`Success`);
} catch (scriptErr) {
  scriptErr.message = `Could not build to ${destDir}: ${scriptErr.message}`;
  throw scriptErr;
}
