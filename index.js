//import
const express = require("express");
const conectarDB = require("./config/db");
const cors = require('cors');

//crear el servidor initializtions
const app = express();

//conectamos al base de datos
conectarDB();

//habilitar cors
app.use(cors());

//middelware
//habiliatar json
app.use(express.json({ extended: true }));

//puerto de la app
const port = process.env.port || 4000;

//definir la pagina principal
app.get("/", (req, res) => {
  res.send("Hola Mundo");
});

//import routes
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/proyectos", require("./routes/proyectos"));
app.use("/api/tareas", require("./routes/tareas"));



//listen server on point
app.listen(port, '0.0.0.0', () => {
  console.log(`El servidor esta funcionando en el puerto ${PORT}`);
});
