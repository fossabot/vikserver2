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
	}
}
