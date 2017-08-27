'use strict';
//WORKING BRANCH
//ServiceWorker v0.3 Development
//Service Worker
var cacheName="Asignaciones-v"+0.3;
var cacheList=[];
var urlsToCache=[
	'/asignaciones/index.html',
	'/asignaciones/manifest.json',
	'/asignaciones/cont/html/asignaciones.html',
	'/asignaciones/cont/html/estudiantes.html',
	'/asignaciones/cont/html/exportarasignaciones.html'
];
this.addEventListener("install", event=>{
	console.log(">> Instalando ServiceWorker");
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
			}));
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
