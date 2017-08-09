"use-strict";
let deps=["jqueryUI", "bootstrap", "core/index.css"];
load(deps).then(a=>{
	load("core/index.js");
});
class main{
	constructor(a){
		this.in=a;
		cryptoJS.desencriptar_db().then(b=>{
			this.home=b;
			this.init();
		});
	}
	init(){
		console.log(this.home.plantilla);
		$("#visor").html(this.home.principal);
		Eventos.login_ok();
	}
}
class Eventos{
	static login_ok(){
		Materialize.toast("Parece que esta página no está lista. El desarrollador está trabajando en ello ;)");
		//Aquí los eventos de los enlaces
	}
}
window.Main=main;
