const express=require("express");
const path=require("path");
const propiedades={
	root: path.resolve(__dirname),
	puerto: 8888 || process.env.PORT,
	index: "/index.html",
	path: RegExp(/.*/)
};
var app=express();
app.get("/", (req, res)=>{
	res.sendFile(propiedades.root+propiedades.index);
});
app.get(propiedades.path, (req, res)=>{
	if(req._parsedUrl.path.match(/(.*\.php)/)){
		res.status(403).send("<h2>Lo sentimos, pero no podemos devolver ese tipo de archivos</h2>");
	}else{
		res.sendFile(propiedades.root+req._parsedUrl.pathname);
	}
});
app.listen(propiedades.puerto, ()=>{
	console.log("Servidor iniciado en el puerto "+propiedades.puerto);
});
