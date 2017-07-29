"use-strict";
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
		return $.get(a, b=>eval(b));
	}
	function loadcss(a){
		return $.get(a, (dat)=>{
            $("header").append("<style data-from='"+a+"'>"+dat+"</style>");
            return dat;
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
                    return pre(a);
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
						return pre(v);
					}
                }else{
                    return true;
                }
            });
        }
    }
    init(a);
    init(deps(a));
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
