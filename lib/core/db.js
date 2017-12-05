self.dbload=load("dexie");
class dbjs{
	constructor(){
		this.a=1;
	}
	initDB(a){
		return new Promise((resolver, rechazar)=>{
			fetch("cont/estructura.json").then(b=>b.text()).then(c=>{
				let d=JSON.parse(c).db;
				d.forEach(d=>{
					db.version(d.version).stores(d.estructura);
				});
				db.open().then(resolver);
				self.dbjs["estructura"]=JSON.parse(c);
				if(typeof cryptoJS=="undefined"){
					self.dbjs.estructura.userdb.links[0].uid=preCrypto.random();
				}else{
					self.dbjs.estructura.userdb.links[0].uid=cryptoJS.rnd;
				}
			});
		});
	}
	chk(a){
		return db.Usuarios.where("Usuario").equals(a).toArray(b=>{
			if(b.length==0){
				return false
			}
			return true;
		});
	}
	registrar(a){
		return Promise.all([
			db.Usuarios.add({
				Usuario: a.usuario,
				pgp: a.pgp
			}),
			db.Tablas.add({
				Usuario: a.usuario,
				db: a.db,
				fecha: Date.now()
			})
		]);
	}
	backup(a){
		return new Promise((resolver, rechazar)=>{
			db.Tablas.where("Usuario").equals(a.usuario).toArray().then(a=>{
				resolver(a[0]);
			});
		});
	}
	importar(a){
		return db.Usuarios.put({Usuario: a.Usuario, pgp: a.pgp});
	}
	restaurar(a){
		return db.Tablas.put({Usuario: a.Usuario, db: a.db, fecha: a.fecha});
	}
	async dbsync(){
		let db=await this.backup(self.cryptoJS.creds);
		let msg=await cryptoJS.firmar(db);
		return msg.data;
	}
}
class preCrypto{
	static random(){
		return Math.abs(crypto.getRandomValues(new Int32Array(1))[0]).toString(16).substr(0, 6);
	}
}
Promise.all([dbload]).then(()=>{
	self.db=new Dexie("vikserver");
	self.dbjs=new dbjs();
	self.dbProgress=self.dbjs.initDB().then(()=>{
        if(typeof window!=="undefined") cryptoJS.importarLocales();
    });
});
