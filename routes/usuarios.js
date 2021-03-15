const { Router } = require('express');
const { usuariosGet, usuariosDelete, usuariosPost, usuariosPut } = require('../controllers/usuarios');

const router = Router();
/**lo ordenamos desde un controlador de direcciones de usuario, se pasan por parametro no es funcion por no tener los () */
router.get('/', usuariosGet);
router.put('/:id', usuariosPut);
router.delete('/', usuariosDelete);
router.post('/', usuariosPost);



module.exports = router;