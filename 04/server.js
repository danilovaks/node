let http = require('http'); 
let fs = require('fs'); 
let path = require('path');

let mimeTypes = {
	'.html': 'text/html',
	'.mp4': 'video/mp4',
	'.mp3' : 'audio/mpeg'
};

http.createServer((request, response) => {
	let pathname, extname, mimeType;
	//console.log("Request: " + request.url);
	//console.log("Request: " + request.headers.range);

	if (request.url === '/'){
		pathname = 'site/index.html';
	} else {
		pathname = 'site' + request.url;
	}

	extname = path.extname(pathname);
	mimeType = mimeTypes[extname];

	/*if (extname === '.mp4') {
		fs.readFile(pathname, (err, data) => {
			if (err) {
				console.log('Could not find or open file for reading\n');
				response.statusCode = 404;
				response.end();
			} else {
				console.log(`The file ${pathname} is read and sent to the client\n`);
				response.writeHead(200, {
					'Content-Type':mimeType
				});
				response.end(data);
			}
		});

	} else {
		fs.readFile(pathname, 'utf8', (err, data) => {
			if (err) {
				console.log('Could not find or open file for reading\n');
				response.statusCode = 404;
				response.end();
			} else {
				console.log(`The file ${pathname} is read and sent to the client\n`);
				response.writeHead(200, {
					'Content-Type':mimeType
				});
				response.end(data);
			}
		});
	}*/

	if (!fs.existsSync(pathname)) { //проверяет существование запрашиваемого файла
		console.log('Could not find or open file for reading\n');
		response.statusCode = 404;
		response.end();
		return null;
	}

	let responseHeaders = {};
	let stat = fs.statSync(pathname); //возвращает описание файла
	let rangeRequest = readRangeHeader(request.headers['range'], stat.size);//Разбираем содержимое заголовка Range в запросе от браузера

	if (rangeRequest == null) {
		responseHeaders['Content-Type'] = mimeType;
		responseHeaders['Content-Length'] = stat.size; 
		responseHeaders['Accept-Ranges'] = 'bytes'; 

		let video = fs.readFileSync(pathname);
		console.log(`The file ${pathname} is read and sent to the client\n`);

		response.writeHead(200, responseHeaders);
		response.end(video);
		return null;
	}

	let start = rangeRequest.start;
	let end = rangeRequest.end;

	if (start >= stat.size || end >= stat.size) {
		responseHeaders['Content-Range'] = 'bytes */' + stat.size; //Размер файла
		console.log("Return the 416 'Requested Range Not Satisfiable'");
		response.writeHead(416, responseHeaders);
		response.end();
		return null;
	}

	let maxsize = 10240; 
	if (end - start >= maxsize) {//Превышает, поэтому изменяем конечную границу диапазона
		end = start + maxsize - 1;
	}

	//Формируем заголовки ответа с частичным контентом
	responseHeaders['Content-Range'] = 'bytes ' + start + '-' + end + '/' + stat.size; 
	responseHeaders['Content-Length'] = start == end ? 0 : (end - start + 1);
	responseHeaders['Content-Type'] = mimeType;
	responseHeaders['Accept-Ranges'] = 'bytes'; 
	responseHeaders['Cache-Control'] = 'no-cache'; 

	const fd = fs.openSync(pathname, 'r'); //Считываем дескриптор файла, необходим для чтения части файла
	let buf = Buffer.alloc(responseHeaders['Content-Length']);//Создаем буфер (специализированный числовой массив) для хранения прочитанных из файлов байтов

	fs.read(fd, buf, 0, buf.length, start, (err, bytes) => {
		if(err) {
			console.log(err);
			response.statusCode = 500; //Отдаём ошибку в ответ клиенту
			response.end();
		} else {
			response.writeHead(206, responseHeaders);
			response.end(buf);
		}
	});

}).listen(80);

//Функция, которая сможет обработать присланный браузером содержимое заголовка «Range»:
function readRangeHeader(range, totalLength) {//range – содержимое заголовка «Range»/totalLength – размер запрашиваемого файла
	if (range == null || range.length == 0)//проверяем задано ли содержимое заголовка «Range»
		return null;
	//с помощью регулярного выражения разбиваем строку из заголовка «Range» на массив из четырех значений
	let array = range.split(/bytes=([0-9]*)-([0-9]*)/);
	let startRange = parseInt(array[1]);
	let endRange = parseInt(array[2]);
	let result = {
		start: isNaN(startRange) ? 0 : startRange,
		end: isNaN(endRange) ? (totalLength - 1) : endRange
	};
	//Проверяем случай: начало не указано, а конец указан – значит запрашиваются данные с конца файла
	if (isNaN(startRange) && !isNaN(endRange)) {
		result.start = totalLength - endRange;
		result.end = totalLength - 1;
	}
	return result;
}





