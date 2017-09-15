"use-strict";
class home{
	constructor(a){
		this.db=a;
		this.prog=fetch("cont/home.html").then(a=>a.text()).then(b=>{
			this.plantilla=b;
		});
		this.Eventos=Eventos;
	}
	get principal(){
		let plantilla=Handlebars.compile(this.plantilla);
        return this.relang(plantilla(this.db.links));
	}
	relang(a){
        let plantilla=a;
		Object.keys(self.lang.btn).forEach(b=>{
			let rx=new RegExp("__"+b+"__", "g");
			plantilla=plantilla.replace(rx, "{{"+b+"}}");
		});
        plantilla=Handlebars.compile(plantilla);
        return plantilla(window.lang.btn);
    }
	añadir(a){
		a.uid=cryptoJS.rnd;
		this.db.links.push(a);
		return cryptoJS.reinsertar(this.db).then(()=>{
			return new Promise(resolver=>resolver(this.recargar()));
		});
	}
	eliminar(a){
		let b=Vik.indexOfProp({array: this.db.links, prop: "uid", val: a.uid});
		if(b!=undefined){
			this.db.links.splice(b, 1);
			return cryptoJS.reinsertar(this.db).then(()=>{
				return new Promise(resolver=>resolver(this.recargar()));
			});
		}else{
			Materialize.toast(window.lang.alert.link_404, 1000);
		}
	}
	modificar(a){
		let b=Vik.indexOfProp({array: this.db.links, prop: "uid", val:a.uid});
		if(b!=undefined){
			this.db.links[b]=a;
			return cryptoJS.reinsertar(this.db).then(()=>{
				return new Promise(resolver=>resolver(this.recargar()));
			});
		}else{
			Materialize.toast(window.lang.alert.link_404, 1000);
		}
	}
	recargar(){
		return cryptoJS.recargar_db().then(a=>{
			this.db=a;
			$("#visor").html(this.principal);
			this.Eventos.collapBtn();
			return main.sync();
		});
	}
}

class Eventos{
	static login_ok(){
		this.collapBtn();
		this.syncBtn();
		$("#menu-opciones").empty()
		.append("<li class='btn-floating sub-boton modal-trigger' data-target='modal-añadir' id='links-añadir'><i class='material-icons'>add</i></li>");
		fetch("cont/modal-add.html").then(a=>a.text()).then(a=>{
			$("#modal-añadir").remove();
			$("#contenedor-modales").append(Handlebars.compile(a)(window.lang.modal_add));
			new Materialize.Modal($("#modal-añadir"));
			$("#añadir-cancelar").on("click", ()=>{
				$("[data-añadir]").val("").trigger("focusout");
			});
			$("#añadir-aceptar").on("click", ()=>{
				let valores={
					link: $("input[data-añadir='enlace']").val(),
					descripción: $("input[data-añadir='desc']").val()
				};
				if(document.querySelector("input[data-añadir='enlace']").checkValidity()==false){
					return Materialize.toast(window.lang.alert.link_invalid, 5000);
				}
				if(document.querySelector("input[data-añadir='desc']").checkValidity()==false){
					return Materialize.toast(window.lang.alert.desc_invalid, 2000);
				}
				$("#añadir-cancelar").click();
				main.home.añadir(valores).then(()=>{
					Materialize.toast(window.lang.alert.link_saved, 1000);
				}).catch(e=>{
					setTimeout(()=>{
						vex.dialog.alert(e.toString());
					}, 1000);
					console.error(e);
				});
			});
		});
	}
	static collapBtn(){
		$(".collapsible").collapsible();
		$(".links-eliminar").on("click", function(){
			let uid=$(this).parent("ul").attr("data-uid");
			setTimeout(()=>{
				vex.dialog.confirm({
					message: window.lang.alert.link_will_delete+$(this).parent("ul").parent("div").parent("div").children("a[href]").attr("href")+window.lang.alert.sure_to_continue,
					callback: a=>{
						if(a!=true){ 
							Materialize.toast(window.lang.alert.wont_change, 500);
							return;
						}
						main.home.eliminar({uid: uid}).then(()=>{
							Materialize.toast(window.lang.alert.link_deleted, 1000);
						}).catch(e=>{
							setTimeout(()=>vex.dialog.alert(e.toString()), 1000);
							console.error(e);
						});
					}
				});
			}, 200);
		});
		$(".links-editar").on("click", function(){
			let selectores={
				link: $(this).parent("ul").parent("div").parent("div").children("a[href]"),
				desc: $(this).parent("ul").parent("div").parent("div").parent("li").children("div[data-desc]")
			};
			let datos={
				uid: $(this).parent("ul").attr("data-uid"),
				link: selectores.link.attr("contenteditable", "true").attr("href"),
				desc: selectores.desc.attr("contenteditable", "true").text()
			};
			let divOps=$(this).parent("ul").parent("div").parent("div").parent("li").children("div.acciones");
			divOps.show("fold", 200);
			divOps.children("a.btn").off("click");
			divOps.children("a.acciones-cancelar").on("click", function(){
				selectores.link.removeAttr("contenteditable").html(datos.link);
				selectores.desc.removeAttr("contenteditable").html(datos.desc);
				divOps.children("a.btn").off("click");
				divOps.hide("fold", 200);
			});
			divOps.children("a.acciones-ok").on("click", function(){
				let datosNuevos={
					link: selectores.link.text(),
					descripción: selectores.desc.text(),
					uid: datos.uid
				};
				window.main.home.modificar(datosNuevos).then(()=>{
					Materialize.toast(window.lang.alert.link_modified, 1000);
				}).catch(e=>{
					console.error(e);
					setTimeout(()=>{
						vex.dialog.alert(e.toString());
					}, 500);
				});
			});
		});
		$(".links-publicar").on("click", async function(){
			let tgt=$(this);
			let datos={
				link: tgt.parent("ul").parent("div").parent("div").children("a[href]").attr("href"),
				usuario: cryptoJS.creds.usuario,
				uid: tgt.parent("ul").attr("data-uid"),
			};
			let res=await socketctl.enviar({tipo: "get-link", msg:{link: datos.uid}});
			if(res==false){
				return vex.dialog.confirm({
					message: window.lang.alert.confirm_public,
					callback: a=>{
						if(!a)return Materialize.toast(window.lang.alert.wont_change, 500);
						return main.público("set-public", datos).then(a=>{
							if(a.err) throw a.err;
							vex.dialog.alert(Handlebars.compile(window.lang.alert.short_ok)({short: window.shortDomain+datos.uid}));
						});
					}
				});
			}else{
				return vex.dialog.confirm({
					message: window.lang.alert.confirm_del_public,
					callback: a=>{
						if(!a)return Materialize.toast(window.lang.alert.wont_change, 500);
						return main.público("del-public", datos).then(a=>{
							if(a.err) throw a.err;
							Materialize.toast(window.lang.btn.ok, 500);
						});
					}
				});
			}
		});
	}
	static syncBtn(){
		let boton=$("[data-sync='indicador']");
		boton.off("click").on("click", ()=>{
			if(boton.children("i").hasClass("girar")){
				Materialize.toast(window.lang.sync.sync_running);
				return;
			}
			return main.sync();
		});
	}
}
load("handlebars").then(()=>{
	window.home=home;
});
