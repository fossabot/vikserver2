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
					window.cartera.Usuarios[b.Usuario]=b.pgp;
				});
				resolver(true);
			});
		});
	}
	importarOnline(){
		return socketctl.enviarEncriptado({tipo: "req-pgp", msg: this.creds, timeo: 10000}).then(a=>{
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
			var este=this;
			function desencriptar(a){
				console.log(a);
				este.pgp={
					privada: openpgp.key.readArmored(window.cartera.Usuarios[a.usuario].privada).keys[0],
					pública: openpgp.key.readArmored(window.cartera.Usuarios[a.usuario].pública).keys
				};
				este.pgpArmor={
					privada: window.cartera.Usuarios[a.usuario].privada,
					pública: window.cartera.Usuarios[a.usuario].pública
				};
				return este.pgp.privada.decrypt(este.creds.contraseña);
			}
			if(window.cartera.Usuarios.hasOwnProperty(a.usuario)!=true){
				return this.importarOnline().then(a=>{
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
		this.creds=a;
		return socketctl.enviarEncriptado({tipo: "login", msg: {creds: this.creds, key: this.gpg.pública}});
	}
	registrar(a){
		this.creds=a;
		return openpgp.generateKey({
			userIds: [{name: this.creds.usuario, email: this.creds.usuario+"@victor.zona.digital"}],
			numBits: 2048,
			passphrase: this.creds.contraseña
		}).then(key=>{
			this.pgp={
				privada: openpgp.key.readArmored(key.privateKeyArmored).keys[0],
				pública: openpgp.key.readArmored(key.publicKeyArmored).keys
			};
			if(this.pgp.privada.decrypt(this.creds.contraseña)!=true){
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
			return this.encriptar(a, this.pgp.privada).then(b=>{
				return socketctl.enviarEncriptado({tipo: "sync", msg: b.data});
			});
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
}
window.cryptoJS=new cryptoJS();
