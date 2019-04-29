const httpProxy = require('http-proxy');
const http = require('http')

let proxy = httpProxy.createProxyServer({});

let server = http.createServer((req, res) => {
    // You can define here your custom logic to handle the request
    // and then proxy the request.
    proxy.web(req, res, { target: 'http://127.0.0.1:80' });
});
  
console.log("listening on port 5050")
server.listen(5050);