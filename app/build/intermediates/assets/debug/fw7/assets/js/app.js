// Initialize app
var myApp = new Framework7({
    swipeBackPage: !1,
    pushState: false,
	pushStatePreventOnLoad: true,
    swipePanel: "left",
    modalTitle: "Title",
	uniqueHistory: true,
	precompileTemplates: true
}), $$ = Dom7;

myApp.base 				= 	Template7.compile($$('#base').html());
myApp.inicio 			= 	Template7.compile($$('#inicio').html());
myApp.acudir 			= 	Template7.compile($$('#acudir').html());

myApp.tipo_viaje 		= 	Template7.compile($$('#tipo_viaje').html());
	myApp.viaje_tiempo 	= 	Template7.compile($$('#viaje_tiempo').html());
	myApp.viaje_km 		= 	Template7.compile($$('#viaje_km').html());
	myApp.viaje_tab 	= 	Template7.compile($$('#viaje_tab').html());

myApp.tipo_viaje_sitio 	= 	Template7.compile($$('#tipo_viaje_sitio').html());
	myApp.sitio_tiempo 	= 	Template7.compile($$('#sitio_tiempo').html());
	myApp.sitio_km 		= 	Template7.compile($$('#sitio_km').html());
	myApp.sitio_tab 	= 	Template7.compile($$('#sitio_tab').html());

myApp.abordo  			= 	Template7.compile($$('#abordo').html());
myApp.escala 			= 	Template7.compile($$('#escala').html());
myApp.regreso 			= 	Template7.compile($$('#regreso').html());
myApp.elegir_base 		= 	Template7.compile($$('#elegir_base').html());
myApp.cambio_ruta 		= 	Template7.compile($$('#cambio_ruta').html());
myApp.abandono 			= 	Template7.compile($$('#abandono').html());
myApp.choice_car 		= 	Template7.compile($$('#choice_car').html());

myApp.indicadores 		= 	Template7.compile($$('#indicadores').html());

var mainView = myApp.addView(".view-main", {dynamicNavbar: !0});

/*FUNCIONES COMUNES*/
function loadTemplate(template, returned){
	var html = '';
	eval("html = myApp." + template + "({origen: '" + returned + "' })");
	mainView.loadContent(html);
	setPage(template, returned);
	eval(scheme_movil + "();");
}
function loadTemplateWOR1(template, returned){
	var html = '';
	eval("html = myApp." + template + "({origen: '" + returned + "' })");
	mainView.loadContent(html);
	setPageWOR1(template, returned);
	eval(scheme_movil + "();");
}
function loadUpdatedTemplate(template,returned){
	var html = '';
	eval("html = myApp." + template + "({origen: '" + returned + "' })");
	mainView.loadContent(html);
	updatePage(template, returned);
	setStartPage();
	eval(scheme_movil + "();");
}
/**********************************************************************************************************************************************SELECT CAR**/
$$("body").on("click", ".select_car", function() {
	id_operador_unidad = $(this).attr('data-car');
	$.ajax({
		url: url_app + 'mobile/setIdOperadorUnidad',
		type: 'POST',
		dataType: "json",
		crossDomain : true,
				beforeSend: function() {
                    $('.loader_animation').show();
                },
                complete:function() {
                    $('.loader_animation').hide();
                },
		data: 'id_operador_unidad='+id_operador_unidad+'&session_id='+session_id,
		success: function(respuesta){
			if (respuesta['resp'] == true) {
				storeClave('C1','C1','F11','NULL','NULL','NULL',function(){
					var mvhc = 1;
					loadTemplateWOR1('regreso');
				});
			}else{
				myApp.alert('Intente seleccionar la unidad cuando tenga datos APP1', 'Sin conexión');
			}
		}, 
		error: function(){
			myApp.alert('Intente seleccionar la unidad cuando tenga datos APP2', 'Sin conexión');
		}
	});
});
/**********************************************************************************************************************************************CANCELACIONES**/
$$("body").on("click", ".a14", function() {
	loadUpdatedTemplate('abandono', $(".a14").attr('data-return'));
});

$$("body").on("click", ".return", function() {
	loadUpdatedTemplate($(".return").attr('data-origen'),'NULL');
});

/**********************************************************************************************************************************************ESCALAS**/
$$("body").on("click", ".c10", function() {
	storeClave('C10','C1','C8','A15','C10','NULL',function(){
		loadUpdatedTemplate('escala', $(".c10").attr('data-return'));
		empezarTimer();	
	});
	
});
$$("body").on("click", ".c11", function() {
	storeClave('C11','C1','C11','NULL','NULL','NULL',function(){	
		detenerTimer();
		loadUpdatedTemplate($(".c11").attr('data-origen'),'NULL');
	});	
});

$$("body").on("click", ".c10_sitio", function() {
	storeClave('C10','C1','F13','A15','C10','NULL',function(){	
		loadUpdatedTemplate('escala', $(".c10_sitio").attr('data-return'));
		empezarTimer();
	});	
});
$$("body").on("click", ".c11_sitio", function() {
	storeClave('C11','C1','C11','NULL','NULL','NULL',function(){	
		detenerTimer();
		loadUpdatedTemplate($(".c11_sitio").attr('data-origen'),'NULL');
	});	
});

/**********************************************************************************************************************************************INICIO**/
$$("body").on("click", ".c1", function() {
	initEpisodioAuto();
});
function initEpisodioAuto(){
	storeClave('C1','C1','F11','NULL','NULL','NULL',function(){
		loadTemplateWOR1('regreso');
	});	
}
/************************************************************************************************************************************************BASE**/
$$("body").on("click", ".c2", function() {
    myApp.confirm('','¿Está seguro de cerrar el episodio?', function () {
		getBase(function () {
			storeClave('C2','C2',globalBase,'NULL','NULL','NULL',function(){
				setStoreVariable('base','',function(){
					finalizar_servicio();
				});
				$('#data_cordon').html('NO HAY DATOS DE CORDON');
			});
		});
    });
});
$$("body").on("click", ".a10", function() {
	storeClave('A10','C1','A10','NULL','NULL','NULL',function(){
		loadTemplate('acudir');
		//loadTemplate('regreso');
	});
});
$$("body").on("click", ".f13", function() {
	storeClave('F13','C1','F13','NULL','NULL','NULL',function(){
		loadTemplate('tipo_viaje_sitio');
		//loadTemplate('regreso');
	});
});

/**********************************************************************************************************************************************ACUDIR**/
$$("body").on("click", ".a11", function() {
	storeClave('A11','C1','A11','NULL','NULL','NULL',function(){
		loadTemplate('abordo');
	});
});
$$("body").on("click", ".c6", function() {
	myApp.confirm('','¿Está seguro de cancelar el servicio?', function () {
		storeClave('C6','C1','C6','F11','NULL','NULL',function(){
			loadTemplate('regreso');
		});
	});
});

/**********************************************************************************************************************************************ABORDO**/
$$("body").on("click", ".c8", function() {
	storeClave('C8','C1','C8','NULL','NULL','NULL',function(){
		loadTemplate('tipo_viaje');
	});
});

/***********************************************************************************************************************************************TIPO DE VIAJE**/
$$("body").on("click", ".a15", function() {
	myApp.confirm('','Selección: Viaje por Kilometro', function () {
		storeClave('A15','C1','C8','A15','NULL','NULL',function(){
			loadTemplate('viaje_km');
		});
	});
});
$$("body").on("click", ".a2", function() {
	myApp.confirm('','Selección: Viaje por Tiempo', function () {
		var time = new Date(new Date().toISOString().slice(0, 19)+'+0600').toISOString().slice(11, 19).replace('T', ' ');
		storeClave('A2','C1','C8','A2','NULL',time,function(){
			loadTemplate('viaje_tiempo');
			empezarTimer();
		});
	});
});
$$("body").on("click", ".a16", function() {
	myApp.confirm('','Selección: Viaje Tabulado', function () {
		storeClave('A16','C1','C8','A16','NULL','NULL',function(){
			loadTemplate('viaje_tab');
		});
	});
});

/*******************************************************************************************************************************************VENTANAS DE VIAJE**/
$$("body").on("click", ".c14", function() {
	myApp.confirm('','¿Desea establecer este punto como destino parcial?', function () {
		storeClave('C14','C1','C8','C14','NULL','NULL',function(){
			myApp.alert('', 'Se estableció el destino parcial');
		});
	});
});
$$("body").on("click", ".c12", function() {
	loadUpdatedTemplate('cambio_ruta',$(".c12").attr('data-return'));
});


/*****************************************************************************************************************************************TIPO DE VIAJE SITIO**/
$$("body").on("click", ".a15_sitio", function() {
	myApp.confirm('','Selección: Viaje por Kilometro', function () {
		storeClave('A15','C1','F13','A15','NULL','NULL',function(){
			loadTemplate('sitio_km');
		});
	});
});
$$("body").on("click", ".a2_sitio", function() {
	myApp.confirm('','Selección: Viaje por Tiempo', function () {
		var time = new Date(new Date().toISOString().slice(0, 19)+'+0600').toISOString().slice(11, 19).replace('T', ' ');
		storeClave('A2','C1','F13','A2','NULL',time,function(){
			loadTemplate('sitio_tiempo');
			empezarTimer();
		});
	});
});
$$("body").on("click", ".a16_sitio", function() {
	myApp.confirm('','Selección: Viaje Tabulado', function () {
		storeClave('A16','C1','F13','A16','NULL','NULL',function(){
			loadTemplate('sitio_tab');
		});
	});
});

/********************************************************************************************************************************************VENTANAS DE SITIO**/
$$("body").on("click", ".c14_sitio", function() {
	storeClave('C14','C1','F13','C14','NULL','NULL',function(){
		myApp.alert('', 'Restan 4 Destinos');
	});
});

/***************************************************************************************************************************COMUN VIAJE SITIO y VIAJE**/
$$("body").on("click", ".c9", function() {
	myApp.confirm('','¿Confirma la finalización de este servicio?', function () {
		storeClave('C9','C1','C9','F11','NULL','NULL',function(){
			setEpisodio(function(){clearTravel();});
			deleteRide(function(){
				$('#data_viaje').html('');
				loadTemplate('regreso');	
			});
		});
	});
});

/*********************************************************************************************************************************************REGRESO**/
$$("body").on("click", ".f15", function() {
	storeClave('F15','C1','F15','NULL','NULL','NULL',function(){
		loadTemplate('tipo_viaje_sitio');
	});
});
$$("body").on("click", ".f14", function() {
	loadUpdatedTemplate('elegir_base',$(".f14").attr('data-return'));
});
$$("body").on("click", ".a19", function() {
	storeClave('A19','C1','A19','NULL','NULL','NULL',function(){
		loadTemplate('acudir');
	});
});

/***********************************************************************************************************************************SELECCION DE BASE**/
$$("body").on("click", ".elegir_base1", function() {
	myApp.confirm('Confirme la selección de la base','Base KPMG', function () {
		setStoreVariable('base','B1',function(){
			storeClave('F14','C1','B1','F14','NULL','NULL',function(){
				$("#request_queue_act").hide();
				$("#request_queue_des").show();
				updatePageButtons('request_queue_act','request_queue_des');
				loadUpdatedTemplate('regreso','NULL');
				myApp.alert('','Solicitud en proceso');
			});
		});
	});
});
$$("body").on("click", ".elegir_base2", function() {
	myApp.confirm('Confirme la selección de la base','Base Ejercito Nacional', function () {
		setStoreVariable('base','B2',function(){
			storeClave('F14','C1','B2','F14','NULL','NULL',function(){
				$("#request_queue_act").hide();
				$("#request_queue_des").show();
				updatePageButtons('request_queue_act','request_queue_des');
				loadUpdatedTemplate('regreso','NULL');
				myApp.alert('','Solicitud en proceso');
			});
		});
	});
});

/*************************************************************************************************************************************CAMBIOS DE RUTA**/
$$("body").on("click", ".cambio_ruta1", function() {
	storeClave('C12','C1','C8','C12','NULL','Trafico',function(){
		loadUpdatedTemplate($(".cambio_ruta1").attr('data-origen'),'NULL');
		$("#cambio_ruta_act").hide();
		$("#cambio_ruta_des").show();
		updatePageButtons('cambio_ruta_act','cambio_ruta_des');
	});
});
$$("body").on("click", ".cambio_ruta2", function() {
	storeClave('C12','C1','C8','C12','NULL','Manifestacion',function(){
		loadUpdatedTemplate($(".cambio_ruta2").attr('data-origen'),'NULL');
		$("#cambio_ruta_act").hide();
		$("#cambio_ruta_des").show();
		updatePageButtons('cambio_ruta_act','cambio_ruta_des');
	});
});
$$("body").on("click", ".cambio_ruta3", function() {
	storeClave('C12','C1','C8','C12','NULL','Calle cerrada',function(){
		loadUpdatedTemplate($(".cambio_ruta3").attr('data-origen'),'NULL');
		$("#cambio_ruta_act").hide();
		$("#cambio_ruta_des").show();
		updatePageButtons('cambio_ruta_act','cambio_ruta_des');
	});
});
$$("body").on("click", ".cambio_ruta4", function() {
	storeClave('C12','C1','C8','C12','NULL','Otro',function(){
		loadUpdatedTemplate($(".cambio_ruta4").attr('data-origen'),'NULL');
		$("#cambio_ruta_act").hide();
		$("#cambio_ruta_des").show();
		updatePageButtons('cambio_ruta_act','cambio_ruta_des');
	});
});

/*******************************************************************************************************************************************ABANDONOS**/
$$("body").on("click", ".abandono1", function() {
	myApp.confirm('Se cerrará el episodio y se cancelará cualquier servicio','¿Está seguro de abandonar?', function () {
		storeClave('A14','C2','A14','NULL','NULL','Fuerza mayor',function(){
			finalizar_servicio()
		});
	});
});
$$("body").on("click", ".abandono2", function() {
	myApp.confirm('Se cerrará el episodio y se cancelará cualquier servicio','¿Está seguro de abandonar?', function () {
		storeClave('A14','C2','A14','NULL','NULL','Falla mecanica',function(){
			finalizar_servicio()
		});
	});
});
$$("body").on("click", ".abandono3", function() {
	myApp.confirm('Se cerrará el episodio y se cancelará cualquier servicio','¿Está seguro de abandonar?', function () {
		storeClave('A14','C2','A14','NULL','NULL','Cambio neumatico',function(){
			finalizar_servicio()
		});
	});
});
$$("body").on("click", ".abandono4", function() {
	myApp.confirm('Se cerrará el episodio y se cancelará cualquier servicio','¿Está seguro de abandonar?', function () {
		storeClave('A14','C2','A14','NULL','NULL','Policia transito',function(){
			finalizar_servicio()
		});
	});
});
$$("body").on("click", ".abandono5", function() {
	myApp.confirm('Se cerrará el episodio y se cancelará cualquier servicio','¿Está seguro de abandonar?', function () {
		storeClave('A14','C2','A14','NULL','NULL','Otro',function(){
			finalizar_servicio()
		});
	});
});
function dOut(){
	setInitPage('regreso_init',function(){
		pusher.disconnect();
		window.location ='file:///android_asset/login.html';
	});
}
function finalizar_servicio(){
	startSync(function(){
		$.ajax({
			url: url_app + 'login/salirAndroid',
			type: 'POST',
			dataType: "json",
				beforeSend: function() {
                    $('.loader_animation').show();
                },
                complete:function() {
                    $('.loader_animation').hide();
                },
			data: 'id_usuario='+id_usuario,
			success: function(respuesta){
				if(respuesta[0].resp='correcto'){
					dOut();
				}else{
					myApp.alert('Intente finalizar el servicio cuando tenga datos', 'Sin conexión');
				}
			}, 
			error: function(){
				myApp.alert('Intente finalizar el servicio cuando tenga datos', 'Sin conexión');
			}
		});
	});
}

var scheme_movil = "esquema_verde";
function esquema_verde(){
	$('.navbar-inner, .toolbar-inner, .line').css({'background-color':'#000000','color':'#FFFFFF'});
	$('.menu-link').css('background','rgba(3, 163, 136, 0.5)');
	$('.code_disabled').css('background','rgba(83, 214, 190, 0.2)');
	$('.original_scheme').css({'background':'#08957D','color':'#FFFFFF'});
	$('a').css({'color':'#08957D'});
	$('.list-block ul').css({'background':'#3E3E3E'});

	
	$('a.original_scheme').css({'color':'#FFFFFF'});
	$('.page-content').css('background-color','#0E0E0E');
	$('.menu-link > span:first-child').css({'color':'#FFFFFF','font-size':'30px','line-height':'120px'});
	$('.menu-link > span:last-child').css({'color':'#FFFFFF','font-size':'0.8em','line-height':'15px'});
	$('.code_disabled > span:first-child').css({'color':'#FFFFFF','font-size':'30px','line-height':'120px'});
	$('.code_disabled > span:last-child').css({'color':'#FFFFFF','font-size':'0.8em','line-height':'15px'});
	
	$('.pop_cordon').css({'background':'#000000'});
	$('.close_pop').css({'color':'#03A388'});
	$('.user-tail').css({'background-color':'#03A388'});
	$('.cordon_name').css({'color':'#FFFFFF','font-size':'1em','margin-top':'-55px'});
	$('.circle_back').css({'background-color':'#000000','line-height':'1'});
	$(".avatar_tail").attr("src", "file:///android_asset/fw7/assets/img/driver-green.svg");
}
function esquema_rojo(){
	$('.navbar-inner, .toolbar-inner, .line').css({'background-color':'rgba(140, 0, 0, 1)','color':'#FFFFFF'});
	$('.menu-link').css('background','rgba(140, 5, 5, 0.93)');
	$('.code_disabled').css('background','rgba(185, 42, 42, 0.32)');
	$('.original_scheme').css({'background':'rgba(140, 0, 0, 1)','color':'#FFFFFF'});
	$('a').css({'color':'rgba(140, 0, 0, 1)'});
	$('.list-block ul').css({'background':'#000000'});
	
	$('a.original_scheme').css({'color':'#FFFFFF'});
	$('.page-content').css('background-color','#0E0E0E');
	$('.menu-link > span:first-child').css({'color':'#FFFFFF','font-size':'30px','line-height':'120px'});
	$('.menu-link > span:last-child').css({'color':'#FFFFFF','font-size':'0.8em','line-height':'15px'});
	$('.code_disabled > span:first-child').css({'color':'#FFFFFF','font-size':'30px','line-height':'120px'});
	$('.code_disabled > span:last-child').css({'color':'#FFFFFF','font-size':'0.8em','line-height':'15px'});
	
	$('.pop_cordon').css({'background':'#CCCCCC'});
	$('.close_pop').css({'color':'#8C0000'});
	$('.user-tail').css({'background-color':'#8C0000'});
	$('.cordon_name').css({'color':'#FFFFFF','font-size':'1em','margin-top':'-55px'});
	$('.circle_back').css({'background-color':'#CCCCCC','line-height':'1'});
	$(".avatar_tail").attr("src", "file:///android_asset/fw7/assets/img/driver-red.svg");
}
function esquema_naranja(){
	$('.navbar-inner, .toolbar-inner, .line').css({'background-color':'rgba(255, 108, 0, 1)','color':'#FFFFFF'});
	$('.menu-link').css('background','rgba(255, 108, 0, 0.6)');
	$('.code_disabled').css('background','rgba(255, 108, 0, 0.2)');
	$('.original_scheme').css({'background':'rgba(255, 108, 0, 1)','color':'#FFFFFF'});
	$('a').css({'color':'rgba(255, 108, 0, 1)'});
	$('.list-block ul').css({'background':'#3E3E3E'});
	
	$('a.original_scheme').css({'color':'#FFFFFF'});
	$('.page-content').css('background-color','#0E0E0E');
	$('.menu-link > span:first-child').css({'color':'#FFFFFF','font-size':'30px','line-height':'120px'});
	$('.menu-link > span:last-child').css({'color':'#FFFFFF','font-size':'0.8em','line-height':'15px'});
	$('.code_disabled > span:first-child').css({'color':'#FFFFFF','font-size':'30px','line-height':'120px'});
	$('.code_disabled > span:last-child').css({'color':'#FFFFFF','font-size':'0.8em','line-height':'15px'});
	
	$('.pop_cordon').css({'background':'#000000'});
	$('.close_pop').css({'color':'#FF6C00'});
	$('.user-tail').css({'background-color':'#FF6C00'});
	$('.cordon_name').css({'color':'#FFFFFF','font-size':'1em','margin-top':'-55px'});
	$('.circle_back').css({'background-color':'#CCCCCC','line-height':'1'});
	$(".avatar_tail").attr("src", "file:///android_asset/fw7/assets/img/driver-orange.svg");
}
function esquema_azul(){
	$('.navbar-inner, .toolbar-inner, .line').css({'background-color':'rgb(0, 46, 150)','color':'#FFFFFF'});
	$('.menu-link').css('background','rgba(39, 94, 249, 0.6)');
	$('.code_disabled').css('background','rgba(39, 94, 249, 0.2)');
	$('.original_scheme').css({'background':'rgb(0, 46, 150)','color':'#FFFFFF'});
	$('a').css({'color':'rgb(0, 46, 150)'});
	$('.list-block ul').css({'background':'#D9E2EC'});
	
	$('a.original_scheme').css({'color':'#FFFFFF'});
	$('.page-content').css('background-color','#0E0E0E');
	$('.menu-link > span:first-child').css({'color':'#FFFFFF','font-size':'30px','line-height':'120px'});
	$('.menu-link > span:last-child').css({'color':'#FFFFFF','font-size':'0.8em','line-height':'15px'});
	$('.code_disabled > span:first-child').css({'color':'#FFFFFF','font-size':'30px','line-height':'120px'});
	$('.code_disabled > span:last-child').css({'color':'#FFFFFF','font-size':'0.8em','line-height':'15px'});
	
	$('.pop_cordon').css({'background':'#D9E2EC'});
	$('.close_pop').css({'color':'#002E96'});
	$('.user-tail').css({'background-color':'#002E96'});
	$('.cordon_name').css({'color':'#FFFFFF','font-size':'1em','margin-top':'-55px'});
	$('.circle_back').css({'background-color':'#D9E2EC','line-height':'1'});
	$(".avatar_tail").attr("src", "file:///android_asset/fw7/assets/img/driver-blue.svg");
}
function esquema_contraste(){
	$('.navbar-inner, .toolbar-inner, .line').css({'background-color':'rgb(0, 0, 0)','color':'#FFFFFF'});
	$('.menu-link').css('background','rgba(0, 0, 0, 1)');
	$('.code_disabled').css('background','rgba(0, 0, 0, 0.5)');
	$('.original_scheme').css({'background':'rgb(0, 0, 0)','color':'#FFFFFF'});
	$('a').css({'color':'rgb(0, 0, 0)'});
	$('.list-block ul').css({'background':'#FFFFFF'});
	
	$('a.original_scheme').css({'color':'#FFFFFF'});
	$('.page-content').css('background-color','#FFFFFF');
	$('.menu-link > span:first-child').css({'color':'#FFFFFF','font-size':'50px','line-height':'70px'});
	$('.menu-link > span:last-child').css({'color':'#FFFFFF','font-size':'20px','line-height':'20px'});
	$('.code_disabled > span:first-child').css({'color':'#FFFFFF','font-size':'50px','line-height':'70px'});
	$('.code_disabled > span:last-child').css({'color':'#FFFFFF','font-size':'20px','line-height':'20px'});
		
	$('.pop_cordon').css({'background':'#FFFFFF'});
	$('.close_pop').css({'color':'#c9c9c9'});
	$('.user-tail').css({'background-color':'#E0E0E0'});
	$('.cordon_name').css({'color':'#000000','font-size':'1.4em','margin-top':'-70px'});
	$('.circle_back').css({'background-color':'#FFFFFF','line-height':'1.2'});
	$(".avatar_tail").attr("src", "file:///android_asset/fw7/assets/img/driver-black.svg");
}
$$("body").on("click", ".esquema_verde", function() {
	esquema_verde();
	scheme_movil = "esquema_verde";
});
$$("body").on("click", ".esquema_rojo", function() {
	esquema_rojo();
	scheme_movil = "esquema_rojo";

});
$$("body").on("click", ".esquema_naranja", function() {
	esquema_naranja();
	scheme_movil = "esquema_naranja";
	
});
$$("body").on("click", ".esquema_azul", function() {
	esquema_azul();
	scheme_movil = "esquema_azul";
});
$$("body").on("click", ".esquema_contraste", function() {
	esquema_contraste();
	scheme_movil = "esquema_contraste";
});
