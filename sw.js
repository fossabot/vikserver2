'use strict';
//WORKING BRANCH
//ServiceWorker v0.3 Development
//Scripts necesarios para el ServiceWorker
importScripts("lib/loadlify/loadlify.js");
load("core/db.js");
load("core/clases.js", "es6").then(x=>{
	let functions={
		["test-tag-from-devtools"]: function(resolver, rechazar){
			let a="Test event catched";
			if(Date.now()%2){
				a+=". Rejecting Promise";
				console.log(a);
				return rechazar(a);
			}
			a+=". Resolving Promise";
			console.log(a);
			return resolver(a);
		},
		test: function(){console.log("Sync events are working")},
		dbpool_send: function(resolver, rechazar){
			console.log(self.dbpool);
			let payload={sync: "dbpush", data: self.dbpool};
			console.log(payload);
			Vik.post({
				url: "/api",
				data: payload
			}).then(a=>{
				console.log(a);
				resolver(a);
			});
		}
	};
	return self.syncManager=new x.exports.clases.MSyncManager(functions);
});
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
var nocache=[
	"socket.io",
	"https://mrvikxd.ddns.net/api",
	"https://vikserver-api.herokuapp.com"
];
function nocacheurl(a){
	for(let url in nocache){
		if(a.match(url))return true;
	}
	return false;
}

//Eventos que maneja el ServiceWorker
this.addEventListener("install", event=>{
	console.log(">> Instalando ServiceWorker");
	event.waitUntil(Promise.all([
		caches.open(cacheName).then(cache=>{
			return cache.addAll(urlsToCache);
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
						if(nocacheurl(event.request.url)) return response;
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
		})
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
	let action=new Promise((resolver,rechazar)=>{
		if(event.isTrusted!=true) return rechazar(new Error("Untrusted sync event!"));
		if(syncManager.has(event.tag)!=true) return rechazar(new Error("Undefined handler for "+event.tag));
		syncManager.do[event.tag](resolver, rechazar);
	});
	event.waitUntil(action);
	action.catch(e=>{
		console.error(e);
		console.warn(`Error while handling a sync event named ${event.tag}: ${e.toString()}`);
	});
});
