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
		return plantilla(this.db.links);
	}
	añadir(a){
		a.uid=String(Math.random()).substr(3, 6);
		this.db.links.push(a);
		this.recargar();
		return cryptoJS.reinsertar(this.db);
	}
	eliminar(a){
		let b=Vik.indexOfProp({array: this.db.links, prop: "uid", val: a.uid});
		if(b!=undefined){
			this.db.links.splice(b, 1);
			this.recargar();
			return cryptoJS.reinsertar(this.db);
		}else{
			Materialize.toast("No hemos podido encontrar ese link que dices :/", 1000);
		}
	}
	modificar(a){
		let b=Vik.indexOfProp({array: this.db.links, prop: "uid", val:a.uid});
		if(b!=undefined){
			this.db.links[b]=a;
			this.recargar();
			return cryptoJS.reinsertar(this.db);
		}else{
			Materialize.toast("No hemos podido encontrar el link que dices", 1000);
		}
	}
	recargar(){
		$("#visor").html(this.principal);
		this.Eventos.collapBtn();
	}
}

class Eventos{
	static login_ok(){
		this.collapBtn();
		this.syncBtn();
		Materialize.toast("Esta página está en desarrollo, es posible que este diseño no sea el mismo que el diseño final", 5000);
		$("#menu-opciones").empty()
		.append("<li class='btn-floating sub-boton modal-trigger' data-target='modal-añadir' id='links-añadir'><i class='material-icons'>add</i></li>");
		fetch("cont/modal-add.html").then(a=>a.text()).then(a=>{
			$("#modal-añadir").remove();
			$("#contenedor-modales").append(a);
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
					return Materialize.toast("El enlace no es válido. Recuerda que debe empezar por http o https y continuar con ://", 5000);
				}
				if(document.querySelector("input[data-añadir='desc']").checkValidity()==false){
					return Materialize.toast("La descripción no parece válida *.*", 2000);
				}
				$("#añadir-cancelar").click();
				main.home.añadir(valores).then(()=>{
					Materialize.toast("Link introducido [OK]", 1000);
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
					message: "Vas a eliminar el link a "+$(this).parent("ul").parent("div").parent("div").children("a[href]").attr("href")+" ¿Seguro que quieres continuar?",
					callback: a=>{
						if(a!=true){ 
							Materialize.toast("No se hará ningún cambio", 500);
							return;
						}
						main.home.eliminar({uid: uid}).then(()=>{
							Materialize.toast("Link eliminado [OK]", 1000);
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
					Materialize.toast("Link modificado [OK]", 1000);
				}).catch(e=>{
					console.error(e);
					setTimeout(()=>{
						vex.dialog.alert(e.toString());
					}, 500);
				});
			});
		});
	}
	static syncBtn(){
		let boton=$("[data-sync='indicador']");
		boton.off("click").on("click", ()=>{
			if(boton.children("i").hasClass("girar")){
				Materialize.toast("Ya se está sincronizando");
				return;
			}
			return main.sync();
		});
	}
}
load("handlebars").then(()=>{
	window.home=home;
});
