var wrgsv = {
	idBox: 'wrgsv',
	url_get_data_widget: '//localhost/get_widget_data', /* url откуда запросить данные у сервера для наполнения виджета */
	url_style: '//localhost/widget.css', /* url откуда запросить файл со стилями у сервера для виджета */
	init: function() { /*функция инициализации виджета */
		if (document.getElementById(this.idBox)) { /*проверяем наличие в DOM элемента с указанным идентификатором */
			this.addStyle(); /* Вызываем метод объекта виджета для загрузки файла со стилями и применения его к документу*/ 
			var self = this; /* Сохраняем ссылку на объект виджета в переменную self*/
			/* проверка для совместимости с ie (в ie XMLHttpRequest это XDomainRequest) */
			var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest; 
			var xhr = new XHR(); /* Создаем объект для ajax запроса на сервер */
			/* настраиваем ajax запрос на сервер: метод – GET, url - '//localhost/get_widget_data', true – асинхронный режим */
			xhr.open('GET', this.url_get_data_widget, true); 
			xhr.onload = function() { /*вешаем обработчик загрузки данных от сервера */
				if (this.response) { /*проверяем доступны ли данные полученные от сервера*/
					/* преобразовываем полученные данные к JS объекту и передаём этот объект в метод виджета addWidget для построения вёрстки виджета */
					self.addWidget(JSON.parse(this.response)); 
				}
			}
			xhr.onerror = function() { 
				console.log('onerror '+this.status); /* вешаем обработчик ошибок получения данных от сервера */
			} 
			xhr.send();
		} else {
			console.log('The specified block ID "'+id+'" is missing'); 
		}
	},
	addStyle: function() { /* метод формирует тег link и вставляет его в документ */
		var style = document.createElement('link'); 
		style.rel = 'stylesheet'; 
		style.type = 'text/css'; 
		style.href = this.url_style; 
		document.head.appendChild(style);
	},
	/*метод формирует вёрстку виджета с учётом переданных от сервера массива данных и вставляет его в контейнер для виджета */
	addWidget: function(data) { 
		var a, li, ul = document.createElement('ul'); 
		for(var i = 0; i < data.length; i++){ 
			li = document.createElement('li'); 
			a = document.createElement('a'); 
			a.setAttribute('href', data[i].href); /* устанавливаем атрибут href у тега <a> по переданным с сервера данным */
			a.innerHTML = data[i].title; /* устанавливаем внутреннее содержимое у тега <a> по переданным с сервера данным */ 
			a.onclick = this.changeLocation; 
			li.appendChild(a); 
			ul.appendChild(li); 
		}
		document.getElementById(this.idBox).appendChild(ul); 
	},
	changeLocation: function(e){
		e.preventDefault(); /* отмена действие браузера по нажатия на тег <a> */
		window.parent.location = this.href; /* перезагрузка основного окна с переходом по указанной ссылке */
	}
};

/*XMLHttpRequest это API, который предоставляет клиенту функциональность для обмена данными между клиентом и сервером. 
Данный API предоставляет простой способ получения данных по ссылке без перезагрузки страницы. 
Это позволяет обновлять только часть веб-страницы не прерывая пользователя.  
XMLHttpRequest используется в AJAX запросах и особенно в single-page приложениях.*/