let index=["es", "en"];
let lang;
if(index.indexOf(localStorage.lang)>-1){
    lang=localStorage.lang;
}else if(index.indexOf(navigator.language)>-1){
    lang=navigator.language;
}else{
    lang=index[0];
}
window.loadLang=function(a){
    return fetch("lang/"+(a||lang)+".json").then(a=>a.text()).then(b=>{
        window.lang=JSON.parse(b);
        return window.lang;
    });
}
