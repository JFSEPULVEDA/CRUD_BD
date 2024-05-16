const { Router } = require("express");
const express = require("express");
//const passport =require('passport');

const archivo = express.Router();

const User = require("../modelado/registro");

const orden = require("../modelado/crear_pedidos");

//const passport = require ('passport');

const bcrypt = require("bcrypt");

archivo.get("/", (req, res, next) => {
  res.render("inicio");
});

archivo.get("/formulario", (req, res, next) => {
  res.render("formulario");
});

archivo.post("/formulario", async (req, res) => {
  const { email, password, date } = req.body;

  const E = await User.findOne({ email });
  if (E) {
    res.send(
      '<div style="text-align: center; color: green;">El email ya existe</div>'
    );
  } else {
    const nuevoU = new User({ email, password, date });
    await nuevoU.save();
    res.send(
      '<div style="text-align: center; color: green;">El documento se guardó satisfactoriamente</div>'
    );
  }
});

archivo.get("/inicioSesion", (req, res, next) => {
  res.render("inicioSesion");
});

archivo.post("/inicioSesion", async (req, res) => {
  // cuando el usuario ingrese al sistema debe digitar la clave normal
  const { email, password, date } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    //vamos a verificar el password se digital en el formulario
    var clavex = req.body.password;
    // p => la clave encriptada, esta en la BD
    var p = user.password;
    bcrypt.compare(clavex, p, function (error, isMatch) {
      if (error) {
        throw error; //Decision
      } else if (!isMatch) {
        res.send("la contraseña no es correcta");
      } else {
        res.render("home");
      }
    });
  } else {
    res.render("formulario");
  }
});

// En esta parte se hace la solicitud  de una conexión para que los datos de crear pedido  puedan ser guardados en la base de datos.
archivo.get("/crear_pedido", (req, res, next) => {
  res.render("crear_pedido");
  //red.send('formulario');
});

archivo.post("/crear_pedido", async (req, res) => {
  const { id_pedido, comprador, valor, articulo, cantidad, descripcion, total, date } = req.body;

  const p = await orden.findOne({ id_pedido });

  if (p) {
    res.send("el pedido ya existe");
  } else {
   
    const nuevoP = new orden({
      id_pedido,
      comprador,
      valor,
      articulo,
      cantidad,
      descripcion,
      total,
      date
      
    });
    await nuevoP.save();

    res.send('el pedido se guardo satisfactoriamente');
  }
});




//get => consultar pedidos
archivo.get("/Consultar_p", (req, res, next) => {
  res.render("Consultar_p");
});

//consultar pedidos (post)
archivo.post("/Consultar_p", async (req, res) => {
  const { id_pedido } = req.body;

  try {
    // Aquí validamos si el pedido existe
    const pedido = await orden.findOne({ id_pedido });

    if (pedido) {
      // Si el pedido existe, lo encontramos y lo enviamos como respuesta
      res.json(pedido);

      /*const cond = await orden
        .findOne({ id_pedido }, { id_pedido: 1 })
        .sort("-created");
      //console.log(pedido);
      res.send(pedido);*/
    } else {
      // Si el pedido no existe, enviamos un mensaje de error
      res.status(404).json({ error: "El pedido no existe" });
      //res.send("El pedido no existe");
    }
  } catch (err) {
    // Manejar cualquier error que ocurra durante la ejecución
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
    //res.status(500).send("Error interno del servidor");
  }
});

// Aqui vamos a implementar el update

archivo.get("/update_p", (req, res, next) => {
  res.render("update_p");
});

archivo.post("/update_p", async (req, res) => {
  const { id_pedido, descripcion } = req.body;
  const update_p = await orden.findOne({ id_pedido });

  if (update_p) {
    //let instanciar variable
    const body = req.body;
    try {
      await orden.updateOne(
        { id_pedido },
        { $set: { descripcion: body.descripcion } }
      );
      res.json({
        resultado: true,
        msg: "La actualización se realizó correctamente",
      });
    } catch (error) {
      res.json({
        resultado: false,
        msg: "No se pudo realizar la actualización",
        error: error.message,
      });
    }
  } else {
    res.send("El pedido no existe");
  }
});

//Implementación del delete
archivo.get("/delete_doc_p", (req, res, next) => {
  res.render("delete_doc_p"); // Esto renderizará una vista, asegúrate de tenerla definida
});

archivo.post("/delete_doc_p", async (req, res) => {
  const { id_pedido } = req.body;

  try {
    // Aquí vamos a validar que el pedido exista
    const delete_p = await orden.findOne({ id_pedido });

    if (delete_p) {
      await orden.deleteOne({ id_pedido });
      res.write(
        '<audio autoplay><source src="/audio/delete.mp3" type="audio/mpeg"></audio>'
      );
      res.write("El pedido ha sido eliminado");
      res.end();
    } else {
      res.write(
        '<audio autoplay><source src="/audio/no_existe.mp3" type="audio/mpeg"></audio>'
      );
      res.write("Pedido no existe por favor validar");
      res.end();
    }
  } catch (error) {
    console.error("Error pedido eliminado", err);
    res.status(500).send("Error al intentar borrar el pedido");
  }
});



module.exports = archivo;

