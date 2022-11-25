#!/usr/bin/env node
const yargs = require("yargs");
const path = require("path");
const { existsSync, copyFileSync, mkdirSync, writeFileSync } = require("fs");
const istanbul = require('istanbul-lib-coverage');
const exec = require("child_process");
const fs = require("fs");

const execute = (cmd) => {
  console.log(cmd);
  exec.execSync(cmd, { stdio: 'inherit'});
  console.log('');
}
console.log(' ======== MERGE');
const nycFilenameJest = path.resolve('reports/coverage-jest/coverage-final.json');
const nycFilenameCy = path.resolve('reports/coverage-cypress/coverage-final.json');
const out = path.resolve('reports/coverage-full');
const report = path.resolve('reports/coverage-full');

if(!existsSync(out)){
  mkdirSync(out)
}

const toFileCy = path.resolve(out, `coverage-final-cy.json`);
const toFileJe = path.resolve(out, `coverage-final-je.json`);

console.log(`   Copy file to: ${toFileJe}`);
copyFileSync(nycFilenameJest, toFileJe);
console.log(`   Copy file to: ${toFileCy}`);
copyFileSync(nycFilenameCy, toFileCy);

execute(`COV_REPORT_DIR=${out} nyc report -t ${out} --report-dir ${report} --reporter=lcov`)
