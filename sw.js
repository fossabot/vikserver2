'use strict';
//WORKING BRANCH
//ServiceWorker v0.3 Development
//Service Worker
var cacheName="vikserver-v"+0.1;
var cacheList=[];
var urlsToCache=[
	'cont/estructura.json',
    'cont/home.html',
    'cont/login.html',
    'cont/modal-add.html',
    'cont/modal-idiomas.html',
	'lang/es.json',
	'lang/en.json'
];
this.addEventListener("install", event=>{
	console.log(">> Instalando ServiceWorker");
	event.waitUntil(Promise.all([
		caches.open(cacheName).then(cache=>{
			return cache.addAll(urlsToCache);
		}),
		fetch("lib/loadlify/loadlify.js").then(a=>{
			if(a.ok) return a.text();
			Promise.reject("No se puede cargar el loader");
		}).then(a=>{
			let b=new Function(a);
			b();
			return load("core/db.js");
		})
	]));
});
///////////////////////////////////
this.addEventListener("fetch", event=>{
	event.respondWith(
		caches.match(event.request).then(response=>{
			return response || fetch(event.request).then(response=>{
				return caches.open(cacheName).then(cache=>{
					if(event.request.url.match(/(http([s]|):\/\/)/g)){
						if(event.request.url.match("socket.io")) return response;
						cache.put(event.request, response.clone());
					}
					return response;
				});
			});
		})
	);
});
/////////////////////////////////
this.addEventListener("activate", event=>{
	console.log(">> Activando ServiceWorker");
	event.waitUntil(
		caches.keys().then(list=>{
			return Promise.all(list.map(key=>{
				if(cacheList.indexOf(key) === -1){
					return caches.delete(key);
				}
			}));
		})
	);
});
/////////////////////////////////
this.addEventListener("push", event=>{
	console.log(event);
	console.log(event.data.text());
});
/////////////////////////////////
this.addEventListener("message", event=>{
	var msg=event.data;
	console.log(msg);
	return mhandler(msg).then(a=>event.ports[0].postMessage(a));
});
async function mhandler(a){
	async function cache(b){
		let cache=await caches.open(cacheName);
		if(b.tipo=="put"){
			let req=new Request(b.datos);
			let response=await fetch(req);
			return cache.put(req, response);
		}else if(b.tipo=="delete"){
			if(b.datos!=undefined) return cache.delete(b.datos);
			let keys=await caches.keys();
			let rtn=[];
			keys.forEach(a=>{
				rtn.push(caches.delete(a));
			});
			return Promise.all(rtn);
		}
	}
	async function db(b){
		switch(b.tipo){
			case "open":
				if(self.db.isOpen()) return true;
				return self.db.open();
			case "close":
				return self.db.close();
		}
	}
	switch(a.tipo){
		case "cache":
			return await cache(a.datos);
		case "db":
			return await db(a.datos);
		default:
			return "Unhandled!!";
	}
}
this.addEventListener("sync", event=>{
    console.log("Sync event: "+event.tag);
    if(event.isTrusted!=true) return console.warn("WARNING!!! UNTRUSTED SYNC EVENT!", event);
    let functions={
        update_db: function (){
			if(typeof dbProgress=="undefined") return console.warn("DB is not loaded");
			return dbProgress.then(db.open()).then(()=>{
				console.log("Updating DB");
				var userArray=[];
				return db.transaction("r", db.Usuarios, ()=>{
					db.Usuarios.toCollection().each(a=>{
						userArray.push(a.Usuario);
					});
				}).then(()=>{
					console.log(userArray);
				}).catch(console.error);
			});
        }
    };
	console.log(functions);
    functions["test-tag-from-devtools"]=function(){console.log("Sync event handled")};
    if(functions.hasOwnProperty(event.tag)!=true) return console.warn("Undefined handler for "+event.tag);
    return functions[event.tag]();
});
