import debug from 'debug';

// prepare loggers using DEBUG utility
const log = debug('simpleApi');
log.request = debug('simpleApi:request');
log.requestDetails = debug('simpleApi:requestDetails');
log.warning = debug('simpleApi:warning');

export default log;
