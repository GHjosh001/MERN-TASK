//route proyectos
const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController')
const auth = require('../middleware/auth');
const {check} = require('express-validator');


//Crea un proyecto y enlaza con user
//api/proyectos
router.post('/',
    auth,
    [
        check('nombre','El nombre del proyecto').not().isEmpty()
    ],
    proyectoController.crearProyecto

);

//obtine los proyectos del usuario en token
//api/proyectos
router.get('/',
    auth,
    proyectoController.obtenerProyectos

);


//Actualiza un proyecto via ID
//api/proyectos
router.put('/:id',
auth,
[
    check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
],
proyectoController.actualizarProyecto

);





///Elimina un proyecto
///api/proyectos
router.delete('/:id',

auth,
proyectoController.eliminarProyecto


)


module.exports = router;