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
		return dbjs.importar(a);
	}
	importarLocales(){
		return db.Usuarios.toCollection().toArray().then(a=>{
			return new Promise((resolver, rechazar)=>{
				a.forEach(b=>{
					window.cartera.Usuarios[b.Usuario]=b.pgp;
				});
				resolver(true);
			});
		});
	}
	importarOnline(b){
		return socketctl.enviarEncriptado({tipo: "req-pgp", msg: b, timeo: 10000}).then(a=>{
			//a->Clave PGP || false
			console.log("Respuesta: ", a);
			if(a==false){
				throw new Error("Tu clave no se puede descifrar con esa contraseña");
			}
			return this.importarAIDB({Usuario: a.usuario, pgp: {pública: a.pgp.pública, privada: a.pgp.privada}}).then(a=>{
				console.log(a);
				return this.importarLocales();
			});
		}).catch(e=>{
			console.error("No hemos podido recuperar la clave PGP desde el servidor");
			throw e;
		});
	}
	auth(a){
		return new Promise((resolver, rechazar)=>{
			this.creds={
				usuario: a.usuario
			};
			var este=this;
			function desencriptar(a){
				este.pgp={
					privada: openpgp.key.readArmored(window.cartera.Usuarios[a.usuario].privada).keys[0],
					pública: openpgp.key.readArmored(window.cartera.Usuarios[a.usuario].pública).keys
				};
				este.pgpArmor={
					privada: window.cartera.Usuarios[a.usuario].privada,
					pública: window.cartera.Usuarios[a.usuario].pública
				};
				return este.pgp.privada.decrypt(a.contraseña);
			}
			if(window.cartera.Usuarios.hasOwnProperty(a.usuario)!=true){
				return this.importarOnline(a).then(a=>{
					if(a==false){
						resolver(false);
						return;
					}
					resolver(desencriptar(a));
				});
			}
			return resolver(desencriptar(a));
		});
	}
	authOnline(a){
		this.creds={
			usuario: a.usuario
		};
		return this.importarOnline(a).then(()=>{
			if(this.iniciarCredenciales(a)==false) throw new Error("Credenciales de acceso incorrectas");
			return this.req_sync();
		}).catch(e=>{
			console.error(e);
			throw new Error("No podemos importar tu clave desde nuestros servidores");
		});
	}
	iniciarCredenciales(a){
		this.pgpArmor=window.cartera.Usuarios[a.usuario];
		this.pgp={
			privada: openpgp.key.readArmored(this.pgpArmor.privada).keys[0],
			pública: openpgp.key.readArmored(this.pgpArmor.pública).keys
		};
		return this.pgp.privada.decrypt(a.contraseña);
	}
	registrar(a){
		this.creds={
			usuario: a.usuario
		};
		return openpgp.generateKey({
			userIds: [{name: this.creds.usuario, email: this.creds.usuario+"@victor.zona.digital"}],
			numBits: 2048,
			passphrase: a.contraseña
		}).then(key=>{
			this.pgp={
				privada: openpgp.key.readArmored(key.privateKeyArmored).keys[0],
				pública: openpgp.key.readArmored(key.publicKeyArmored).keys
			};
			if(this.pgp.privada.decrypt(a.contraseña)!=true){
				vex.dialog.alert("No hemos podido desencriptar la clave que acabamos de crear, no te hemos registrado en ningún sitio, así que puedes volver a intentarlo. Si el problema persiste crea una incidencia en vikserver/vikserver2 en GitHub");
				return;
			}
			this.pgpArmor={
				pública: key.publicKeyArmored,
				privada: key.privateKeyArmored
			};
			return socketctl.enviarEncriptado({tipo: "registro", msg: {creds: this.creds, keys: this.pgpArmor}}).then(()=>{
				return openpgp.encrypt({
					data: JSON.stringify(dbjs.estructura.userdb),
					publicKeys: this.pgp.pública
				}).then(b=>{
					return dbjs.registrar({usuario: this.creds.usuario, pgp: this.pgpArmor, db: b.data}).then(a=>{
						window.cartera[this.creds.usuario]=this.pgpArmor;
						return a;
					});
				});
			});
		});
	}
	sync(){
		return dbjs.backup(this.creds).then(a=>{
			return this.firmar(a, this.pgp.privada).then(b=>{
				return socketctl.enviarEncriptado({tipo: "sync", msg: {usuario: this.creds.usuario, db: b.data}});
			});
		});
	}
	req_sync(){
		return socketctl.enviar({tipo: "req-sync", msg: this.creds}).then(a=>this.desencriptar(a));
	}
	firmar(a, b){
		let c;
		if(typeof a=="object"){
			c=JSON.stringify(a);
		}else{
			c=a;
		}
		return openpgp.sign({
			data: c,
			privateKeys: b || this.pgp.privada
		});
	}
	encriptar(a, c){
		let b;
		if(typeof(a)=="object"){
			b=JSON.stringify(a);
		}else{
			b=a;
		}
		return openpgp.encrypt({
			data: b,
			publicKeys: c || openpgp.key.readArmored(window.cartera.WebSocketServer).keys
		});
	}
	desencriptar(a){
		return openpgp.decrypt({
			privateKey: this.pgp.privada,
			message: openpgp.message.readArmored(a)
		});
	}
}
window.cryptoJS=new cryptoJS();
