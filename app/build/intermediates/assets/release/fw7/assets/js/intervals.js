/*GPS*/
function startGps() {
	storeGps(function(){
		var active = dataBase.result;
		var data = active.transaction(["gps"], "readonly");
		var object = data.objectStore("gps");
		var elements = [];
		object.openCursor().onsuccess = function (e) {
			var cursor = e.target.result;
			if (cursor === null) {
				return;
			}
			if (cursor && elements.length < 20) {
				cursor.value['id_operador'] = id_operador;
				cursor.value['proceso'] = 'gps';
				elements.push(cursor.value);
				cursor.continue();
			}
		};
		data.oncomplete = function () {
			var sendvar = JSON.stringify(elements);
			        var tar = document.getElementById("infogps");
                    tar.innerHTML = 'G:' + elements.length;
			if(jQuery.isPlainObject(elements[0])){
				if(navigator.onLine){
                    $.ajax({
                        url: url_app + 'mobile/gps',
                        type: "POST",
                        dataType: 'json',
                        crossDomain : true,
                            beforeSend: function() {
                                $('.gps_animation').show();
                            },
                            complete:function() {
                                $('.gps_animation').hide();
                            },
                        data: 'gps='+sendvar+'&sid='+session_id,
                        /*No se verifica el envio para ahorrar datos*/
                        success: function(resp_success){
                            if (resp_success['gps'] == 'ok') {
                                var gpsSent = JSON.parse(sendvar);
                                $.each(gpsSent, function(k,v){
                                    eliminarClaveByToken(v.token,'gps');
                                });
                            }
                            //if(resp_success['out'] == 'login'){dOut();}
                        },
                    });
				}
			}
		};
		last_lat = lat;
		last_lon = lon;
	});
}
/*SINCRONIZACION*/
function startSync(exec){
	var active = dataBase.result;
	var data = active.transaction(["claves"], "readonly");
	var object = data.objectStore("claves");
	var elements = [];	
	object.openCursor().onsuccess = function (e) {
		var result = e.target.result;
		if (result === null) {
			return;
		}
		result.value['latitud_act'] = lat;
		result.value['longitud_act'] = lon;
		result.value['proceso'] = 'sync';
		elements.push(result.value);
		result.continue();
	};
	data.oncomplete = function () {
		var sendvar = JSON.stringify(elements);
			var tar = document.getElementById("infosync");
        	tar.innerHTML = 'S:' + elements.length;
		if(jQuery.isPlainObject(elements[0])){
			if(navigator.onLine){
                $.ajax({
                    url: url_app + 'mobile/sync',
                    type: "POST",
                    dataType: 'json',
                    crossDomain : true,
                        beforeSend: function() {
                            $('.ripple_animation').show();
                        },
                        complete:function() {
                            $('.ripple_animation').hide();
                        },
                    data: 'sync='+sendvar+'&sid='+session_id,
                    success: function(e){
                        exec();
                        //if(e['out'] == 'login'){dOut();}
                    }
                });
			}
		}else{
			exec();
		}
	};
}

/*SUSCRIPCIONES*/
function sync_ok(data) {
	var resp_success = JSON.parse(data);
		$.each(resp_success, function(k,v){
			if(v.resp == true){
				eliminarClaveByToken(v.token,'claves');
			}
		});
		switch (resp_success[0]['clave']) {
			case 'C1':
				storeTravel(resp_success[0]);
				break;
		}
}

function gps_ok(data) {
	var resp_success = JSON.parse(data);
		$.each(resp_success, function(k,v){
			if(v.resp == true){
				eliminarClaveByToken(v.token,'gps');
			}
		});
}
function broadcastPlay(data){
	var resp_success = JSON.parse(data);
	timbre.play();
	myApp.alert(resp_success['mensaje'], 'Notificación general',function(){
		timbre.pause();
	});
}
function print_travel(travel,sound=false){
	$('#data_viaje').html('');
	$.each(travel, function( key, value ) {
		if(value != ''){
			switch (key) {
				case 'tipo_servicio':
				case 'status_viaje':
				case 'fecha_solicitud':
				case 'fecha_asignacion':
					break;
				case 'id_viaje':
					$('#data_viaje').append( '<div class="id_head_key">'+value+'</div>' );
					break;
				default:
					$('#data_viaje').append( '<div class="card"><div class="card-header" style="color:#000000;">'+key+'</div><div class="card-content"><div class="card-content-inner">'+value+'</div></div></div>' );
			}
		}	
	});
	if(sound){
		rideSound.play();
	}
	storageRide(travel,function(){});	
}
function ride_ok(data) {
	var resp_success = JSON.parse(data);
	switch (resp_success['clave']) {
		///////////////////////////////////////////////////////////////////////////// sincronizar estados de pantalla
		case 'R1':
			myApp.alert('Se sincronizará el estado de su movil con la central ', 'Atención',function(){
				if(resp_success['set_page'] == 'inicio'){
					setStoreVariable('base','',function(){});
					$('#data_cordon').html('NO HAY DATOS DE CORDON');
					finalizar_servicio();
				}else if(resp_success['set_page'] == 'regreso'){
					storeClave('C1','C1','F11','NULL','NULL','NULL',function(){

						if(currentPage != 'regreso'){
							loadTemplate('regreso');
						}
						$('#data_viaje').html('');
						$('#data_cordon').html('');
						
						$("#air_service_act").hide();
						$("#air_service_des").show();
						
						$("#request_queue_des").hide();
						$("#request_queue_act").show();
						
						$("#fin_labores_des").hide();
						$("#fin_labores_act").show();
						
						$("#tomar_apartado_des").show();
						$("#tomar_apartado_act").hide();

					});
				}else{
					loadTemplate(resp_success['set_page']);
				}
			});
			//console.log('RIDE R1 OK');
			break;
		///////////////////////////////////////////////////////////////////////////// viaje por cordon
		case 'R11':
		case 'A10':
			if (resp_success['new'] == true){
				
				$('#data_cordon').html('NO HAY DATOS DE CORDON');
				storeTravel(resp_success);
				$("#ride_false").hide();
				$("#ride_true").show();
				updatePageButtons('ride_false','ride_true');
				$("#exit_true").hide();
				$("#exit_false").show();
				updatePageButtons('exit_true','exit_false');			
				
				print_travel(resp_success['viaje'],true);
				myApp.alert('Vea los detalles de su destino en el menú', 'Nuevo destino',function(){
					rideSound.pause();
				});	
				
				getBase(function () {	
					storeClave('R5','C1',globalBase,'NULL','NULL','ACUSE DE RECEPCION DE A10',function(){});
				});
				
			}else{
				$("#ride_true").hide();
				$("#ride_false").show();
				updatePageButtons('ride_true','ride_false');
			}
			
			//console.log('RIDE A10 OK');
			break;
		//////////////////////////////////////////////////////////////////////////////////////////////////// Activar boton para cancelar el servicio
		case 'C6':
				$('div[id ^= cancel_des_]').hide();
				$('div[id ^= cancel_act_]').show();		
				updatePageButtons('cancel_des_','cancel_act_');
				myApp.alert('Se ha activado la opción para cancelar su servicio de manera remota, ahora puede cancelarlo', 'Solicitud de cancelación');
				storeClave('R12','C1','NULL','NULL','NULL','ACUSE DE RECEPCION DE C6',function(){});
			break;
		//////////////////////////////////////////////////////////////////////////////////////////////////// Activar boton para abandonar el servicio
		case 'A14':
				$('div[id ^= abandono_des_]').hide();
				$('div[id ^= abandono_act_]').show();
				updatePageButtons('abandono_des_','abandono_act_');
				myApp.alert('Se ha activado la opción para abandonar su servicio de manera remota, ahora puede abandonarlo', 'Solicitud de abandono');
				storeClave('R13','C1','NULL','NULL','NULL','ACUSE DE RECEPCION DE A14',function(){});
			break;
		//////////////////////////////////////////////////////////////////////////////////////////////////// viaje on air
		case 'F15':
			if (resp_success['new'] == true){
				
				$('#data_cordon').html('NO HAY DATOS DE CORDON');
				
				storeTravel(resp_success);
				
				$("#air_service_des").hide();
				$("#air_service_act").show();
				updatePageButtons('air_service_des','air_service_act');
				
				$("#request_queue_act").hide();
				$("#request_queue_des").show();
				updatePageButtons('request_queue_act','request_queue_des');
				
				$("#fin_labores_act").hide();
				$("#fin_labores_des").show();
				updatePageButtons('fin_labores_act','fin_labores_des');
				
				$("#tomar_apartado_act").hide();
				$("#tomar_apartado_des").show();				
				updatePageButtons('tomar_apartado_act','tomar_apartado_des');
							
				
				print_travel(resp_success['viaje'],true);
				myApp.alert('Vea los detalles de su destino en el menú', 'Servicio al aire',function(){
					rideSound.pause();
				});					
				storeClave('R6','C1','NULL','NULL','NULL','ACUSE DE RECEPCION DE F15',function(){});
			}else{
				$("#air_service_act").hide();
				$("#air_service_des").show();
				updatePageButtons('air_service_act','air_service_des');
			}
			
			//console.log('RIDE F15 OK');
			break;
		
		//////////////////////////////////////////////////////////////////////////////////////////////////// Tomar apartado
		case 'A19':
			if (resp_success['new'] == true){
				
				$('#data_cordon').html('NO HAY DATOS DE CORDON');
				
				storeTravel(resp_success);
				
				$("#air_service_des").show();
				$("#air_service_act").hide();
				
				$("#request_queue_act").hide();
				$("#request_queue_des").show();
				
				$("#fin_labores_act").hide();
				$("#fin_labores_des").show();
				
				$("#tomar_apartado_act").show();
				$("#tomar_apartado_des").hide();				
				
				updatePageButtons('tomar_apartado_des','tomar_apartado_act');
				
				print_travel(resp_success['viaje'],true);
				myApp.alert('Vea los detalles de su destino en el menú', 'Servicio programado',function(){
					rideSound.pause();
				});								
				storeClave('R14','C1','NULL','NULL','NULL','ACUSE DE RECEPCION DE F15',function(){});
			}else{
				$("#tomar_apartado_des").show();
				$("#tomar_apartado_act").hide();
				updatePageButtons('tomar_apartado_act','tomar_apartado_des');
			}
			
			//console.log('RIDE A19 OK');
			break;
		////////////////////////////////////////////////////////////////////////////////////////////////// salida por sitio
		case 'F13':
			if (resp_success['new'] == true){
				$('#data_cordon').html('NO HAY DATOS DE CORDON');
				storeTravel(resp_success);
				$("#salida_sitio_des").hide();
				$("#salida_sitio_act").show();
				updatePageButtons('salida_sitio_des','salida_sitio_act');			
				
				print_travel(resp_success['viaje'],true);
				myApp.alert('Se autorizó la salida por sitio', 'Salida por sitio',function(){
					rideSound.pause();
				});					
				getBase(function () {	
					storeClave('R7','C1',globalBase,'NULL','NULL','ACUSE DE RECEPCION DE F13',function(){});
				});
			}else{
				$("#salida_sitio_act").hide();
				$("#salida_sitio_des").show();
				updatePageButtons('salida_sitio_act','salida_sitio_des');
			}
			
			//console.log('RIDE F13 OK');
			break;
		
		/////////////////////////////////////////////////////////////////////////////////////////////////// formacion en el cordon
		case 'F14':
			if(resp_success['queue'] == true){
				
				$('#update_cordon').css('display','none');
				
						loadTemplate('base');
						setStoreVariable('base',resp_success['base'],function(){});
						
				myApp.alert('Turno: ' + resp_success['turno'] + 
					'<br><br>Verifique el cordón en el menú para conocer el estado.',
					'Asignado al cordón');
				
				
				$('#data_cordon').html('');
				$('#data_viaje').html('');
				$.each(resp_success['cordon'], function( key, value ) {
					suma = parseInt(key) + parseInt(1);
				  $('#data_cordon').append('<div class="user-tail"><span id="ava-tail" class="circle_back"><img class="avatar_tail" src="file:///android_asset/fw7/assets/img/driver-black.svg" alt="Operador"><div class="cordon_name">'+ suma +'.-'+value+'</div></span></div>');
				});
				
				
				storeClave('R8','C1','NULL','NULL','NULL','ACUSE DE RECEPCION DE F14',function(){});
			
			}else if(resp_success['queue'] == false){
				
				$('#update_cordon').css('display','');
				var data_ind = JSON.parse(JSON.stringify(resp_success['indicadores']));
				var verify = myApp.indicadores(data_ind);
				$('#data_cordon').html(verify);
				
			}	
			//console.log('RIDE F14 OK');
			break;								
		
		/////////////////////////////////////////////////////////////////////////////////////////////////////// salida por sitio
		case 'F19':
			setCordonDual(resp_success);
			
			storeClave('R2','C1','NULL','NULL','NULL','ACUSE CORDON',function(){});
			
			//console.log('RIDE F19 OK');
			break;
		///////////////////////////////////////////////////////////////////////////////////////////////////////// estado normalizado
		case 'F20':
				$("#exit_true").show();
				$("#exit_false").hide();
				updatePageButtons('exit_false','exit_true');
				//console.log('RIDE F20 OK');
			break;
		////////////////////////////////////////////////////////////////////////////////////////////////////////// inicio de labores
		case 'C1':
			storeTravel(resp_success);
			setStoreVariable('episodio',resp_success['id_episodio'],function(){});
			storeClave('R10','C1','F11','NULL','NULL','ACUSE DE RECEPCION DE C1',function(){});
			//console.log('RIDE C1 OK');
			break;
		case 'MSG':
			storeClave('F17','C1',''+resp_success['id_mensaje']+'','NULL','NULL','Mensaje Leido',function(){
				timbre.play();
				myApp.alert(resp_success['mensaje'], 'Mensaje',function(){
					timbre.pause();
				});
			});
			//console.log('RIDE MSG OK');
			break;
			
		case 'R3':
			dOut();
			break;
		case 'R4':
			dOut();
			break;
	}
}

function setCordonDual(resp_success){
	if (resp_success['new'] == false){
		$('#data_cordon').html('');
		$.each(resp_success['cordon'], function( key, value ) {
			suma = parseInt(key) + parseInt(1);
		  $('#data_cordon').append('<div class="user-tail"><span id="ava-tail" class="circle_back"><img class="avatar_tail" src="file:///android_asset/fw7/assets/img/driver-black.svg" alt="Operador"><div class="cordon_name">'+ suma +'.-'+value+'</div></span></div>');
		});
		cordonSound.play();
		storageCordon(resp_success,function(){})
	}
	if(resp_success['turno'] <= 3){
		$("#exit_true").hide();
		$("#exit_false").show();
		updatePageButtons('exit_true','exit_false');
	}else{
		$("#exit_true").show();
		$("#exit_false").hide();
		updatePageButtons('exit_false','exit_true');
	}	
}
/*INTERVALS*/

var initSync = setInterval("startSync(function(){})",1000);
var initGps  = setInterval("startGps()",5000);