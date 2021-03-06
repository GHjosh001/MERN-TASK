const Usuario = require("../models/Usuario");
//para hashear
const bcryptjs = require("bcryptjs");
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');



exports.autenticarUsuario = async (req, res) =>{

     //revisar si hay errores
     const errores = validationResult(req);
     if( !errores.isEmpty()){
         return res.status(400).json({errores: errores.array()})
     }
     
    //  console.log(req.body);

     //Extraer el email y password

     const { email, password} = req.body;


     try {
         //revisar que sea un usuario registrado
        let usuario= await Usuario.findOne({email});
        //si el user no existe
        if(!usuario){
            return res.status(400).json({msg: 'Este usuario no existe'})
        }

        //Revisar el password
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        //si el password no es correcto
        if(!passCorrecto){
            return res.status(400).json({msg: 'Password incorrecto'});
        }

        //Si todo es correcto crear y firmar el jwt
    const payload = {

        usuario:{
          id:usuario.id
        }
  
      };
  
      //firmar JWT json web token
      jwt.sign(payload, process.env.SECRETA, {
        expiresIn:3600000
      },(error, token)=>{
  
        if(error)throw error;
  
        //mensaje de confirmacion, devuelve el token
        res.json({token})
  
      });
  
    } catch (error) {
      console.log(error);
      res.status(400).send("Hubo un error");
    }
  

}

exports.usuarioAutenticado = async (req, res)=>{


  try {
    
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    res.json({usuario});

  } catch (error) {
    console.log(error)
    res.status(500).json({msg: 'hubo un error'})
  }


}