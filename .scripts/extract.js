#!/usr/bin/env node
// This script
// - changes package.json files section to have proper imports in future
// - extracts directories from source folder (build folder where js was build to parent folder)
// - should be run only before publishing

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

const argv = yargs(process.argv.slice(2))
  .options({
    source: {
      type: 'string',
      demandOption: true,
      describe: `source folder to extract`,
    },
    target: {
      type: 'string',
      demandOption: true,
      describe: `destination folder where extract`,
    },
    package: {
      type: 'string',
      demandOption: true,
      describe: `path to package json`,
    },
  })
  .alias('s', 'source')
  .alias('d', 'target')
  .alias('t', 'target')
  .alias('p', 'package')
  .help('help')
  .parseSync();

const srcDir = argv.source;
const destDir = argv.target;
const packagePath = argv.package;

if (!fs.existsSync(packagePath)) {
  throw new Error(
    'package.json does not exist by specified path:' + packagePath + ', CWD:' + process.cwd(),
  );
}

const pack = JSON.parse(fs.readFileSync(packagePath));

const sourcePath = srcDir;
const targetPath = destDir;
const items = fs.readdirSync(sourcePath);
const dirsOrFileList = [];

items.forEach(d => {
  try {
    if (fs.lstatSync(path.join(sourcePath, d)).isDirectory()) {
      console.log(d);
      dirsOrFileList.push({ isDir: true, path: `${d}/**` });
    } else {
      if (d.endsWith('.js') || d.endsWith('.d.ts')) {
        dirsOrFileList.push({ isDir: false, path: d });
      }
    }
  } catch (e) {
    // ignore
  }
});

dirsOrFileList.forEach(d => {
  if (!pack.files.includes(d.path)) {
    pack.files.push(d.path);
  }
});
console.log(`Package path: ${packagePath}`);
console.log('new package.json files:', pack.files);

fs.writeFileSync(packagePath, JSON.stringify(pack, null, '  '));

console.log('Written package json with files');

const srcArgs = `${sourcePath}/**`;
console.log('Will copy ' + srcArgs + ' to ' + targetPath);

// copy files from child to targetPath (parent)
require('child_process').execSync(`cp -vfr ${srcArgs} ${targetPath}`);
