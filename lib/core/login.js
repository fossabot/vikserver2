load(["core/db.js", "core/socketctl.js", "sha256", "core/home.js"]);
window.motd.stop();
window.motd= new Typed("#motd", {
	typeSpeed: 40,
	showCursor: false,
	strings: ["", "Registrarse es...", "tan fácil como nunca! Simplemente pon un usuario y una contraseña", ""],
	backSpeed: 40,
	onComplete: function(){
		$("#motd").hide(200);
	}
});
$("#login-usuario").on("focus", ()=>{
	window.motd.stop();
	window.motd=new Typed("#motd", {
		strings: ["", ""],
		typeSpeed: 10,
		backSpeed: 20,
		showCursor: false,
		onComplete: function(){
			$("#motd").hide(200);
		}
	});
});
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
$("#login-login").on("click", ()=>{
	$("#login-login").attr("disabled", "disabled");
	let credenciales={
		usuario: $("#login-usuario").val(),
		contraseña: $("#login-contraseña").val()
	};
	if(credenciales.contraseña.length<1){
		vex.dialog.alert({
			message: "Debes de introducir la contraseña",
			callback: ()=>$("#login-usuario").change()
		});
		return;
	}
	credenciales.contraseña=sha256(credenciales.contraseña);
	if($("#login-login").attr("data-login")=="local"){
		cryptoJS.auth(credenciales).then(a=>{
			if(a){
				Materialize.toast("Estás dentro!", 1500);
				window.main=new Main();
			}else{
				vex.dialog.alert({
					message: "Según parece esta es una contraseña inválida :(",
					callback: ()=>$("#login-usuario").change()
				});
			}
		});
	}else{
		cryptoJS.authOnline(credenciales).then(a=>{
			console.log(a);
			if(a){
				Materialize.toast("Tras una larga espera, ya estás dentro. En un momento estarás en tu cuenta", 4000);
				window.main=new Main();
			}else{
				vex.dialog.alert({
					message: "Parece que no te recuerdan así en el servidor :/",
					callback: ()=>$("#login-usuario").change()
				});
			}
		}).catch(e=>{
			console.error(e);
			if(e.toString().length<4){
				vex.dialog.alert("Ha surgido un problema y no podemos iniciar sesión... Refresca la página y vuelve a intentarlo");
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
			message: "Seré yo, pero no hay ninguna contraseña :)",
			callback: $("#login-usuario").change()
		});
		return;
	}
	credenciales.contraseña=sha256(credenciales.contraseña);
	cryptoJS.registrar(credenciales).then(()=>{
		Materialize.toast("Bienvenido! Ya hemos terminado de registrarte. No te olvides de la contraseña!!!", 4000);
		window.main=new Main();
	}).catch(e=>{
		console.error(e);
		vex.dialog.alert("No hemos podido registrar tu cuenta, perdona las molestias");
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
