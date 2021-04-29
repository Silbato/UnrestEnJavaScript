const { Router, response } = require('express');
const { check } = require('express-validator');
const { borrarProducto, crearProducto, obtenerProducto, obtenerProductos, actualizarProducto } = require('../controllers/productos');
const { existeProducto } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarProducto } = require('../middlewares/validar-producto');
const { tieneRol } = require('../middlewares/validar-rol');

const router = Router();

router.get('/', obtenerProductos);
router.get('/:id', [check('id', 'No es id de mongo valido').isMongoId(), check('id').custom(existeProducto), validarCampos], obtenerProducto);
router.post('/', [validarJWT, validarProducto], crearProducto);
router.delete('/:id', [validarJWT, check('id', 'No es id de mongo valido').isMongoId(), check('id').custom(existeProducto), validarCampos], borrarProducto);
router.put('/:id', [validarJWT, check('id', 'No es id de mongo valido').isMongoId(), check('id').custom(existeProducto), tieneRol('ADMIN'), validarCampos], actualizarProducto);
module.exports = router