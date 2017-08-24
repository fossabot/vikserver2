"use-strict";
load(["core/crypto.js", "socket_io"]).then(()=>{
	window.msgs=[];
	window.socketctl=new Socket();
});
class Socket{
	constructor(a){
		this.socket= io("vikserver-backend.herokuapp.com");
		this.socket.on("pgp", sign=>{
			console.log(sign);
			cryptoJS.importar(sign);
			this.socket.off("pgp");
		});
		this.socket.on("msg", a=>{
			console.log(a);
			window.msgs.push(a);
		});
		this.socket.on("direct", a=>vex.dialog.alert(window.lang.direct[a]));
		this.timeout=10000;
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
	enviarEncriptado(a){
		return cryptoJS.encriptar(a.msg).then(b=>{
			return this.enviar({tipo: a.tipo || "crypt-msg", msg: b.data});
		});
	}
	terminar(){
		this.socket.disconnect();
	}
}
