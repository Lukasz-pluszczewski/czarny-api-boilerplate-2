require('@babel/register');

const argv = require('minimist')(process.argv.slice(2));

const scriptName = argv._[0];
const scriptArguments = {
  ...argv,
  _: argv._.slice(1),
};

(async () => {
  const module = require(`./${scriptName}`);

  if (!Object.prototype.hasOwnProperty.call(module, 'default')) {
    console.error(`Script "${scriptName}" doesn't have a default export.`);
    process.exit(1);
  }

  if (typeof module.default !== 'function') {
    console.error(`Default export in "${scriptName}" script must be a function but it is a ${typeof module.default}.`);
    process.exit(1);
  }

  const result = await module.default(scriptArguments);
  if (result !== undefined) { // eslint-disable-line no-undefined
    console.log(result);
  }
})().catch(error => {
  if (error.code !== 'MODULE_NOT_FOUND') {
    console.error(`Error while running the "${scriptName}" script: "${error.message}"`);
    process.exit(1);
  }

  console.error(`Script "${scriptName}" not found: "${error.message}"`);
  process.exit(127);
});
