"use-strict";
Promise.all([load("core/crypto.js"),load("socket_io")]).then(()=>{
	window.socketctl=new Socket();
});
class Socket{
	constructor(a){
		this.socket= io("192.168.1.10:10000");
		this.socket.on("pgp", sign=>{
			console.log(sign);
			cryptoJS.importar(sign);
			this.socket.off("pgp");
		});
		this.socket.on("msg", console.log);
		this.timeout=2000;
	}
	enviar(a){
		return new Promise((resolver, rechazar)=>{
			this.socket.emit(a.tipo || "msg", {msg: a.msg});
			let timeo=setTimeout(()=>{
				rechazar(new Error("No ha habido respuesta del servidor en "+(a.timeo|| this.timeout)+" milisegundos"));
			}, a.timeo||this.timeout);
			let tipoRespuesta;
			if(a.tipo!=undefined){
				tipoRespuesta=a.tipo+"2";
			}else{
				tipoRespuesta="msg2";
			}
			this.socket.on(tipoRespuesta || "msg2", a=>{
				this.socket.off(tipoRespuesta);
				clearTimeout(timeo);
				resolver(a);
			});
		});
	}
// 	enviarEncriptado(a){
// 		return new Promise((resolver, rechazar)=>{
// 			cryptoJS.encriptar(a.msg).then(b=>{
// 				this.socket.emit(a.tipo || "crypt-msg", {msg: b.data});
// 				let timeo=setTimeout(()=>{
// 					rechazar(new Error("No se ha recibido una respuesta del servidor en "+(a.timeo|| this.timeout)+" milisegundos"));
// 				}, a.timeo||this.timeout);
// 				let tipoRespuesta;
// 				if(a.tipo!="undefined"){
// 					tipoRespuesta=a.tipo+"2";
// 				}else{
// 					tipoRespuesta="crypt-msg2";
// 				}
// 				this.socket.on(tipoRespuesta, a=>{
// 					this.socket.off(tipoRespuesta);
// 					clearTimeout(timeo);
// 					resolver(a);
// 				});
// 			}).catch(e=>{
// 				console.error("No hemos podido completar la transacción");
// 				vex.dialog.alert("No hemos podido completar la transacción de datos");
// 				throw e;
// 			});
// 		});
// 	}
	enviarEncriptado(a){
		return cryptoJS.encriptar(a.msg).then(b=>{
			return this.enviar({tipo: a.tipo || "crypt-msg", msg: b.data});
		});
	}
	terminar(){
		this.socket.disconnect();
	}
}
