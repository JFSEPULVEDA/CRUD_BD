const bodyParser = require("body-parser");
//body-parser:procesa las solicitudes que le van a hacer a través del http
const express = require("express");
//express:Permite que el programa se ejecute en ambiente web
const puerto = express();
//import
const exphbs = require("express-handlebars"); // Import here

//permite generar vistas html
const path = require("path");
//nos permite trabajar con la ruta de los archivos

require("./database");
//vamos a configurar el puerto

puerto.set("escuchar", 9091);

puerto.use(express.json());
puerto.use(bodyParser.json());
puerto.use(bodyParser.urlencoded({ extended: true }));

//aqui estamos configurando el engine

puerto.set("views", path.join(__dirname, "vistas"));

//establecemos el motor de plantillas para poder utilizarlo en nuestra aplicación, es un metodo de puerto
puerto.engine(
  "hbs",
  exphbs.engine({
    extname: "hbs",
    defaultLayout: false,
    layoutsDir: "views/layouts",
  })
);

puerto.set("view engine", ".hbs");
//son las dos clases de puertos fisicos(de la maquina)y logicos(de la red)
// => para definir una funcion
puerto.listen(puerto.get("escuchar"), () => {
  console.log("servidor conectado", puerto.get("escuchar"));
});

puerto.use(require("./rutas/index.js"));
puerto.use(express.static(path.join(__dirname, 'public')));

//enviar errores al controlador de errores del servidor
