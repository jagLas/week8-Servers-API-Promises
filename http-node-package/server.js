// const http = require('http');

// const server = http.createServer((req, res) => {
//     console.log(req);
//     res.statusCode = 200;
//     res.setHeader('Content-Type', "text/plain");
//     res.write('Hello World!')
//     res.end();
//     console.log(res);
// });

// const port = 5000;

// server.listen(port, () => console.log('Server is listening on port', port));

const http = require('http');

const server = http.createServer((req, res) => {
    let reqBody = '';
    req.on('data', (data) => {
        reqBody += data;
    })

    req.on('end', () => {
        console.log(reqBody);
        parsedData = reqBody.split('&');
        console.log(parsedData)
        parsedData = parsedData.map(pair => {
            splitPair = pair.split('=')
            console.log(splitPair)
        
            //example says something about turning + into ' ' here, but I'm not sure how one gets that to begin with
            splitPair = splitPair.map(value => decodeURIComponent(value));
            console.log(splitPair)
            return splitPair;
        })
        console.log(parsedData)
        const reqObject = {};
        parsedData.forEach(pair => {
            reqObject[pair[0]] = pair[1];
        })
        console.log(reqObject)
    })

});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));

