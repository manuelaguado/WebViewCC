//Pusher.logToConsole = true;

var pusher = new Pusher(pusher_key,{authEndpoint: url_app + 'mobile/pusher_android_auth/' + token_session + '/' + id_usuario + '/' + id_operador + '/' + id_operador_unidad});

pusher.connection.bind( 'error', function( err ) {
	if( err.data.code === 4004 ) {
		console.log('>>> detectado error de limite');
	}
});

var gpsChannel = pusher.subscribe('gps'+id_operador+'');
var syncChannel = pusher.subscribe('sync'+id_operador+'');
var rideChannel = pusher.subscribe('ride'+id_operador+'');
var bcChannel = pusher.subscribe('broadcast');
var realChannel = pusher.subscribe(pusher_presence);

pusher.connection.bind('connected', function() {
	document.getElementById("infolink").innerHTML = '<span class="kkicon icon-link" style="font-weight: bold; color:#03A388 !important"></span>';
})
pusher.connection.bind('connecting_in', function(delay) {
	document.getElementById("infolink").innerHTML = '<span class="kkicon icon-unlink blink_me" style="font-weight: bold; color:#ffd400 !important">'+delay+'</span>';
});
pusher.connection.bind('unavailable', function() {
	document.getElementById("infolink").innerHTML = '<span class="kkicon icon-unlink" style="font-weight: bold; color:#ffd400 !important"></span>';
})
pusher.connection.bind('initialized', function() {
	document.getElementById("infolink").innerHTML = '<span class="kkicon icon-unlink blink_me" style="font-weight: bold; color:#FFFFFF !important"></span>';
})
pusher.connection.bind('connecting', function() {
	document.getElementById("infolink").innerHTML = '<span class="kkicon icon-unlink blink_me" style="font-weight: bold; color:#FFFFFF !important"></span>';
})
pusher.connection.bind('disconnected', function() {
	document.getElementById("infolink").innerHTML = '<span class="kkicon icon-unlink" style="font-weight: bold; color:red !important"></span>';	
})
pusher.connection.bind('failed', function() {
	document.getElementById("infolink").innerHTML = '<span class="kkicon icon-unlink blink_me" style="font-weight: bold; color:red !important"></span>';
})


$("body").on("click", "#infolink", function() {
	var state = pusher.connection.state;
	$( "#infostate" ).html(state);
});

gpsChannel.bind('evento', function(data) {
	var convert_json = JSON.stringify(data.message);
	gps_ok(convert_json);
});

syncChannel.bind('evento', function(data) {
	var convert_json = JSON.stringify(data.message);
	sync_ok(convert_json);
});

rideChannel.bind('evento', function(data) {
	var convert_json = JSON.stringify(data.message);
	ride_ok(convert_json);
});

bcChannel.bind('evento', function(data) {
	var convert_json = JSON.stringify(data.message);
	broadcastPlay(convert_json);
});