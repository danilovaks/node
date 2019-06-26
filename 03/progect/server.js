const http = require('http');
const cp = require('child_process');
const url = require('url');
const child = cp.fork('./child.js');

let childReady = false; // false – дочерний процесс не готов к использованию

//функция обработчик сообщения от дочернего процесса, сигнал о готовности к использованию дочернего процесса
function childSaidReady(status){
	if (status === 'ready') {
		childReady = true;
		child.off('message', childSaidReady); //Удаляет ранее прикреплённого слушателя
		console.log('Server ready');
	}
}
child.on('message', childSaidReady);

http.createServer((request, response)=>{
	let _get = url.parse(request.url, true).query;
	console.log('Parametrs of request: ' + JSON.stringify(_get));

	if(!(_get.num1 && _get.num2)) {
		console.log('Bad Request');
		response.statusCode = 400;
		response.end();
		return;
	}

	if (!childReady) {
		console.log('Service Unavailable');
		response.statusCode = 503;
		response.end();
		return;
	}

	let expression = `${_get.num1}+${_get.num2}=`;

	function responseFromChild(data){
		if (data.expression === expression){
			response.writeHead(200, {'Content-Type':'text/html'});
			response.write(`<h1>${data.result}</h1>`);
			response.end();
			child.off('message', responseFromChild);
		}
	}
	child.on('message', responseFromChild);

	child.send({
		expression
	});
}).listen(80);


/*Попробуйте ответить на вопрос почему внутри
функции responseFromChild осуществляется проверка data.expression === expression ?*/