//1
function pause(func, time) {//декоратор 
	function wrapper() {
		return setTimeout(function() {
			return func.apply(this, arguments)}, time * 1000);
	}
	return wrapper;
}

function out() {
	console.log('Функция выполниться с задержкой в 2 секунды!');
}

let ouT = pause(out, 2);
ouT();
