const process = require('process');
const redbird = require('redbird');

const proxy = redbird({ port: 80 });
proxy.register('localhost', process.env.TARGET);
