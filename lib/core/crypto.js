"use-strict";
var secrets;
load("openpgp").then(x=>{
	setTimeout(()=>{
		openpgp.initWorker({path: 'lib/openpgp/dist/openpgp.worker.min.js'});
	}, 500);
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
			if(a==false){
				throw new Error(window.lang.crypto.key_nok);
			}
			return this.importarAIDB({Usuario: a.usuario, pgp: {pública: a.pgp.pública, privada: a.pgp.privada}}).then(a=>{
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
			if(window.cartera.Usuarios.hasOwnProperty(a.usuario)!=true){
				return this.importarOnline(a).then(a=>{
					if(a==false){
						resolver(false);
						return;
					}
					resolver(this.iniciarCredenciales(a));
				});
			}
			return resolver(this.iniciarCredenciales(a));
		});
	}
	authOnline(a){
		this.creds={
			usuario: a.usuario
		};
		return this.importarOnline(a).then(()=>{
			if(this.iniciarCredenciales(a)==false) throw new Error(window.lang.crypto.creds_nok);
			return this.req_sync();
		}).catch(e=>{
			throw e;
		});
	}
	iniciarCredenciales(a){
		let claves=window.cartera.Usuarios[a.usuario];
		secrets=new Secrets({
			pgpArmor: claves,
			pgp: {
				privada: openpgp.key.readArmored(claves.privada).keys[0],
				pública: openpgp.key.readArmored(claves.pública).keys
			}
		});
		return secrets.keys.pgp.privada.decrypt(a.contraseña);
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
			secrets=new Secrets({
				pgp: {
					privada: openpgp.key.readArmored(key.privateKeyArmored).keys[0],
					pública: openpgp.key.readArmored(key.publicKeyArmored).keys
				},
				pgpArmor: {
					pública: key.publicKeyArmored,
					privada: key.privateKeyArmored
				}
			});
			if(secrets.keys.pgp.privada.decrypt(a.contraseña)!=true){
				vex.dialog.alert(window.lang.crypto.pgp_rare);
				return;
			}
			return socketctl.enviarEncriptado({tipo: "registro", msg: {creds: this.creds, keys: secrets.keys.pgpArmor}}).then(x=>{
				if(x==false) throw new Error(self.lang.errors.register);
				return openpgp.encrypt({
					data: JSON.stringify(dbjs.estructura.userdb),
					publicKeys: secrets.keys.pgp.pública
				}).then(b=>{
					return dbjs.registrar({usuario: this.creds.usuario, pgp: secrets.keys.pgpArmor, db: b.data}).then(a=>{
						window.cartera[this.creds.usuario]=secrets.keys.pgpArmor;
						return a;
					});
				});
			});
		});
	}
	sync(){
		return dbjs.backup(this.creds).then(a=>{
			return this.firmar(a, secrets.keys.pgp.privada).then(b=>{
				return socketctl.enviarEncriptado({tipo: "sync", msg: {usuario: this.creds.usuario, db: b.data, fecha: a.fecha}});
			});
		});
	}
	req_sync(){
		return socketctl.enviar({tipo: "req-sync", msg: this.creds}).then(a=>this.desencriptar(a)).then(b=>{
			if(b.data.length<1){
                return this.reinsertar(dbjs.estructura.userdb);
            }
			return dbjs.restaurar(JSON.parse(b.data));
		});
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
			privateKeys: b || secrets.keys.pgp.privada
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
			privateKey: secrets.keys.pgp.privada,
			message: openpgp.message.readArmored(a)
		});
	}
	desencriptar_db(){
		return window.dbjs.backup(this.creds).then(a=>{
			return this.desencriptar(a.db).then(b=>{
				return new Promise((resolver, rechazar)=>{
					resolver(new home(JSON.parse(b.data)));
				});
			});
		});
	}
	recargar_db(){
		return window.dbjs.backup(this.creds).then(a=>{
			return this.desencriptar(a.db).then(b=>{
				return new Promise(resolver=>{
					resolver(JSON.parse(b.data));
				});
			});
		});
	}
	reinsertar(a){
		return this.encriptar(a, secrets.keys.pgp.pública).then(a=>{
			return dbjs.restaurar({Usuario: this.creds.usuario, db: a.data, fecha: Date.now()});
		});
	}
	decidir_sync(){
		return dbjs.backup({usuario: this.creds.usuario}).then(b=>{
			return socketctl.enviar({tipo: "decidir_sync", msg: {usuario: this.creds.usuario, db: sha256(btoa(JSON.stringify(b))), fecha: b.fecha}}).then(c=>{
				if(c==false){
					return false;
				}
				if(c=="servidor"){
					return this.req_sync();
				}
				if(c=="cliente"){
					return this.sync();
				}
				console.log(c);
				return;
			});
		});
	}
	get rnd(){
		return Math.abs(this.random()).toString(16).substr(0, 6);
	}
	random(a){
		if(a) return crypto.getRandomValues(new Int32Array(a));
		return crypto.getRandomValues(new Int32Array(1))[0];
	}
}
window.cryptoJS=new cryptoJS();
class Secrets{
	constructor(a){
		this.keys={
			pgp: a.pgp,
			pgpArmor: a.pgpArmor
		}
	}
}
