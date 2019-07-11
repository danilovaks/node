const http = require('http');
const fs = require('fs');
const url = require('url');

const mimeType = {
    'html':'text/html',
    'css':'text/css',
    'js':'application/javascript',
    'json': 'application/json'
}

http.createServer(responser).listen(80);

function responser(req, res){
    let path, ext;
    
    console.log(req.method);
    console.log(req.url);
    
    if(req.url === '/'){
        path = '.' + req.url + 'index.html';
    } else {
        path = '.' + req.url;
    }
    
    ext = path.split('.').pop();
    console.log(ext);
    fs.readFile(path, 'utf-8', function(err, data){
        if (err){
           res.statusCode = 404;
           return res.end("Ops!!!");
        } 
        
        res.writeHead(200, {
            'Content-Type': mimeType[ext]
        });
        res.end(data);        
    });   
}
