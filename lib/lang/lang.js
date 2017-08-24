let index=["es", "en"];
let fullIndex=[
    {abbr: "es", completo: "Español - Spanish"},
    {abbr: "en", completo: "English - English"}
];
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
    return fetch("lang/"+idioma+".json").then(a=>a.text()).then(b=>{
        window.lang=JSON.parse(b);
        document.querySelector("html").lang=idioma;
        return window.lang;
    });
}
Promise.all([load(["core/clases.js", "handlebars"]), loadLang()]).then(()=>{
    Vik.get("cont/modal-idiomas.html").then(a=>{
        $("#contenedor-modales").append(Handlebars.compile(a)({
            lang: window.lang,
            idiomas: fullIndex
        }));
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

