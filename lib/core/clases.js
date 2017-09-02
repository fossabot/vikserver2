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
	static storage(){
		let X={
			get: async function(a){
				return localStorage.getItem(a);
			},
			put: async function(a, b){
				return localStorage.setItem(a, b);
			},
			delete: async function(a){
				return localStorage.removeItem(a);
			},
			deleteAll: async function(){
				return localStorage.clear();
			}
		}
		return X;
	}
}
window.Vik=Vik;
