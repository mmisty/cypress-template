export const instrumentSync = (srcDir: string, destDir: string, cyCoveragePath: string): void => {
  const group = process.env.CYPRESS_GROUP ? `_${process.env.CYPRESS_GROUP}` : '';
  const fs = require('fs');
  const exec = require('child_process');

  try {
    if (fs.existsSync(destDir)) {
      fs.rmdirSync(destDir, { recursive: true });
    }

    // eslint-disable-next-line no-console
    console.log(`Will instrument ${srcDir} to ${destDir}...`);
    const temp = `${cyCoveragePath}-temp`;

    try {
      const cyGroup = `${cyCoveragePath}/cypress${group}`;
      const nycTemp = `${temp}/.nyc_output_cypress${group}`;

      if (fs.existsSync(cyGroup)) {
        fs.rmdirSync(cyGroup, { recursive: true });
      }

      if (fs.existsSync(nycTemp)) {
        fs.rmdirSync(nycTemp, { recursive: true });
      }

      exec.execSync(`npx nyc instrument --compact=false ${srcDir} ${destDir}  --cache-dir ${temp}/.cache --cache`);
    } catch (err) {
      (err as Error).message = `Could not instrument ${srcDir}.
    -----
    ${(err as Error).message}`;

      throw err;
    }

    // eslint-disable-next-line no-console
    console.log('Success');
  } catch (scriptErr) {
    (scriptErr as Error).message = `Could not instrument '${srcDir}' to ${destDir}: ${(scriptErr as Error).message}`;
    throw scriptErr;
  }
};
