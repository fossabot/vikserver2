"use-strict";
let props={
	prefijo: "lib/"
};
var loaderDefs={
	bootstrap: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js",
	dexie: "https://unpkg.com/dexie@1.5.1/dist/dexie.min.js",
	jqueryUI: "https://code.jquery.com/ui/1.12.1/jquery-ui.min.js",
	handlebars: "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.10/handlebars.min.js",
	jqueryUICSS: "https://code.jquery.com/ui/1.12.1/themes/ui-lightness/jquery-ui.css",
	bootstrapCSS: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css",
	test: "test.js"
}
var loaderDeps={
	bootstrap: ["bootstrapCSS"],
	jqueryUI: ["jqueryUICSS"]
}
var loaderLoaded=[];
function load(a){
	function loadjs(a){
		return fetch(a).then(b=>{
			return b.text().then(c=>eval(c));
		});
	}
	function loadcss(a){
		return fetch(a).then(b=>{
			return b.text().then(c=>$("head").append("<style data-from='"+a+"'>"+c+"</style>"));
		});
	}
	function pre(a){
		if(what(a)=="js"){
			let z=loadjs(a);
            loaderLoaded.push(a);
            return z;
		}else if(what(a)=="css"){
			let z=loadcss(a);
            loaderLoaded.push(a);
            return z;
		}
    }
    function deps(a){
        if(loaderDeps.hasOwnProperty(a)){
            var b=loaderDeps[a];
            var c;
            if(loaderDeps[a]!=undefined){
                c=loaderDeps[a];
            }
        }
        return c;
    }
    function init(a){
        if(a==undefined){
            return;
        }
        if(typeof a == "string"){
            if(loaderLoaded.indexOf(a)==-1){
                if(loaderDefs.hasOwnProperty(a)){
                    return pre(loaderDefs[a]);
                }else{
                    return pre(props.prefijo+a);
                }
            }else{
                return true;
            }
        }else{
            $.each(a, (k, v)=>{
                if(loaderLoaded.indexOf(v)==-1){
					if(loaderDefs.hasOwnProperty(v)){
						return pre(loaderDefs[v]);
					}else{
						return pre(props.prefijo+v);
					}
                }else{
                    return true;
                }
            });
        }
    }
    if(deps(a)!=undefined){
		init(a);
		return init(deps(a));
	}else{
		return init(a);
	}
}
function what(a){
    if(a.match(/(.*\.js)/)){
        return "js";
    }else if(a.match(/(.*\.css)/)){
        return "css";
    }else{
        return undefined;
    }
}
(function(){
	if(typeof loaderInit=="undefined"){
		return;
	}
	if(typeof loaderInit == "string"){
		throw new Error("Los scripts para la carga inicial deben estar en un Array");
	}
	try{
		load(loaderInit).then(()=>{
			if(typeof loaderProps=="Object"&&typeof loaderProps.eventos=="Object"){
				loaderProps.onload();
			}
		});
	}catch(e){
		console.error(e);
		throw new Error("No hemos podido cargar los scripts de inicio");
	}
})();
