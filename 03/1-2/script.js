function ajax() {
	$.ajax({
		type: 'GET',
		url: 'ajax.html',
		success: function(response) {
			$('#container').load('ajax.html');
		}
	});
}

function json() {
	$.ajax({
		type: 'GET',
		url: 'users.json',
		success: function(response) {
			$('#container').load('users.json');
		}
	});
}

/*
появился список пользователей из users.json в 
виде списка <ul> - каждый пользователь в своем <li>.
*/