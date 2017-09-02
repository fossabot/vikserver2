"use-strict";
class Swctl{
    constructor(a){
        this.in=a;
        navigator.serviceWorker.register(a.sw, {scope: a.scope}).then(b=>{
            this.sw=b;
			this.cachectl=new Cachectl(b, this);
			this.db=new Dbctl(b, this);
        });
    }
    setSync(a){
        return navigator.serviceWorker.ready.then(b=>{
            return b.sync.register(a||"test");
        });
    }
    msg(a){
		return new Promise((resolver, rechazar)=>{
			let mc=new MessageChannel();
			mc.port1.onmessage=event=>{
				if(event.data!=undefined &&event.data.error) rechazar(new Error(event.data.error));
				resolver(event.data);
			};
			navigator.serviceWorker.controller.postMessage(a, [mc.port2]);
		});
	}
    unregister(){
		return navigator.serviceWorker.ready.then(a=>a.unregister());
	}
}
window.Swctl=Swctl;
class Cachectl{
	constructor(a, b){
		this.sw=a;
		this._this=b;
	}
	msg(a){
		return this._this.msg({tipo: "cache", datos: a});
	}
	delete(a){
		return this.msg({tipo: "delete", datos:a});
	}
	put(a){
		return this.msg({tipo: "put", datos:a});
	}
}
class Dbctl{
	constructor(a, b){
		this.sw=a;
		this._this=b;
	}
	msg(a){
		return this._this.msg({tipo: "db", datos: a});
	}
	close(){
		return this._this.msg({tipo: "db", datos:{tipo: "close"}});
	}
}
