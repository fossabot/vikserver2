"use-strict";
if(typeof window!=="undefined"){
    load(["core/crypto.js", "socket_io"]).then(()=>{
        window.msgs=[];
        window.socketctl=new Socket();
    });
}else{
    load("socket_io").then(()=>{
        self.socketctl=new Socket();
    });
}
class Socket{
	constructor(a){
		function conn(_this){
			return _this.socket= io("vikserver-backend.herokuapp.com");
			_this.socket.on("pgp", sign=>{
				console.log(sign);
				cryptoJS.importar(sign);
				_this.socket.off("pgp");
			});
			_this.socket.on("msg", a=>{
				console.log(a);
				window.msgs.push(a);
			});
			_this.socket.on("direct", a=>vex.dialog.alert(window.lang.direct[a]));
		}
		window.addEventListener("online", ()=>conn(this));
		if(navigator.onLine) conn(this);
		this.timeout=10000;
	}
	enviar(a){
		return new Promise((resolver, rechazar)=>{
			if(navigator.onLine!=true){
				let e=new Error(self.lang.errors.offline);
				e.name="offline";
				return rechazar(e);
			}
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
