import path from 'path';
import fs from 'fs/promises';
import _ from 'lodash';
import { input, confirm } from '@inquirer/prompts';
import { replaceInFile } from 'replace-in-file';

const SEMVER_PATTERN = /(?<=^v?|\sv?)(?:(?:0|[1-9]\d{0,9}?)\.){2}(?:0|[1-9]\d{0,9})(?:-(?:--+)?(?:0|[1-9]\d*|\d*[a-z]+\d*)){0,100}(?=$| |\+|\.)(?:(?<=-\S+)(?:\.(?:--?|[\da-z-]*[a-z-]\d*|0|[1-9]\d*)){1,100}?)?(?!\.)(?:\+(?:[\da-z]\.?-?){1,100}?(?!\w))?(?!\+)/gi;

const currentPath = process.cwd().split(path.sep);
const currentDirectoryName = currentPath[currentPath.length - 1];

const exists = async (path: string) => {
  try {
    await fs.access(path, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
};

(async () => {
  const packageName = await input({
    message: 'Enter package name (package.json)',
    default: currentDirectoryName,
    validate: value => {
      if (!value) {
        return 'Enter a package name';
      }
      if (!value.match(/^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/)) {
        return 'Incorrect package name';
      }
      if (value.length > 214) {
        return 'Package name is too long';
      }
      return true;
    },
  });
  const version = await input({
    message: "Version (package.json)",
    validate: value => {
      if (value.match(SEMVER_PATTERN)) {
        return true;
      }

      return 'Enter a valid version number (e.g. 1.0.0, 1.0.0-alpha.1)';
    },
    default: '1.0.0',
  });
  const createDotEnv = await exists('./.env') ? false : await confirm({
    message: 'Do you want to create .env file?',
    default: true,
  });


  const results = await replaceInFile({
    files: [
      'package.json',
    ],
    processor: (input) => _.template(input)({
      packageName,
      version,
    }),
  });

  let createdDotEnv = false;
  if (createDotEnv && !(await exists('./.env'))) {
    await fs.cp('./.env.example', './.env');
    createdDotEnv = true;
  }

  const filesUpdated = [
    ...results,
    ...(createdDotEnv ? [{ file: '.env', hasChanged: true }] : []),
  ].filter(result => result.hasChanged);
  console.log(`${filesUpdated.length || 0} files updated:`);
  console.log(filesUpdated.map(result => `    \x1b[32m ${result.file} \x1b[0m`).join('\n'));
})();

