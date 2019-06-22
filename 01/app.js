const http = require('http'); 
const fs = require('fs'); 
const filename = "index.html";

http.createServer((request, response) => {
	fs.readFile(filename, 'utf8', (err, data) => {
		if (err) {
			console.log('Could not find or open file for reading\n');
			response.statusCode = 404;
			response.end();
		} else {
			console.log(`The file ${filename} is read and sent to the client\n`);
			response.writeHead(200, {'Content-Type':'text/html'});
			response.end(data);
		}
	});
	console.log("Request accepted!");
}).listen(8080, ()=>{
	console.log("HTTP server works in 8080 port!\n");
});

//1. Сделайте три файла header.html , body.html, footer.html с простой html версткой и отдайте контент за один вызов сервера.?