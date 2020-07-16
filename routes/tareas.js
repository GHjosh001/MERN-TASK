//route tareas
const express = require("express");
const router = express.Router();

//route proyectos
const tareaController = require("../controllers/tareaController.js");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

//crea una tarea
//api/tareas
router.post('/',
  auth,
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("proyecto", "El Proyecto es obligatorio").not().isEmpty(),
  ],
  tareaController.crearTarea
);

//obtener las tareas por proyecto
//api/tarea
router.get('/', auth, tareaController.obtenerTareas);

//actualizar tarea
//api/tareas
router.put('/:id',

  auth,
  tareaController.actualizarTarea
);


//Eliminar tarea
//api/delete
router.delete('/:id',

  auth,
  tareaController.eliminarTarea

)


module.exports = router;
