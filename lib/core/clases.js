"use-strict";
class Vik{
	static get(a){
		return fetch(a).then(b=>b.text());
	}
	static post(a){
		return fetch(this.genreq({url: a.url, data: a.data, method: "POST"})).then(a=>{
			if(a.ok) return a.text();
			throw new Error(a.statusText);
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
	static genreq(a){
		let b= new Headers();
		b.append("Content-Type", "application/json");
		let c={
			method: a.method||"GET",
			body: JSON.stringify(a.data),
			headers: b
		};
		return new Request(a.url, c);
	}
}
self.Vik=Vik;
