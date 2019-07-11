const http = require('http');
const fs = require('fs');

http.createServer((req,res)=> {
    fs.readFile('head.html', 'utf-8', (err, data)=> {
        if(err) {
            res.statusCode = 404;
            res.end();
        } else {
            res.writeHead(200, {
                'Content-Type' : 'text/html'
            });
            res.write(data);
            fs.readFile('body.html', 'utf-8', (err, data)=> {
                if(err) {
                    res.statusCode = 404;
                    res.end();
                } else {
                    res.write(data);
                    res.end();
                }
            });
        }
    });
}).listen(80);