/*Cronometro*/
var inicio=0;
var timeout=0;
function empezarTimer()
{
	inicio=vuelta=new Date().getTime();
	funcionando();
}
function detenerTimer()
{
	clearTimeout(timeout);
}
function funcionando()
{
	var actual = new Date().getTime();
	var diff=new Date(actual-inicio);
	var result=LeadingZero(diff.getUTCHours())+":"+LeadingZero(diff.getUTCMinutes())+":"+LeadingZero(diff.getUTCSeconds());
	document.getElementById('crono').innerHTML = result;
	timeout=setTimeout("funcionando()",1000);
}
function LeadingZero(Time) {
	return (Time < 10) ? "0" + Time : + Time;
}

//Geoposicion
function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}
function showPosition(position) {
	var crd = position.coords;	
	lat = crd.latitude;
	lon = crd.longitude;
	acc = crd.accuracy;
}
function error(){
		console.warn('Geolocalización no soportada');
}
options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};
var gpswatch = navigator.geolocation.watchPosition(showPosition,error,options);
//navigator.geolocation.clearWatch(gpswatch);


function haversineDistance(array_coords1, array_coords2) {
  function toRad(x) {
    return x * Math.PI / 180;
  }

  var lat1 = array_coords1[0];
  var lon1 = array_coords1[1];

  var lat2 = array_coords2[0];
  var lon2 = array_coords2[1];
  
  var R = 6371; // km

  var x1 = lat2 - lat1;
  var dLat = toRad(x1);
  var x2 = lon2 - lon1;
  var dLon = toRad(x2)
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = (R * c) * 1000;
  return parseFloat(d).toFixed(2);
}

var rand = function() {
    return (Math.random().toString(36).substr(2)).substr(0,20);
};

function token(callback) {
    vasi = rand() + rand() + rand();
	var token = 'MV:' + vasi;
	callback(token);
};
function mvhc_start(){
	$(document).ready(function(){
		$.ajax({
			url: url_app + 'mobile/multiandroid',
			type: "POST",
			dataType: 'json',
			crossDomain : true,
				beforeSend: function() {
                    $('.loader_animation').show();
                },
                complete:function() {
                    $('.loader_animation').hide();
                },
			data: 'id_operador_unidad='+id_operador_unidad+'&id_operador='+id_operador,
			success: function(resp_success){
                loadTemplate('choice_car');
				setPageWOR1('regreso');
				$.each(resp_success, function( key, value ) {	
					$('#select_car_list').append('<li>'+
						'<a href="javascript:;" class="item-link item-content select_car" data-car="'+value['id_operador_unidad']+'">'+
							'<div class="item-media"><img src="fw7/assets/img/car_select.svg" width="80"/></div>'+
							'<div class="item-inner">'+
								'<div class="item-title-row">'+
									'<div class="item-title">'+value['marca']+' '+value['modelo']+'</div>'+
									'<div class="item-after">Seleccionar</div>'+
								'</div>'+
								'<div class="item-subtitle">Placas: '+value['placas']+'</div>'+
								'<div class="item-subtitle">Color: '+value['color']+'</div>'+
							'</div>'+
						'</a>'+
					'</li>');
						
				});
				
			},
		});
	});
}

/*
function mostrar(){
	var tar = document.getElementById("pie");
	tar.innerHTML = lat + ',' + lon + ' | ' + acc + ' m <br> ' + tsp;
}
var posGps = setInterval('mostrar()',1000);
*/