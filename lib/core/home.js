"use-strict";
class home{
	constructor(a){
		this.db=a;
		this.prog=load(["vue-dev", "cont/home-vue.html"], ["noprefix"]).then(a=>{
			a[1].then(b=>{
				this.plantilla=b.text;
			});
		});
		this.Eventos=Eventos;
		this.VueEvents=VueEvents;
	}
	añadir(a){
		a.uid=cryptoJS.rnd;
		this.db.links.push(a);
		return this.reinsertar();
	}
	eliminar(a){
		let b=Vik.indexOfProp({array: this.db.links, prop: "uid", val: a.uid});
		if(b!=undefined){
			this.db.links.splice(b, 1);
			return this.reinsertar();
		}else{
			Materialize.toast(window.lang.alert.link_404, 1000);
		}
	}
	modificar(a){
		let b=Vik.indexOfProp({array: this.db.links, prop: "uid", val:a.uid});
		if(b!=undefined){
			this.db.links[b]=a;
			return this.reinsertar();
		}else{
			Materialize.toast(window.lang.alert.link_404, 1000);
		}
	}
	recargar(b){
		return cryptoJS.recargar_db().then(a=>{
			this.db.links=a.links;
			this.Eventos.collapBtn();
			if(!b)return
			return main.sync();
		});
	}
	reinsertar(){
		return cryptoJS.reinsertar(cryptoJS.pre_reinsertar(this.db.links)).then(()=>{
			return Promise.resolve(this.recargar(true));
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
			$("#contenedor-modales").append(a);
			window.langItems.modals.add=new Vue({
				el: "#modal-añadir",
				data: window.lang.modal_add
			});
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
		
	}
	static syncBtn(){
		let boton=$("[data-sync='indicador']");
		boton.off("click").on("click", ()=>{
			if(boton.children("i").hasClass("girar")){
				Materialize.toast(window.lang.sync.sync_running, 1000);
				return;
			}
			return main.sync();
		});
	}
}
window.home=home;
var VueEvents ={
	collapBtn: {
		eliminar: function (target){
			//.links-eliminar
			let uid=$(target).parent("ul").attr("data-uid");
			setTimeout(()=>{
				vex.dialog.confirm({
					message: window.lang.alert.link_will_delete+$(target).parent("ul").parent("div").parent("div").children("a[href]").attr("href")+window.lang.alert.sure_to_continue,
					callback: a=>{
						if(a!=true){ 
							Materialize.toast(window.lang.alert.wont_change, 500);
							return;
						}
						let z=Vik.indexOfProp({prop: "uid", array: main.home.db.links, val: uid});
						if(z&&main.home.db.links[z].shared) main.público("del-public", {uid: uid, usuario: cryptoJS.creds.usuario});
						main.home.eliminar({uid: uid}).then(()=>{
							Materialize.toast(window.lang.alert.link_deleted, 1000);
						}).catch(e=>{
							setTimeout(()=>vex.dialog.alert(e.toString()), 1000);
							console.error(e);
						});
					}
				});
			}, 200);
		},
		editar: function (target){
		//.links-editar
			let selectores={
				link: $(target).parent("ul").parent("div").parent("div").children("a[href]:not([shared])"),
				desc: $(target).parent("ul").parent("div").parent("div").parent("li").children("div[data-desc]"),
			};
			let datos={
				uid: $(target).parent("ul").attr("data-uid"),
				link: selectores.link.attr("contenteditable", "true").attr("href"),
				desc: selectores.desc.attr("contenteditable", "true").text()
			};
			function rmedit(a, b){
				a.children().off("click");
				a.hide();
				b.forEach(c=>c.removeAttr("contenteditable"));
			}
			let divOps=$(target).parent("ul").parent("div").parent("div").parent("li").children("div.acciones");
			divOps.show("fold", 200);
// 			divOps.children("a.btn").off("click"); //LOL?
			divOps.children("a.acciones-cancelar").on("click", function(){
				selectores.link.removeAttr("contenteditable").html(datos.link);
				selectores.desc.removeAttr("contenteditable").html(datos.desc);
				divOps.hide("fold", 200);
			});
			divOps.children("a.acciones-ok").on("click", function(){
				let datosNuevos={
					link: selectores.link.text(),
					descripción: selectores.desc.text(),
					uid: datos.uid
				};
				datosNuevos.shared=main.home.db.links[Vik.indexOfProp({array: main.home.db.links, prop: "uid", val: datos.uid})].shared;
				console.log(datosNuevos);
				window.main.home.modificar(datosNuevos).then(()=>{
					Materialize.toast(window.lang.alert.link_modified, 1000);
					rmedit(divOps, [selectores.link, selectores.desc]);
					if(!datosNuevos.shared||datosNuevos.shared=="")return;
					main.público("update-public", {link: datosNuevos.link, usuario: cryptoJS.creds.usuario, uid: datosNuevos.uid}).then(X=>{
						Materialize.toast(window.lang.alert.pub_link_modified, 1000);
					});
				}).catch(e=>{
					console.error(e);
					setTimeout(()=>{
						vex.dialog.alert(e.toString());
					}, 500);
				});
			});
		},
		publicar: async function(target){
		//.links-publicar
			let tgt=$(target);
			let datos={
				link: tgt.parent("ul").parent("div").parent("div").children("a[href]").attr("href"),
				usuario: cryptoJS.creds.usuario,
				uid: tgt.parent("ul").attr("data-uid"),
			};
			datos["id"]=Vik.indexOfProp({array: self.main.home.db.links, prop: "uid", val: datos.uid});
			console.log(datos);
			let res=await socketctl.enviar({tipo: "get-link", msg:{link: datos.uid}, usuario: cryptoJS.creds.usuario});
			if(res==false){
				return vex.dialog.confirm({
					message: window.lang.alert.confirm_public,
					callback: a=>{
						if(!a)return Materialize.toast(window.lang.alert.wont_change, 500);
						return main.público("set-public", datos).then(a=>{
							if(a.err) throw a.err;
							if(typeof datos.id == "number"){
								main.home.db.links[datos.id].shared=new URL(`#${datos.uid}`, window.shortDomain).href;
							}
							return main.home.reinsertar().then(()=>{
								return vex.dialog.alert(window.lang.alert.short_ok.replace("{{short}}",new URL(`#${datos.uid}`, window.shortDomain)));
							});
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
							delete main.home.db.links[datos.id].shared;
							return main.home.reinsertar().then(()=>{
								return Materialize.toast(window.lang.btn.ok, 500);
							});
						});
					}
				});
			}
		},
		limpiar: function(target){
			if(target.tagName=="I"){
				target=$(target).parent("a").parent("li");
			}else if(target.tagName=="A"){
				target=$(target).parent("li");
			}else if(target.tagName=="SPAN"){
				target=$(target).parent("a").parent("li");
			}
			return target;
		}
	}
}
