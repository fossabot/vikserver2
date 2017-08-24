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
		this.sync();
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
	sync(){
		$("[data-sync='indicador']").parent().show(200);
		$("[data-sync='icono']").html("autorenew").addClass("girar");
		window.sync=cryptoJS.decidir_sync();
		Promise.all([window.sync]).then(()=>{
			$("[data-sync='icono']").removeClass("girar").html("cloud_done");
		}).catch(e=>{
			$("[data-sync='icono']").removeClass("girar").html("error");
			console.error(e);
			vex.dialog.alert(e.toString());
		});
		return window.sync;
	}
}

window.Main=main;
