"use-strict";
let deps=["jqueryUI", "core/index.css", "lang/lang.js"];
load(deps).then(a=>{
    loadLang().then(()=>{
        load("core/index.js");
    });
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
		this.home.Eventos.login_ok();
	}
}

window.Main=main;
