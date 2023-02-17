const { sendFormPage } = require("./routes");
const { parseBody } = require("./parse-body");
let server;

/******************************************************************************/
/******************* DO NOT CHANGE THE CODE ABOVE THIS LINE *******************/

// Your code here
const http = require('http');

server = http.createServer((req, res) => {
    console.log(req.method, req.url)


    let reqBodyStr = ''
    req.on('data', data => {
        reqBodyStr += data;
    })

    req.on('end', () => {
        console.log(reqBodyStr)
        if (reqBodyStr.length > 0) {
            req.body = parseBody(reqBodyStr);
        }
        
        sendFormPage(req, res);
    });

});

server.listen(5000, () => console.log('Successfully started the server on port 5000'))


/******************************************************************************/
/******************* DO NOT CHANGE THE CODE BELOW THIS LINE *******************/

module.exports = { server };