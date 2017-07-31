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
}
window.Vik=Vik;
