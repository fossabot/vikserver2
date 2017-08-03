load(["core/db.js", "core/socketctl.js"]);
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
			$("#login-login").removeAttr("disabled").show("fold", 200);
			$("#login-registro").hide("fold", 200).attr("disabled", "disabled");
		}else{
			online.chk(a).then(b=>{
				if(b){
					$("#login-login").removeAttr("disabled").show("fold", 200);
					$("#login-registro").hide("fold", 200).attr("disabled", "disabled");
				}else{
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
class online{
	constructor(a){
		this.in=a;
	}
	static chk(a){
		return socketctl.enviar({tipo: "chk", msg: a});
	}
}
