"use-strict";
class home{
	constructor(a){
		this.db=a;
		this.prog=fetch("cont/home.html").then(a=>a.text()).then(b=>{
			this.plantilla=b;
		});
	}
	get principal(){
		let plantilla=Handlebars.compile(this.plantilla);
		return plantilla(this.db.links);
	}
}

load("handlebars").then(()=>{
	window.home=home;
});
