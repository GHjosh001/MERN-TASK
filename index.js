//import
const express = require('express');
const conectarDB = require('./config/db')

//crear el servidor initializtions
const app = express();

//conectamos al base de datos
conectarDB();



//puerto de la app
const PORT = process.env.PORT || 4000;

//definir la pagina principal
app.get('/', (req, res)=>{
    res.send('Hola Mundo');
});

//listen server on point
app.listen(PORT, ()=>{
    console.log(`El servidor esta funcionando en el puerto ${PORT}`)
})
