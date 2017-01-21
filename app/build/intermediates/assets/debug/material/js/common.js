function valida_logeo(e,decReq,boton){
	
   	if(valida_enter(e,decReq)==true || boton==1){
   		if($('#usuario').get(0).value==""){
   			showAlert('Olvidó ingresar su nombre de usuario');
   			return false;
   		}else if($('#password').get(0).value==""){
        		showAlert('Olvidó ingresar su contraseña');
        		return false;
        }else{
			$.ajax({
				url: url_app + 'login/logear',
				type: 'POST',
				data: 'usuario='+$('#usuario').val()+"&password="+$('#password').val(),
				dataType: "json",
				crossDomain : true,
				beforeSend: function() {
                    $('#initloader').show();
                    $('#l-login').hide();
                },
                complete:function() {
                    $('#initloader').hide();
                },
				success: function(respuesta){
					if(respuesta[0].resp=='acceso_correcto'){

						if($("#remember").is(':checked') == true){storeCredentials();}else{deleteCredentials();}
						
						if(respuesta[2].via=='incorrecta'){
							showAlert('Sus credenciales son correctas, sin embargo existe un error al identificar su dispositivo');
						}else if(respuesta[2].via=='disabled'){
							showAlert('Inhabilitado temporalmente');
                            $('#l-login').show();
                            $('#l-login').css( "display", "" );
						}else if(respuesta[2].via=='incompleto'){
							showAlert('Su cuenta está incompleta, notifique a su administrador');
                            $('#l-login').show();
                            $('#l-login').css( "display", "" );
						}else{
							if(respuesta[1].dispositivo=='celular'){


                                var id_operador = respuesta[4].id_operador;
                                var serie = respuesta[4].serie;
                                var id_operador_unidad = respuesta[4].id_operador_unidad;
                                var token_session = respuesta[4].token_session;
                                var id_usuario = respuesta[4].id_usuario;
                                var mvhc = respuesta[4].mvhc;
                                var session_id = respuesta[4].session_id;
                                var get = '?id_operador='+id_operador+'&serie='+serie+'&id_operador_unidad='+id_operador_unidad+'&token_session='+token_session+'&id_usuario='+id_usuario+'&mvhc='+mvhc+'&session_id='+session_id+'&url_app='+url_app;

								window.location ='file:///android_asset/index.html' + get;
							}else{
								window.location ='file:///android_asset/error_1.html';
							}
						}
					}
					if(respuesta[0].resp=="acceso_incorrecto"){
						$('#usuario').value="";
						$('#password').value="";
						showAlert('Usuario o contraseña incorrecta');
						$('#l-login').show();
						$('#l-login').css( "display", "" );
					}else if(respuesta[0].resp=="inhabilitado"){
						showAlert('Su cuenta está inhabilitada por exceder el número de intentos de acceso permitidos, notifíquelo a su administrador');  
					    $('#l-login').show();
					    $('#l-login').css( "display", "" );
					}else if(respuesta[0].resp=="violacion_c2"){
						showAlert('El login de su cuenta esta inhabilitado por cerrar la aplicación sin darse por C2, <strong>diríjase a las oficinas centrales</strong>');
					    $('#l-login').show();
					    $('#l-login').css( "display", "" );
					}
				}, 
				error: function(){
				    $('#l-login').show();
                	$('#l-login').css( "display", "" );
				    showAlert('Error de conectividad de red CMMN-02');
				}
			});
		}
	}
}
function hideAlert(){
	$("#l-login").removeClass("hidden");
	$("#alertWindow").addClass("hidden");
}
function showAlert(mensaje){
	$("#l-login").addClass("hidden");
	$("#alertWindow").removeClass("hidden");
	$("#tipalert").html(mensaje);
}
function valida_enter(e, decReq) {
	var key = e.which;
	if (key == 13) {
		return true;
	} else {
		return false;
	}
}