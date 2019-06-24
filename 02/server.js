const fs = require("fs");
const http = require("http");


http.createServer((request, respons)=>{
    let pathname = "site/index.html";
    let path = require('path');// подключение модуля для работы с путями в файловой системе
    let mimeTypes = {
        ".js": "application/javascript",
        ".html": "text/html",
        ".css": "text/css",
        ".gif": "image/gif",
        ".ico" : "image/vnd.microsoft.icon"
    };

    console.log(request.url);

    /*fs.readFile(pathname, "utf-8", (err, data)=>{
        if(err) {
            console.log("Could not find or open file for reading\n");
            respons.statusCode = 404;
            respons.end();
        } else {
            console.log("The file ${pathname} is read and sent to the client\n");
            respons.writeHead(200, {
                "Content-Type":"text/html"
            });
            respons.end(data);
        }
    });*/

    let extname, mimeType;
    //console.log("Request: " + request.url);

    /*if (request.url === '/') {
        pathname = 'site/index.html';
    } else {
        pathname = 'site' + request.url;
    };*/

    extname = path.extname(pathname);
    mimeType = mimeTypes[extname];

    if (extname === ".ico" || extname === ".gif") {
        try {
            let img = fs.readFileSync(pathname);//синхронное чтение файла, функция возвращает прочитанные данные
            console.log(`The file ${pathname} is read and sent to the client\n`);
            response.writeHead(200, {'Content-Type': mimeType});
            response.end(img);
        } catch (e) {
            console.log('Could not find or open file for reading\n');
            response.statusCode = 404;
            response.end();
        }
    } else {
        fs.readFile(pathname, 'utf8', (err, data) => {
            if (err) {
                console.log('Could not find or open file for reading\n');
                response.statusCode = 404;
                response.end();
            } else {
                console.log(`The file ${pathname} is read and sent to the client\n`);
                response.writeHead(200, {'Content-Type': mimeType});
                response.end(data);
            }
        });
    }

}).listen(80);