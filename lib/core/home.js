"use-strict";
class home{
	constructor(a){
		this.db=a;
		fetch("cont/home.html").then(a=>a.text()).then(b=>{
			this.plantilla=b;
		});
	}
	get principal(){
		console.log("Solicitada la plantilla");
		return this.plantilla;
	}
}

load("handlebars").then(()=>{
	window.home=home;
});
