const process = require('process');
const redbird = require('redbird');

// Set keep-alive agent globally for redbird
const http = require('http');

const proxy = redbird({
    port: process.env.PORT,
    httpProxy: {
        agent: new http.Agent({ keepAlive: true })
    }
});
// proxy.proxy = httpProxy.createProxyServer({
//     prependPath: false,
//     agent: new http.Agent({ keepAlive: true })
// });
proxy.register('localhost', process.env.TARGET);
