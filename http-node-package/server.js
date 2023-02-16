const http = require('http');

const server = http.createServer((req, res) => {
    console.log(req);
    res.statusCode = 200;
    res.setHeader('Content-Type', "text/plain");
    res.write('Hello World!')
    res.end();
    console.log(res);
});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));