const { Router } = require('express');
const { usuariosGet, usuariosDelete, usuariosPost, usuariosPut } = require('../controllers/usuarios');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();
/**lo ordenamos desde un controlador de direcciones de usuario, se pasan por parametro no es funcion por no tener los () */
router.get('/', usuariosGet);
router.put('/:id', usuariosPut);
router.delete('/', usuariosDelete);
/**Path , middlewares en un array, y despues el controador al final(usuariosPOST) */
router.post('/', [
    check('correo', 'El correo no es valido').isEmail(),
    check('nombre', 'El nombre no es valido').not().isEmpty(),
    check('password', 'El password es obligatorio y más de 6 letras').isLength({ min: 6 }).not().isEmpty(),
    check('rol', 'El rol no es valido').isIn(['ADMIN', 'USER']),
    validarCampos
], usuariosPost);



module.exports = router;