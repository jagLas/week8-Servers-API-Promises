const http = require('http');
const fs = require("fs");

const server = http.createServer((req, res) => {
  // Your code here
  console.log(req.method, req.url);
  if (req.method === 'GET' && req.url === '/') {
    const html = fs.readFileSync('./index.html', 'utf-8');
    res.setHeader('content-type', 'text/html')
    res.statusCode = 200;
    res.end(html);
  }
});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));