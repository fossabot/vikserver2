window.dbload=load("dexie");
Promise.all([dbload]).then(()=>{
	window.db=new Dexie("vikserver");
	initDB().then(cryptoJS.importarLocales);
});
function initDB(a){
	return new Promise((resolver, rechazar)=>{
		fetch("cont/estructura.json").then(b=>b.text()).then(c=>{
			let d=JSON.parse(c).db;
			d.forEach(d=>{
				db.version(d.version).stores(d.estructura);
			});
			db.open().then(resolver);
			window.dbjs["estructura"]=JSON.parse(c);
		});
	});
}
window.dbjs={
	chk: function(a){
		return db.Usuarios.where("Usuario").equals(a).toArray(b=>{
			if(b.length==0){
				return false
			}
			return true;
		});
	},
	registrar: function(a){
		return Promise.all([
			db.Usuarios.add({
				Usuario: a.usuario,
				pgp: a.pgp
			}),
			db.Tablas.add({
				Usuario: a.usuario,
				db: a.db
			})
		]);
	},
	backup: function(a){
		return new Promise((resolver, rechazar)=>{
			db.Tablas.where("Usuario").equals(a.usuario).toArray().then(a=>{
				resolver(a[0]);
			});
		});
	},
	importar: function(a){
		console.log(a);
		return db.Usuarios.put({Usuario: a.Usuario, pgp: a.pgp});
	},
	restaurar: function(a){
		return db.Tablas.put({Usuario: a.Usuario, db: a.db});
	}
}
