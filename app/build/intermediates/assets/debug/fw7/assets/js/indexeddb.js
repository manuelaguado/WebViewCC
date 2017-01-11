var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var dataBase = null;

var version_bd = 'V2.8';
$("#allow_update").html(version_bd);

//deleteDatabase('serexecutive2');

	/*INICIALIZAR LA BASE DE DATOS*/
	function startDB() {
		dataBase = indexedDB.open("serexecutive3", 1);
		dataBase.onupgradeneeded = function (e) {
			var active = dataBase.result;
			var object1 = active.createObjectStore("claves", {keyPath: 'id', autoIncrement: true});
				object1.createIndex('by_iden', 'id', {unique: true});
				object1.createIndex('by_token', 'token', {unique: true});
			var object2 = active.createObjectStore("page", {keyPath: 'id', autoIncrement: true});
				object2.createIndex('by_iden', 'iden', {unique: true});
			var object3 = active.createObjectStore("viaje", {keyPath: 'id', autoIncrement: true});
				object3.createIndex('by_id_viaje', 'id_viaje', {unique: true});
				object3.createIndex('by_iden', 'iden', {unique: true});
			var object4 = active.createObjectStore("state_boton", {keyPath: 'id', autoIncrement: true});
				object4.createIndex('by_iden', 'iden', {unique: true});
			/*var object5 = active.createObjectStore("taxmeter", {keyPath: 'id', autoIncrement: true});
				object5.createIndex('by_iden', 'iden', {unique: true});*/
			var object6 = active.createObjectStore("estados_variables", {keyPath: 'id', autoIncrement: true});
				object6.createIndex('by_iden', 'iden', {unique: true});
			var object7 = active.createObjectStore("gps", {keyPath: 'id', autoIncrement: true});
				object7.createIndex('by_iden', 'id', {unique: true});
				object7.createIndex('by_token', 'token', {unique: true});
			var object8 = active.createObjectStore("cordon", {keyPath: 'id', autoIncrement: true});
				object8.createIndex('by_iden', 'iden', {unique: true});
			var object9 = active.createObjectStore("ride", {keyPath: 'id', autoIncrement: true});
				object9.createIndex('by_iden', 'iden', {unique: true});
		};
		dataBase.onsuccess = function (e) {	
			if(mvhc == 2){
				mvhc_start();
			}else{
				setStartPage();
			}
		};
		dataBase.onerror = function (e) {
			alert('Error loading database');
		};
	}


/*RECUPERAR RIDE*/
function getRide(){
	var active = dataBase.result;
	var data = active.transaction(["ride"], "readwrite");
	var object = data.objectStore("ride");
	
	var index = object.index("by_iden");
	var request = index.get(1);
	
	request.onsuccess = function () {
		var rest = request.result;
		if(rest !== undefined){
			print_travel(rest.ride);
		}
	};
}
	
/*GUARDAR RIDE*/
function storageRide(response,callback){
	var active = dataBase.result;
	var data = active.transaction(["ride"], "readwrite");
	var object = data.objectStore("ride");
	var index = object.index("by_iden");
	var request = index.get(1);
	var objectStoreRequest = object.clear();
	request.onsuccess = function () {
		var request = object.put({
			iden: 1,
			ride: response
		});
		callback();
	};
}

/*GUARDAR RIDE*/
function deleteRide(callback){
	var active = dataBase.result;
	var data = active.transaction(["ride"], "readwrite");
	var object = data.objectStore("ride");
	var index = object.index("by_iden");
	var request = index.get(1);
	var objectStoreRequest = object.clear();
	callback();
}

/*RECUPERAR CORDON*/
function getCordon(){
	var active = dataBase.result;
	var data = active.transaction(["cordon"], "readwrite");
	var object = data.objectStore("cordon");
	
	var index = object.index("by_iden");
	var request = index.get(1);
	
	request.onsuccess = function () {
		var result = request.result;
		setCordonDual(result.cordon);
	};
}	
/*GUARDAR CORDON*/
function storageCordon(response,callback){
	var active = dataBase.result;
	var data = active.transaction(["cordon"], "readwrite");
	var object = data.objectStore("cordon");
	var index = object.index("by_iden");
	var request = index.get(1);
	var objectStoreRequest = object.clear();
	request.onsuccess = function () {
		var request = object.put({
			iden: 1,
			cordon: response
		});
		callback();
	};
}

/*SETEAR PAGINA ACTUAL*/
function setStartPage(){
	var active = dataBase.result;
	var data = active.transaction(["page"], "readwrite");
	var object = data.objectStore("page");
	
	var index = object.index("by_iden");
	var request = index.get(1);
	
	request.onsuccess = function () {
		var result = request.result;
		var html = '';
		if (result !== undefined) {
			if(result.actual == 'regreso_init'){
				initEpisodioAuto();
			}else{
				eval("html = myApp." + result.actual + "({origen: '" + result.origen + "' })");
				mainView.loadContent(html);
				if(
					(result.actual !== 'base')
				){
					getRide();
				}
				if(result.actual !== 'base'){
					loadStateBoton();
				}else{
					getCordon();
				}
			}
		}else{
			initEpisodioAuto();
		}		
	};
}
/*SETEAR VARIABLES DINAMICAS*/
function setStoreVariable(variable,valor,callback){
	var active = dataBase.result;
	var data = active.transaction(["estados_variables"], "readwrite");
	var object = data.objectStore("estados_variables");
	var index = object.index("by_iden");
	var request = index.get(1);
	var objectStoreRequest = object.clear();
	request.onsuccess = function () {
		var data = request.result;
		if(data == undefined){
			eval("object.put({iden: 1, "+variable+": valor});");
		}else{
			eval("object.put({iden: 1,base:data.base,episodio:data.episodio, "+variable+": valor});");
		}
	};
	callback();
}
/*OBTENER VARIABLES DINAMICAS*/
var globalBase;
function getBase(callback){
	var active = dataBase.result;
	var data = active.transaction(["estados_variables"], "readwrite");
	var object = data.objectStore("estados_variables");
	var index = object.index("by_iden");
	var request = index.get(1);
	request.onsuccess = function () {
		var result = request.result;
		if (result !== undefined) {
			globalBase = result.base;
			callback();
		}else{
			globalBase = 'SB';
			callback();
		}
	};
}

/*MANTENER EL ESTADO DE LOS BOTONES*/
function updatePageButtons(hide,show){
	var active = dataBase.result;
	var data = active.transaction(["state_boton"], "readwrite");
	var object = data.objectStore("state_boton");
	object.put({
		data_show:	show,
		data_hide: 	hide
	});
}

/*CARGAR ESTADOS DE LOS BOTONES*/
function loadStateBoton(){
	var active = dataBase.result;
	var data = active.transaction(["state_boton"], "readonly");
	var object = data.objectStore("state_boton");
	var elements = [];
	object.openCursor().onsuccess = function (e) {
		var result = e.target.result;
		if (result === null) {
			return;
		}
		elements.push(result.value);
		result.continue();
	};
	data.oncomplete = function () {
		for (var key in elements) {
			$("#" + elements[key].data_show).show();
			$("#" + elements[key].data_hide).hide();
		}
		for (var key in elements) {
			$('div[id ^= '+elements[key].data_show+']').show();
			$('div[id ^= '+elements[key].data_hide+']').hide();
		}
		elements = [];
	};
}

/*LIMPIAR EL ESTADO DE LOS BOTONES*/
function clearPageButtons(){
	var active = dataBase.result;
	var data = active.transaction(["state_boton"], "readwrite");
	var object = data.objectStore("state_boton");
	object.clear();
}
var currentPage;
/*SETEAR PAGINA*/
function setPage(page,returned){
	var active = dataBase.result;
	var data = active.transaction(["page"], "readwrite");
	var object = data.objectStore("page");
	
	var objectStoreRequest = object.clear();
	clearPageButtons();
	var request = object.put({
		iden: 1,
		actual: page,
		origen: returned
	});
	currentPage = page;
	storeClave('R1','INS','NULL','NULL','NULL','NULL',function(){});
}
function setPageWOR1(page,returned){
	var active = dataBase.result;
	var data = active.transaction(["page"], "readwrite");
	var object = data.objectStore("page");
	
	var objectStoreRequest = object.clear();
	clearPageButtons();
	var request = object.put({
		iden: 1,
		actual: page,
		origen: returned
	});
	currentPage = page;
}
function setInitPage(page,callback){
	var active = dataBase.result;
	var data = active.transaction(["page"], "readwrite");
	var object = data.objectStore("page");
	
	var objectStoreRequest = object.clear();
	clearPageButtons();
	var request = object.put({
		iden: 1,
		actual: page,
		origen: page
	});
	data.oncomplete = function () {
		callback();
	}
}
/*ACTUALIZAR PAGINA*/
function updatePage(page, returned){
	var active = dataBase.result;
	var data = active.transaction(["page"], "readwrite");
	var object = data.objectStore("page");
	var index = object.index("by_iden");
	var request = index.get(1);
	request.onsuccess = function () {
		var data = request.result;
		data.actual = page;
		data.origen = returned;
		object.put(data);
		storeClave('R1','UPD','NULL','NULL','NULL','NULL',function(){});
	}
}

/*GUARDAR VIAJE RECUPERADO*/
function storeTravel(datos){
	
	var active = dataBase.result;
	var data = active.transaction(["viaje"], "readwrite");
	var object = data.objectStore("viaje");
	var objectStoreRequest = object.clear();

		var request = object.put({
			iden:					1,
			date:					(new Date).getTime(),
			id_episodio:			datos['id_episodio'],
			id_viaje:				datos['viaje']['id_viaje']
		});

}

/*LIMPIAR VIAJE RECUPERADO*/
function clearTravel(){
	var active = dataBase.result;
	var data = active.transaction(["viaje"], "readwrite");
	var object = data.objectStore("viaje");
	var objectStoreRequest = object.clear();
}
/*Convertir a formato mysql*/

Date.prototype.toMysqlFormat = function() {
    return this.getFullYear() + "-" + twoDigits(1 + this.getMonth()) + "-" + twoDigits(this.getDate()) + " " + twoDigits(this.getHours()) + ":" + twoDigits(this.getMinutes()) + ":" + twoDigits(this.getSeconds());	
};

/*GUARDAR CLAVE*/

function storeClave(cve,cve1,cve2,cve3,cve4,motivo,callback){
	var active = dataBase.result;
	var data = active.transaction(["viaje"], "readwrite");
	var object = data.objectStore("viaje");
	
	var index = object.index("by_iden");
	var request = index.get(1);
	
	request.onsuccess = function () {
		token(function(token){
			var result = request.result;
			if (result !== undefined) {
				var data3 = active.transaction(["page"], "readwrite");
				var object3 = data3.objectStore("page");
				var index3 = object3.index("by_iden");
				var request3 = index3.get(1);
				request3.onsuccess = function () {
					var result3 = request3.result;
					if(result3 == undefined){
						setPageWOR1('regreso','regreso');
						initEpisodioAuto();
					}else{
						var actual_page = result3.actual;
						var data2 = active.transaction(["claves"], "readwrite");
						var object2 = data2.objectStore("claves");
						var time = new Date();
						//object2.clear();
							object2.put({
								accurate:		acc,
								clave: 			cve,
								estado1:		cve1,
								estado2:		cve2,
								estado3:		cve3,
								estado4:		cve4,
								timestamp:		time.toMysqlFormat(),
								id_episodio:	result.id_episodio,
								id_operador:	id_operador,
								id_operador_unidad:id_operador_unidad,
								id_viaje:		result.id_viaje,
								latitud:		lat,
								longitud: 		lon,
								motivo:			motivo,
								serie:			serie,
								tiempo: 		time.toMysqlFormat(),
								token:			token,
								origen:			actual_page,
								id_usuario:		id_usuario
							});
						callback();
					}
				}
			}else{
				storeClave(cve,cve1,cve2,cve3,cve4,'NULL',function(){});
				
				getEpisode(function(){
					var num = new Object();
					num.id_viaje = 'IR003';
					var travel_0 = new Object();
					travel_0.id_episodio = globalEpisodio;
					travel_0.viaje = num;
					var a = JSON.stringify(travel_0);
					var b = JSON.parse(a);
					storeTravel(b);
				});
			}
		});
	};
}

function setEpisodio(callback){
	var active = dataBase.result;
	var data = active.transaction(["viaje"], "readwrite");
	var object = data.objectStore("viaje");
	
	var index = object.index("by_iden");
	var request = index.get(1);
	
	request.onsuccess = function () {
		setStoreVariable('episodio',request.result.id_episodio,function(){});
	};
	callback();
}
var globalEpisodio;
function getEpisode(callback){
	var active = dataBase.result;
	var data = active.transaction(["estados_variables"], "readwrite");
	var object = data.objectStore("estados_variables");
	var index = object.index("by_iden");
	var request = index.get(1);
	request.onsuccess = function () {
		var result = request.result;
		if (result !== undefined) {
			globalEpisodio = result.episodio;
			callback();
		}else{
			globalEpisodio = '0';
			callback();
		}
	};
}

/*GUARDAR LOCALIZACION GPS*/
var last_lat=0, last_lon=0, acquiring=0; 
function storeGps(callback){
	distance = haversineDistance([last_lat,last_lon], [lat,lon]);
	if
	(
		(
			(distance > 5)         /*distancia minima entre un punto y otro para que sea guardado el registro*/
			&&
			(distance < 200)	   /*metros maximos que se consideran para guardar un registro y evitar saltos*/
			&&
			(acc < 20)			   /*minima presicioón para guardar un registro*/
		)
		||
		(acquiring < 25)           /*numero de registros que se guardan mientras se aqquiere la señal*/
	){
		//console.log('STORAGE: distancia: '+distance+'  precision: '+acc+' adquiriendo: '+acquiring );
		token(function(token){
			var active = dataBase.result;
			var data = active.transaction(["gps"], "readwrite");
			var object = data.objectStore("gps");
			var time = new Date();
			
			if(
				(typeof(acc) == "undefined")&&
				(typeof(lat) == "undefined")&&
				(typeof(lon) == "undefined")
			){console.log('indexedDB Ln 371 variables de geolocalizacion sin definir');}
			
			object.put({
				latitud:	lat,
				longitud:   lon,
				tiempo:	    time.toMysqlFormat(),
				serie:	    serie,
				acurate:	acc,
				cc:    haversineDistance([last_lat,last_lon], [lat,lon]),
				token:		token
			});
			++acquiring;
		});
	}else{
		//console.log('UNSTORAGE: distancia: '+distance+'  precision: '+acc+' adquiriendo: '+acquiring);
	}
	callback();
}

/*ELIMINAR UNA CLAVE PROCESADA*/
function eliminarClave(id,db){
	var active = dataBase.result;
	var data = active.transaction([db], "readwrite");
	var object = data.objectStore(db);
    object.delete(id);
}

function eliminarClaveByToken(token,db){
	var active = dataBase.result;
	var data = active.transaction([db], "readwrite");
	var object = data.objectStore(db);
	var index = object.index("by_token");
	var request = index.get(token);
	request.onsuccess = function () {
		var registro = request.result;
			if(registro != undefined){
				eliminarClave(registro.id,db);
			}
	}
}

function deleteDatabase(dbname) {
    var request = window.indexedDB.deleteDatabase(dbname);
}
startDB();
