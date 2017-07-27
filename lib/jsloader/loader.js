"use-strict";
window.loaded=[];
var loaderDefs={
	bootstrap: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js",
	dexie: "https://unpkg.com/dexie@latest",
	//clipboard: "https://unpkg.com/clipboard@latest",
	jqueryUI: "https://code.jquery.com/ui/1.12.1/jquery-ui.min.js",
	handlebars: "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.10/handlebars.min.js"
}
var loaderDeps={
	bootstrap: ["https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"],
	jqueryUI: ["https://code.jquery.com/ui/1.12.1/themes/ui-lightness/jquery-ui.css"] //LAS DEPENDENCIAS NO DEBEN DE SER ASÍ. DEBEN ESTAR POR NOMBRE
}
var loaderLoaded=[];
function load(a){
	function loadjs(a){
		return $.getScript(a, datos=>{
			return datos;
		});
	}
	function loadcss(a){
		
	}
	if(typeof a == "string"){
		if(what(a)=="js"){
			return loadjs(a);
		}else if(what(a)=="css"){
			return loadcss(a);
		}
	}
}
