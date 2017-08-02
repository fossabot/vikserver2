"use-strict";
load("core/clases.js");
$("#index-menu-btn").on("click", event=>{
	$("#float-parent").toggle();
	$("#index-menu").toggle("drop", 200);
});
$("#float-parent").on("click", function(){
	$(this).children().hide("drop", 200);
	$(this).hide(200);
});
$("#menu-iniciar_sesión").on("click", ()=>{
	Vik.get("cont/login.html").then(a=>{
		$("#visor").html(a).show(200);
		load("core/login.js");
	}).catch(e=>{
		console.error(e);
		throw new Error("No hemos podido conseguir la página de login!");
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
