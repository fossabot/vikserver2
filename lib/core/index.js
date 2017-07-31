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
})
