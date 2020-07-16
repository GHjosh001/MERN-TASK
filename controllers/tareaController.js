const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

//Crea una nueva tarea
exports.crearTarea = async (req, res) => {
  //Revisar si hay errores este codigo se une a expres validator
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    //Extraer el proyecto y comprobar si existe
    const { proyecto } = req.body;

    const existeProyecto = await Proyecto.findById(proyecto);
    if (!existeProyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //revisar si el proyecto actual pertenece alusuario autenticado
    //verificar el creador del proyecto'
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    const tarea = new Tarea(req.body);
    await tarea.save();
    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Obtiene las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
  //
  try {
    //Extraer el proyecto y comprobar si existe
    const { proyecto } = req.body;

    const existeProyecto = await Proyecto.findById(proyecto);

    if (!existeProyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //revisar si el proyecto actual pertenece alusuario autenticado
    //verificar el creador del proyecto'
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //Obtener las tareas por proyectos
    const tareas = await Tarea.find({ proyecto });

    res.json({ tareas });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Actualizar tarea
exports.actualizarTarea = async (req, res) => {
  try {
    //Extraer el proyecto y comprobar si existe
    const { proyecto, nombre, estado } = req.body;

    //si la tarea existe
    let tarea = await Tarea.findById(req.params.id);
    if(!tarea){
      return res.status(404).json({msg: 'No existe esa tarea'});
    }



    
    const existeProyecto = await Proyecto.findById(proyecto);

    //revisar si el proyecto actual pertenece alusuario autenticado
    //verificar el creador del proyecto'
    console.log(existeProyecto.creador.toString())
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    
    //Crear un objeto con la nueva informacion
    const nuevaTarea = {};

    if(nombre)nuevaTarea.nombre=nombre;
    if(estado)nuevaTarea.estado=estado;

    //Guardar la tarea
    tarea = await Tarea.findOneAndUpdate({_id : req.params.id}, nuevaTarea, {new: true})
    res.json({tarea});


  } catch (error) {
    console.log(error);
    res.status(500).send("hubo un error");
  }
};


//Eliminar Tarea
exports.eliminarTarea = async(req, res)=>{

  try {
     //Extraer el proyecto y comprobar si existe
     const { proyecto, nombre, estado } = req.body;

     //si la tarea existe
     let tarea = await Tarea.findById(req.params.id);
     if(!tarea){
       return res.status(404).json({msg: 'No existe esa tarea'});
     }
 
 
 
     
     const existeProyecto = await Proyecto.findById(proyecto);
 
     //revisar si el proyecto actual pertenece alusuario autenticado
     //verificar el creador del proyecto'
     console.log(existeProyecto.creador.toString())
     if (existeProyecto.creador.toString() !== req.usuario.id) {
       return res.status(401).json({ msg: "No autorizado" });
     }

     //eliminar

     await Tarea.findOneAndRemove({_id: req.params.id});
     res.json({msg: 'Tarea Eliminada'});
 
  } catch (error) {
    console.log(error);
    res.status(404).json({msg: 'no existe esa tarea'});
    
  }

}
