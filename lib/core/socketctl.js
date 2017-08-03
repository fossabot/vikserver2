"use-strict";
load("socket_io").then(()=>{
	window.socketctl=new Socket();
})
class Socket{
	constructor(a){
		this.socket= io("192.168.1.10:10000");
		this.timeout=2000;
	}
	enviar(a){
		return new Promise((resolver, rechazar)=>{
			this.socket.emit(a.tipo || "msg", {msg: a.msg});
			let timeo=setTimeout(()=>{
				rechazar(new Error("No ha habido respuesta del servidor en "+this.timeout+" segundos"));
			}, this.timeout);
			let tipoRespuesta;
			if(a.tipo!=undefined){
				tipoRespuesta=a.tipo+"2";
			}else{
				tipoRespuesta="msg2";
			}
			this.socket.on(tipoRespuesta || "msg2", (a, b, c)=>{
				this.socket.off(tipoRespuesta);
				clearTimeout(timeo);
				resolver(a, b, c);
			});
		});
	}
	terminar(){
		this.socket.disconnect();
	}
}
