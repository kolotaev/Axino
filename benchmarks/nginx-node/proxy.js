const httpProxy = require('http-proxy');
const http = require('http');

const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
    proxy.web(req, res, { target: 'http://127.0.0.1:8080' });
});

server.listen(9080);
