let express = require('express'); 
let app = express();//let app = require('express')();
let bodyParser = require('body-parser'); //подключаем модуль для обработки содержимого тела post запроса

app.listen(80);

app.use(bodyParser.urlencoded({ extended: false })); //регистрируем модуль для обработки содержимого тела post запроса в express 
app.use(express.static('public')); //настраиваем статический сервер, для отдачи контента из папки public

//Формируем обработчик post запроса на адрес http://localhost:80/somepath
app.post('/somepath', (req, res, next) => {
	console.log('Параметры POST запроса: ' + JSON.stringify(req.body));
	res.send(JSON.stringify(req.body)); 
});


/*Функция use — это интерфейс подключения дополнительных модулей к express.js. 
bodyParser — это мета-модуль, объединяющий модули json, urlencoded и multipart. 
Все их можно подключать по отдельности, и передавать им какие-то параметры. 
Существует ещё несколько модулей, самые полезные — logger и compress, которые включает gzip-сжатие страниц.*/