const http = require('http'); 

const server = http.createServer((request, response) => { 
	console.log("HELLO WORLD!");
});