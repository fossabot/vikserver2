load(["core/db.js", "core/socketctl.js", "sha256"]);
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
					vex.dialog.alert({
						message: "Se registrará a "+a+" cuando pulses 'Registrarse'",
						callback: ()=>$("#login-contraseña").removeAttr("disabled").focus()
					});
					$("#login-login").hide("fold", 200, ()=>{
						$("#login-registro").show("fold", 200);
					});
					$("#login-registro").show("fold", 200).removeAttr("disabled");
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
		vex.dialog.alert("Debes de introducir la contraseña");
		return;
	}
	credenciales.contraseña=sha256(credenciales.contraseña);
	if($("#login-login").attr("data-login")=="local"){
		cryptoJS.auth(credenciales).then(a=>{
			if(a){
				vex.dialog.alert("Login realizado correctamente");
			}else{
				vex.dialog.alert("La contraseña que has introducido no es válida, prueba de nuevo");
				$("#login-usuario").change();
			}
		});
	}else{
		cryptoJS.authOnline(credenciales).then(a=>{
			if(a!=true){
				
			}
		}).catch(e=>{
			vex.dialog.alert(e);
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
		vex.dialog.alert("Debes de introducir una contraseña");
		return;
	}
	credenciales.contraseña=sha256(credenciales.contraseña);
	cryptoJS.registrar(credenciales).then(()=>{
		vex.dialog.alert("Registrado correctamente, en un momento estarás en tu cuenta");
	}).catch(e=>{
		console.error(e);
		vex.dialog.alert("No hemos podido registrar tu cuenta, perdona las molestias");
		console.log("Error al intentar introducir al nuevo usuario en la base de datos");
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
