"use-strict";
console.log("__VIKSERVER TEST ENGINE__")
//INIT
if (typeof process == "undefined"){
	throw new Error("Test cannot run into a navigator");
}
console.log("Preparing Node modules...");
const util=require("util");
const exec=util.promisify(require("child_process").exec);
//TESTS
testSyntax().then(a=>{
	console.log("Syntax tested OK with exit status "+a);
	process.exit(a);
}).catch(e=>{
	console.error("Syntax test failed with status "+e.toString());
	console.error(e);
	process.exit(e.number);
});
//FUNCTIONS
async function testSyntax(){
	console.log("Getting file list...");
	let lista=await list("lib/core/*.js");
	lista=lista.stdout.split("\n");
	lista.pop();
	(await list("./*.js")).stdout.split("\n").forEach(a=>lista.push(a));
	lista.pop();
	console.log(`Files to test: ${lista.join(",")}`);
	let errores=[];
	for(let i in lista){
		let actual=lista[i];
		console.log("Testing "+actual);
		try{
			let salida=await xc(`babel ${actual}`);
			console.log(`${actual} test OK`);
		}catch(e){
			console.log(`${actual} contains errors`);
			console.error(e);
			errores.push(actual);
		}
	}
	console.log(`Testing function ended after checking ${lista.length} files`);
	let err=new Error(`Files ${errores.join(",")} contained errors. Please fix it`);
	if(errores.length>0){
		err.number=errores.length;
		throw err;
	}
	return 0;
}
async function list(a){
	let items= a||"";
	return await xc(`ls ${items}`);
}
async function xc(a){
	const {stdout, stderr} =await exec(a);
	return {stdout, stderr};
}
