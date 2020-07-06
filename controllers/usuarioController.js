const Usuario = require("../models/Usuario");
//para hashear
const bcryptjs = require("bcryptjs");
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    //revisar si hay errores
    const errores = validationResult(req);
    if( !errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }




  //extraer email y password
  const { email, password } = req.body;

  try {
    //revisar que el usuario registro sea unico
    let usuario = await Usuario.findOne({ email });
    //Existe o no?
    if (usuario) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }

    //crea el nuevo usuario, usando schema
    usuario = new Usuario(req.body);

    //hashear el password
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(password, salt);

    //guardar usuario
    await usuario.save();

    //crear y firmar el jwt
    const payload = {

      usuario:{
        id:usuario.id
      }

    };

    //firmar JWT json web token
    jwt.sign(payload, process.env.SECRETA, {
      expiresIn:3600
    },(error, token)=>{

      if(error)throw error;

      //mensaje de confirmacion
      res.json({token})

    });

      // //mensaje
      // res.json({ msg: "Usuario creado correctamente" });

  
  } catch (error) {
    console.log(error);
    res.status(400).send("Hubo un error");
  }
};
