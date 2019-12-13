// const httpProxy = require('http-proxy');
// const http = require('http');

// const proxy = httpProxy.createProxyServer({});

// const server = http.createServer((req, res) => {
//     // You can define here your custom logic to handle the request
//     // and then proxy the request.
//     proxy.web(req, res, { target: 'http://127.0.0.1:80' });
// });

// console.log('listening on port 5050');
// server.listen(5050);

const process = require('process');
const redbird = require('redbird');

// Set keep-alive agent globally for redbird
const http = require('http');

const proxy = redbird({
    port: 3080,
    httpProxy: {
        agent: new http.Agent({ keepAlive: true })
    }
});
// proxy.proxy = httpProxy.createProxyServer({
//     prependPath: false,
//     agent: new http.Agent({ keepAlive: true })
// });
proxy.register('localhost', 'http://localhost:8080/random');
