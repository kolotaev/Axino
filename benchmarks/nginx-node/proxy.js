const http = require('http');
const process = require('process');
const httpProxy = require('http-proxy');

const agent = new http.Agent({ keepAlive: true });
const proxy = httpProxy.createProxyServer({ agent });

const server = http.createServer((req, res) => {
    proxy.web(req, res, { target: process.env.TARGET });
});

server.listen(process.env.PORT);
