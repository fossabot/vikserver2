"use-strict";
//INIT
if (typeof process == "undefined"){
	throw new Error("Test cannot run into a navigator");
}
console.log("Testing from NodeJS");
console.log("Preparing modules...");
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
	let lista=await list("lib/core/*.js");
	lista=lista.stdout.split("\n");
	lista.pop();
	(await list("./*.js")).stdout.split("\n").forEach(a=>lista.push(a));
	lista.pop();
	console.log(lista);
	let errores=[];
	for(let i in lista){
		let actual=lista[i];
		console.log("Testing "+actual);
		try{
			let salida=await xc(`babel ${actual}`);
			console.log(`${actual} tested OK`);
		}catch(e){
			console.log(`${actual} has errors`);
			console.error(e);
			errores.push(actual);
		}
	}
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
