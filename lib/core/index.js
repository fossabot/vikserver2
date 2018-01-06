"use-strict";
load("core/clases.js");
load("vex").then(a=>{
	vex.defaultOptions.className="vex-theme-plain";
});
$(".reemplazar").each((k, v)=>{
	let este=$(v);
	html=este.html();
	Object.keys(lang.index).forEach(a=>{
		let rx=new RegExp("__"+a+"__", "g");
		html=html.replace(rx, lang.index[a]);
	});
	este.html(html);
});
fetch("cont/modal-ajustes.html").then(a=>a.text()).then(a=>{
	$("#modal-ajustes").remove();
	$("#contenedor-modales").append(a);
	window.langItems.modals.ajustes=new Vue({
		el: "#modal-ajustes",
		data: window.lang
	});
	new Materialize.Modal($("#modal-ajustes"));
	let loading="<div class='progress color-secundario claro' style='display: none;'><div class='indeterminate color-secundario oscuro'></div></div>";
	$(".tarjeta-ajustes").parent().append(loading);
	return Ajustes.Eventos();
});
$("#menu-opciones")
	.empty()
	.append("<li class='btn-floating sub-boton' id='menu-iniciar_sesión'><i class='material-icons'>person</i></li>")
	.append('<li class="btn-floating sub-boton"><a href="https://github.com/vikserver/vikserver2" target="_blank" rel="noopener"><i class="material-icons">code</i></a></li>');
$("#menu-iniciar_sesión").on("click", ()=>{
	$("#index-menu").closeFAB();
	Vik.get("cont/login.html").then(a=>{
		$("#visor").html(a).show(200);
		window.langItems.visor=new Vue({
			el: "#visor",
			data: window.lang.loginForm
		});
		load(["core/login.js", "core/login.css"]);
	}).catch(e=>{
		console.error(e);
		throw new Error(window.lang.errors.login_page);
	});
});
class Spin{
	constructor(a){
		this.id=Number(String(Math.random()).substr(2, 4));
		this.elementos={
			html: "<div class='spin' style='display: none;' data-spin-id='"+this.id+"'></div>",
			objetivo: $(a)
		}
		this.elementos["spinner"]=this.elementos.objetivo.append(this.elementos.html).children("[data-spin-id='"+this.id+"']");
		this.elementos.spinner.animate({
			height: Number($(window).height() * 0.05),
			width: Number($(window).height() * 0.05)
		}, 2);
	}
	iniciar(){
		this.elementos.spinner.show(100, "linear");
	}
	parar(){
		this.elementos.spinner.hide(100, "linear");
	}
}
window.Spin=Spin;
load("typedJS").then(()=>{
	new Typed("#motd", {
		strings: window.lang.motd,
		typeSpeed: 50,
		backSpeed: 50,
		smartBackspace: true,
		showCursor: false,
		oncomplete: ()=>{$("#motd").hide();}
	});
});
class Ajustes{
	static async Eventos(){
		let X=await load(["dexie"]);
		$(".targeta-ajustes").on("click", function(){
			$(this).parent().children("div").show(200);
		});
		$("#ajustes-eliminar_db").on("click", event=>{
			return load("dexie")
				.then(X=>{
					if(typeof swctl !="undefined"){
						swctl.db.close();
					}
				})
				.then(X=>{return Dexie.delete("vikserver")})
				.then(X=>{
					Materialize.toast(lang.settings.db_deleted, 4000);
					$(event.target).parent().children("div").hide(200);
			});
		});
		$("#ajustes-cache_reset").on("click", event=>{
			if(typeof swctl =="undefined"){
				$(event.target).parent().children("div").hide(200);
				return Materialize.toast(self.lang.alert.nosw);
			}
			return swctl.cachectl.delete().then(()=>{
				Materialize.toast(lang.settings.cache_reset_ok, 4000);
				$(event.target).parent().children("div").hide(200);
			});
		});
		$("#ajustes-eliminar_datos").on("click", event=>{
			return load("dexie").then(X=>{
					let tsk=[];
					if(typeof swctl !="undefined"){
						tsk.push(swctl.db.close());
						tsk.push(swctl.cachectl.delete());
					}
					tsk.push(Vik.storage().deleteAll());
					tsk.push(Dexie.delete("vikserver"));
					return Promise.all(tsk);
				})
				.then(X=>{
					if(typeof swctl =="undefined"){
						return Promise.resolve();
					}
					return swctl.unregister();
				})
				.then(X=>{
					Materialize.toast(lang.settings.delete_ok, 4000);
					$(event.target).parent().children("div").hide(200);
				}
			);
		});
	}
}
