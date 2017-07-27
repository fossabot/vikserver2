const express=require("express");
const php=require("node-php");
const path=require("path");
const propiedades={
	root: path.resolve(__dirname),
	puerto: 8888 || process.env.PORT,
	index: "/index.html",
	php: RegExp(/(.*\.php)/g),
	noPHP: RegExp(/.*/)
};
var app=express();
app.use(propiedades.php, php.cgi(propiedades.root));
app.get("/", (req, res)=>{
	res.sendFile(propiedades.root+propiedades.index);
});
app.get(propiedades.noPHP, (req, res)=>{
	res.sendFile(propiedades.root+req.url);
});
app.listen(propiedades.puerto, ()=>{
	console.log("Servidor iniciado en el puerto "+propiedades.puerto);
});
