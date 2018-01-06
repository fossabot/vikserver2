let index=[];
let fullIndex=[
    {abbr: "es", completo: "Español - Spanish"},
    {abbr: "en", completo: "English - English"}
];
fullIndex.forEach(a=>{
	index.push(a.abbr);
});
let lang;
if(index.indexOf(localStorage.lang)>-1){
    lang=localStorage.lang;
}else if(index.indexOf(navigator.language)>-1){
    lang=navigator.language;
}else{
    lang=index[0];
}
let idioma;
window.loadLang=function(a){
    idioma=(a||lang);
	if(window.lang) return Promise.resolve(window.lang);
    return load("lang/"+idioma+".json", ["asplain", "noprefix"])
	.then(b=>{
        window.lang=JSON.parse(b.text);
        document.querySelector("html").lang=idioma;
        return window.lang;
    });
}
Promise.all([load(["core/clases.js"]), loadLang()]).then(X=>{
    Vik.get("cont/modal-idiomas.html").then(a=>{
		$("#contenedor-modales").append(a);
		window.langItems.modals.idiomas=new Vue({
			el: "#modal-idiomas",
			data: {
				lang: window.lang,
				idiomas: fullIndex
			}
		});
        let modalIdiomas=new Materialize.Modal($("#modal-idiomas"));
        $("#boton-idiomas").on("click", ()=>{
            $("[data-idiomas='idioma']").removeClass("active");
            $("[data-idioma='"+idioma+"']").addClass("active");
            modalIdiomas.open();
        });
        $("[data-idiomas='idioma']").on("click", function(){
           $("[data-idiomas='idioma']").removeClass("active");
           $(this).addClass("active");
        });
        $("[data-idiomas='guardar']").on("click", function(){
            localStorage.setItem("lang", $("[data-idiomas='idioma'].active").attr("data-idioma"));
            location.reload();
        });
    });
});

