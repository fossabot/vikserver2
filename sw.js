'use strict';
//WORKING BRANCH
//ServiceWorker v0.3 Development
//Ajustes del ServiceWorker
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

//Eventos que maneja el ServiceWorker
this.addEventListener("install", event=>{
	console.log(">> Instalando ServiceWorker");
	event.waitUntil(Promise.all([
		caches.open(cacheName).then(cache=>{
			return cache.addAll(urlsToCache);
		}),
		fetch("lib/loadlify/loadlify.js").then(a=>{
			if(a.ok) return a.text();
			Promise.reject("No se puede cargar loadlify");
		}).then(a=>{
			let b=new Function(a);
			b();
			return load("core/db.js");
		})
	]));
});
/////////////////////
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
/////////////////////
this.addEventListener("activate", event=>{
	console.log(">> Activando ServiceWorker");
	event.waitUntil(
		caches.keys().then(list=>{
			return Promise.all(list.map(key=>{
				if(cacheList.indexOf(key) === -1){
					return caches.delete(key);
				}
			}));
		}),
		load("core/clases.js")
	);
});
/////////////////////
this.addEventListener("push", event=>{
	console.log(event);
	console.log(event.data.text());
});
///////////////////////////////////////////////////////////////

//Manejo de los mensajes al SW
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
	async function dbpoolctl(b){
		switch(b.tipo){
			case "init":
				console.log(b);
				if(typeof self.dbpool!="object") return self.dbpool={};
				return self.dbpool;
			case "put":
				self.dbpool[b.usuario]=b.datos;
				return true;
			case "del":
				return delete self.dbpool[b.usuario];
			default:
				return new Error(`Unknown event type ${a.tipo}/${b.tipo}`);
		}
	}
	switch(a.tipo){
		case "cache":
			return await cache(a.datos);
		case "db":
			return await db(a.datos);
		case "dbpool":
			return await dbpoolctl(a.datos);
		default:
			return "Unhandled!!";
	}
}
///////////////////////////////////////////////////////////////

//Manejo de los eventos de sincronización
this.addEventListener("sync", event=>{
    console.log("Sync event: "+event.tag);
    if(event.isTrusted!=true) return console.warn("WARNING!!! UNTRUSTED SYNC EVENT!", event);
    let functions={
		["test-tag-from-devtools"]: function(){console.log("Test sync event handled")},
		test: function(){console.log("Sync events are working")},
        dbpool_send: function(){
			console.log(self.dbpool);
			let payload={sync: "dbpush", data: self.dbpool};
			console.log(payload);
			Vik.post({
				url: "vikserver-api.herokuapp.com",
				data: payload
			}).then(a=>{
				console.log(a);
			});
		},
    };
    if(functions.hasOwnProperty(event.tag)!=true) return console.warn("Undefined handler for "+event.tag);
    return functions[event.tag]();
});
