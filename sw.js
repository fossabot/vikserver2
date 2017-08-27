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
    'cont/modal-idiomas.html'
];
this.addEventListener("install", event=>{
	console.log(">> Instalando ServiceWorker");
    fetch("lib/jsloader/loader.js").then(a=>{
        if(a.ok) return a.text();
        Promise.reject("No se puede cargar el loader");
    }).then(eval).catch(console.error);
	event.waitUntil(
		caches.open(cacheName).then(cache=>{
			return cache.addAll(urlsToCache);
		})
	);
});
///////////////////////////////////
this.addEventListener("fetch", event=>{
	event.respondWith(
		caches.match(event.request).then(response=>{
			return response || fetch(event.request).then(response=>{
				return caches.open(cacheName).then(cache=>{
					if(event.request.url.match(/(http([s]|):\/\/)/g)){
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
			}),
                load("core/db.js")
            );
		})
	);
});
/////////////////////////////////
this.addEventListener("message", event=>{
	var msg=event.data;
	console.log(msg);
	mhandler.tipo[msg.tipo](msg.contenido).then(a=>{
		event.ports[0].postMessage(a);
	}).catch(e=>{
		console.error(e);
	});
});
var mhandler={
	tipo:{
		importante: function(a){
			return new Promise(function(aceptar, rechazar){
				mhandler.ordenes[a.orden](a.datos).then(b=>{
					aceptar(b);
				}).catch(e=>{
					rechazar(e);
				});
			});
		}
	},
	ordenes:{
		recargar: function(a){
			return new Promise(function(aceptar, rechazar){
				return caches.open(cacheName).then(cache=>{
					cache.delete(a).then(()=>{
						cache.add(a).then(()=>{
							console.log("La cache ha sido modificada correctamente");
							aceptar({tipo: "respuesta", contenido: {datos: "ok"}});
						});
					});
				});
			});
		},
		eliminarcache: function(a){
			return caches.keys().then(list=>{
				return Promise.all(list.map(key=>{
					return caches.delete(key);
				}));
			});
		}
	}
};
this.addEventListener("sync", event=>{
    console.log(event);
    if(event.tag=="test"){
        console.log(self);
        console.log("Test sync received");
    }
});
