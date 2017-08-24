"use-strict";
load("core/clases.js");
vex.defaultOptions.className="vex-theme-plain";
$("#menu-opciones")
	.empty()
	.append("<li class='btn-floating sub-boton' id='menu-iniciar_sesión'><i class='material-icons'>person</i></li>")
	.append('<li class="btn-floating sub-boton"><a href="https://github.com/vikserver/vikserver2" target="_blank" rel="noopener"><i class="material-icons">code</i></a></li>');
$("#menu-iniciar_sesión").on("click", ()=>{
	$("#index-menu").closeFAB();
	Vik.get("cont/login.html").then(a=>{
		$("#visor").html(a).show(200);
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
