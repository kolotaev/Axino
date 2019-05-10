const process = require('process');
const redbird = require('redbird');

const proxy = redbird({ port: process.env.PORT });
proxy.register('localhost', process.env.TARGET);
