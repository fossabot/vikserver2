"use-strict";
let deps=["jqueryUI", "handlebars", "core/index.css", "lang/lang.js"];
load(deps).then(a=>{
    loadLang().then(()=>{
        load("core/index.js");
    });
});
if('serviceWorker' in navigator){
    load("core/swctl.js").then(()=>{
        window.swctl=new Swctl({sw: "sw.js", scope: "."});
        swctl.setSync("update_db");
    });
}
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
		if(navigator.onLine!=true) return $("[data-sync='icono']").html("cloud_off").removeClass("girar");
		window.sync=cryptoJS.decidir_sync();
		Promise.all([window.sync]).then(a=>{
			$("[data-sync='icono']").removeClass("girar").html("cloud_done");
			if(a[0]==false) return;
			window.main.home.recargar();
		}).catch(e=>{
			if(e.name=="offline"){
				return $("[data-sync='icono']").removeClass("girar").html("cloud_off");
			}
			$("[data-sync='icono']").removeClass("girar").html("error");
			console.error(e);
			vex.dialog.alert(e.toString());
		});
		return window.sync;
	}
	público(a,b){
		return new Promise((resolver, rechazar)=>{
			cryptoJS.firmar(b).then(c=>{
				return socketctl.enviarEncriptado({tipo: b,msg:{data: c, usuario: b.usuario}}).then(d=>{
					if(d.status) return resolver(d);
					if(d.err) return rechazar(d.err);
					return resolver(d);
				});
			});
		});
	}
}

window.Main=main;
