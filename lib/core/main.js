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
			Promise.all([this.home.prog]).then(()=>{
				this.init();
			});
		});
	}
	init(){
		$("#visor").html(this.home.principal);
		Eventos.login_ok();
	}
}
class Eventos{
	static login_ok(){
		Materialize.toast("Esta página está en desarrollo, es posible que este diseño no sea el mismo que el diseño final", 5000);
		$(".collapsible").collapsible();
	}
}
window.Main=main;
