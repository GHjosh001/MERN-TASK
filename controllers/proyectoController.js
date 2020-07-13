const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) =>{

    //revisar si hay errores este codigo se une a expres validator
    const errores =validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }


    try {
        //Crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);

        //Guardar el creador via JWT
        proyecto.creador = req.usuario.id;
        
        //guardamos el proyecto
        proyecto.save();
        res.json(proyecto)
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}


///
///
///
//Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res)=>{


    try{
        //para ver el id, cifrado en el token
        //console.log(req.usuario);

        //trae todos los proyectos de el usuario que este en token mediante el campo creador
        const proyectos = await Proyecto.find({creador: req.usuario.id}).sort({creado:-1});
        //responde el la consulta 
        res.json({proyectos});


    }catch (error){
        console.log(error);
        res.status(500).send('hubo un error');
    }
}


//
///
///
//Actualiza un proyecto
exports.actualizarProyecto = async (req, res)=>{

     //revisar si hay errores este codigo se une a expres validator
     const errores =validationResult(req);
     if(!errores.isEmpty()){
         return res.status(400).json({errores: errores.array()})
     }


     //extraer la informacion del proyecto
     const {nombre}=req.body;
     const nuevoProyecto={};

     //preguntar y asignar el cambio al campo
     if(nombre){
        nuevoProyecto.nombre = nombre;
     }

    try {

        //revisar el ID
        //console.log(req.params.id);
        let proyecto = await Proyecto.findById(req.params.id);
        

        //Si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //va for depurables
        // console.log('usuario:',req.usuario.id);
        // console.log('creador:',proyecto.creador.toString());  
        // console.log('proyecto:',req.params.id);
             

        //verificar el creador del proyecto'
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        //actualizar
        proyecto =await Proyecto.findByIdAndUpdate({ _id: req.params.id}, {$set : nuevoProyecto}, { new: true});


        //response
        res.json({proyecto});
        




         
     } catch (error) {
         console.log(error);
         res.status(500).send('error en el servidor');
     }
 

}


//
//
/////
//Elimina un proyecto por su id
exports.eliminarProyecto = async(req, res)=>{

  try {
      //revisar el ID
        //console.log(req.params.id);
        let proyecto = await Proyecto.findById(req.params.id);
        

        //Si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //va for depurables
        // console.log('usuario:',req.usuario.id);
        // console.log('creador:',proyecto.creador.toString());  
        // console.log('proyecto:',req.params.id);
             

        //verificar el creador del proyecto'
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        //Eliminar
        await Proyecto.findOneAndRemove({ _id: req.params.id});

        res.json({msg: 'Proyecto eliminado'});



  } catch (error) {
      console.log(error);
      res.status(500).send('Error en el servidor');
      
  }


}













