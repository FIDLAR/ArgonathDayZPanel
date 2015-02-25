$(document).ready(function() {
	$('select').material_select();
});

var socket = io.connect("http://localhost:3035");
socket.on("userAlert", function(data) {
	toast(data, 4000)
});