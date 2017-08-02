load("dexie").then(()=>{
	window.db=new Dexie("vikserver");
	fetch("cont/estructura.json").then(a=>text()).then(a=>{
		let b=JSON.parse(a);
		Object.keys(b).forEach(c=>{
			db.version(b.version, b.estructura);
		});
		
	});
});
