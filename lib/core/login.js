load(["core/db.js", "core/crypto.js", "core/socketctl.js", "sha256", "core/home.js"]);
$("#login-usuario").on("change", event=>{
	let a=$(event.target).val();
	if(a==null || a==undefined|| a==""){
		document.querySelector("#login-contraseña").value="";
		$("#login-contraseña").attr("disabled", "disabled");
		$("#login-login").hide("fold", 200).attr("disabled", "disabled");
		$("#login-registro").hide("fold", 200).attr("disabled", "disabled");
		return;
	}
	let chk=dbjs.chk(a);
	chk.then(b=>{
		$("#login-contraseña").removeAttr("disabled").focus();
		if(b==true){
			$("#login-login").attr("data-login", "local");
			$("#login-login").removeAttr("disabled").show("fold", 200);
			$("#login-registro").hide("fold", 200).attr("disabled", "disabled");
		}else{
			online.chk(a).then(b=>{
				if(b){
					$("#login-login").attr("data-login", "online");
					$("#login-login").removeAttr("disabled").show("fold", 200);
					$("#login-registro").hide("fold", 200).attr("disabled", "disabled");
				}else{
					$("#login-login").attr("data-login", "online");
					Materialize.toast("Se registrará a "+a+" cuando pulses 'Registrarse'", 2000);
					$("#login-login").hide("fold", 200, ()=>{
						$("#login-registro").show("fold", 200);
					});
					$("#login-registro").show("fold", 200).removeAttr("disabled");
					$("#login-contraseña").removeAttr("disabled").focus();
				}
			});
		}
	});
});
$("#login-contraseña").on("keypress", event=>{
	if(event.key=="Enter"){
		$("button[data-login]:not(:disabled)").click();
	}
});
$("#login-login").on("click", ()=>{
	$("#login-login").attr("disabled", "disabled");
	let credenciales={
		usuario: $("#login-usuario").val(),
		contraseña: $("#login-contraseña").val()
	};
	if(credenciales.contraseña.length<1){
		vex.dialog.alert({
			message: window.lang.login.nopass,
			callback: ()=>$("#login-usuario").change()
		});
		return;
	}
	credenciales.contraseña=sha256(credenciales.contraseña);
	if($("#login-login").attr("data-login")=="local"){
		cryptoJS.auth(credenciales).then(a=>{
			if(a){
				Materialize.toast(window.login.ok, 1500);
				window.main=new Main();
			}else{
				vex.dialog.alert({
					message: window.lang.login.pass_nok,
					callback: ()=>$("#login-usuario").change()
				});
			}
		});
	}else{
		cryptoJS.authOnline(credenciales).then(a=>{
			console.log(a);
			if(a){
				Materialize.toast(window.lang.login.ok, 4000);
				window.main=new Main();
			}else{
				vex.dialog.alert({
					message: window.lang.login.user_nok,
					callback: ()=>$("#login-usuario").change()
				});
			}
		}).catch(e=>{
			console.error(e);
			if(e.toString().length<4){
				vex.dialog.alert(window.lang.errors.login_What);
			}else{
				vex.dialog.alert(e.toString());
			}
			$("#login-usuario").change();
		});
	}
});
$("#login-registro").on("click", ()=>{
	$("#login-registro").attr("disabled", "disabled");
	let credenciales={
		usuario: $("#login-usuario").val(),
		contraseña: $("#login-contraseña").val()
	};
	if(credenciales.contraseña.length<1){
		vex.dialog.alert({
			message: window.lang.login.nopass,
			callback: $("#login-usuario").change()
		});
		return;
	}
	credenciales.contraseña=sha256(credenciales.contraseña);
	cryptoJS.registrar(credenciales).then(()=>{
		Materialize.toast(window.lang.login.register_ok, 4000);
		window.main=new Main();
	}).catch(e=>{
		console.error(e);
		vex.dialog.alert(window.error.register);
		console.log("Error al intentar introducir al nuevo usuario en la base de datos");
		$("#login-usuario").change();
	});
});

class online{
	constructor(a){
		this.in=a;
	}
	static chk(a){
		return socketctl.enviar({tipo: "chk", msg: a});
	}
}
