"use-strict";
let deps=["jqueryUI", "bootstrap", "dexie"];
load(deps).then(a=>{
	console.log(a);
	load("core/index.js");
});
