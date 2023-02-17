const http = require('http');
const fs = require("fs");

const server = http.createServer((req, res) => {
  // Your code here
  console.log(req.method, req.url);

  if (req.method === 'GET' && req.url.startsWith('/static')) {
    let url = req.url.split('/');
    url = './assets/' + url.slice(2).join('/');
    console.log(url)
    const extension = req.url.split('.')[1];
    const file = fs.readFileSync(url);

    res.statusCode = 200;
    res.setHeader('content-type', `text/${extension}`);
    return res.end(file);
  }

  if (req.method === 'GET') {
    const html = fs.readFileSync('./index.html', 'utf-8');
    res.setHeader('content-type', 'text/html')
    res.statusCode = 200;
    return res.end(html);
  }
});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));