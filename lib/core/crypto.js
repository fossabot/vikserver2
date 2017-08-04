"use-strict";
load("openpgp").then(()=>{
	openpgp.initWorker({path: 'lib/openpgp/dist/openpgp.worker.min.js'});
});
class cryptoJS{
	constructor(a){
		this.in=a;
		if(typeof window.cartera =="undefined"){
			window.cartera={
				Usuarios: {}
			};
		}
	}
	get encKey(){
		return this.propiedades.encKey;
	}
	importar(a){
		window.cartera[a.name]=a.key;
	}
	importarAIDB(a){
		return db.Usuarios.add(a);
	}
	importarLocales(){
		return db.Usuarios.toCollection().toArray().then(a=>{
			return new Promise((resolver, rechazar)=>{
				a.forEach(b=>{
					window.cartera.Usuarios[a.Usuario]=a.pgp;
				});
				resolver(window.cartera.Usuarios[a.Usuario]);
			});
		});
	}
	importarOnline(){
		return socketctl.enviar({tipo: "req-pgp", msg: this.creds, timeo: 10000}).then(a=>{
			//a->Clave PGP || false
			if(a==false){
				vex.dialog.alert("Tu clave no se ha podido descifrar con la contraseña que has introducido");
				return false;
			}
			return importarAIDB({Usuario: a.usuario, pgp: {pública: a.pública, privada: a.privada}}).then(a=>{
				return importarLocales();
			});
		}).catch(e=>{
			console.error("No hemos podido recuperar la clave PGP desde el servidor");
			throw e;
		});
	}
	auth(a){
		return new Promise((resolver, rechazar)=>{
			this.creds=a;
			function desencriptar(){
				this.pgp={
					privada: openpgp.key.readArmored(window.cartera.Usuarios[a.usuario].privada),
					pública: openpgp.key.readArmored(window.cartera.Usuarios[a.usuario].pública)
				return this.pgp.privada.decrypt(this.creds.contraseña);
			}
			if(window.cartera.Usuarios.hasOwnProperty(a.usuario)!=true){
				return this.importarOnline().then(()=>{
					return desencriptar();
				});
			}
			return desencriptar();
		});
	}
	authOnline(a){
		this.creds=a;
		socketctl.enviar({tipo: "login", msg: {creds: this.creds, key: this.gpg.pública}});
	}
	encriptar(a){
		return openpgp.encrypt({
			data: a,
			publicKeys: openpgp.readArmored(window.cartera.WebSocketServer)
		});
	}
}
window.cryptoJS=new cryptoJS();
