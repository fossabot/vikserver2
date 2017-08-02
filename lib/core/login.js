load(["core/db.js"]);
$("#motd").text("Registrarte... fácil como nunca: introduce un nombre de usuario y una contraseña...");
$("#login-usuario").on("change", event=>{
	let a=$(event.target).val();
	if(a==null || a==undefined) return;
	let chk=dbjs.chk(a);
	if(chk){
		
	}
});
