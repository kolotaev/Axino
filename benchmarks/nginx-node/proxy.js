const http = require('http');
const process = require('process');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
    proxy.web(req, res, { target: process.env.TARGET });
});

server.listen(process.env.PORT);
