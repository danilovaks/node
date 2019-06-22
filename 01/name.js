const http = require('http'); 

/*const server = http.createServer((request, response) => { 
	console.log("HTTP works!");
});

server.listen(8080);*/

http.createServer((request, response) => { 
	console.log("HTTP works!");
	response.writeHead(200, {'Content-Type':'text/html'});
	response.write('<h1>Hello</h1>');
	response.end();
}).listen(8080);

//2. Отдайте пользователю ошибку 404.?????