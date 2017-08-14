"use-strict";
class Vik{
	static get(a){
		return fetch(a).then(b=>b.text());
	}
	static post(a){
		return new Promise((resolver, rechazar)=>{
			$.post(a.url, a.args, b=>resolver(b));
		});
	}
	static indexOfProp(a){
		//prop, array, val
		let salida;
		a.array.forEach((b, c)=>{
			if(b[a.prop]==a.val){
				salida=c;
			}
		});
		return salida;
	}
}
window.Vik=Vik;
