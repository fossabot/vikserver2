load(["core/db.js", "core/socketctl.js", "sha256"]);
$("#motd").text("Registrarte... fácil como nunca: introduce un nombre de usuario y una contraseña...");
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
					vex.dialog.alert("Se registrará a "+a+" cuando pulses 'Registrarse'");
					$("#login-login").hide("fold", 200, ()=>{
						$("#login-registro").show("fold", 200);
					});
					$("#login-registro").show("fold", 200).removeAttr("disabled");
				}
			});
		}
	});
});
$("#login-login").on("click", event=>{
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
		cryptoJS.auth(credenciales);
	}else{
		cryptoJS.authOnline(credenciales);
	}
});

class online{
	constructor(a){
		this.in=a;
	}
	static chk(a){
		return socketctl.enviar({tipo: "chk", msg: a});
	}
}
