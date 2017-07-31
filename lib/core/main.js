"use-strict";
let deps=["jqueryUI", "bootstrap", "dexie", "core/index.css"];
load(deps).then(a=>{
	console.log(a);
	load("core/index.js");
});
