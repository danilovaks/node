const fs = require("fs");
const settings = require("./config.json");

process.on('message', (obj) => {// obj – переменная содержащая объект отправленный родителем/ process - является глобальным объектом
	let logData = `Date ${(new Date()).toString()}` +//????
		` Request method ${obj.method}` +
		` Request params ${obj.params}\n`;

	fs.writeFile(settings.logFile, logData, {//синхронная запись данных в файл/ методом writeFile модуля fs
		encoding:'utf8', //необязательный параметр, указывает кодировку данных
		flag:'a'//режим 'a' – задаёт что файл открывается чобы произвести до запись данных в конец файла и что,если файл не существует создать его
	}, (err)=>{
		if(err){
			console.log('Child: Can`t save log');
		} else {
			console.log('Child: Log save');
		}
	});
});