
const { Router, response } = require('express');
const { check } = require('express-validator');
const { getSalas, getSala, setSala, borrarSala, actualizarSala } = require('../controllers/salas');
const { validarJWT } = require('../middlewares/validar-jwt');
const { existeSala } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { tieneRol } = require('../middlewares/validar-rol');
const router = Router();

router.get('/', getSalas);
router.get('/:id', getSala);
router.delete('/:id', [validarJWT, check('id', 'No es id mongo valido').isMongoId(), check('id').custom(existeSala), validarCampos], borrarSala);
//router.delete('/:id', [validarJWT, check('id', 'No es id de mongo valido').isMongoId(), check('id').custom(existeProducto), validarCampos], borrarProducto);
//router.get('/:id', [check('id', 'No es id de mongo valido').isMongoId(), check('id').custom(existeCategoria), validarCampos], obtenerCategoria);
router.post('/', [validarJWT, tieneRol('ADMIN'), validarCampos], setSala);
router.put('/:id', [validarJWT, check('id', 'No es id mongo valido').isMongoId(), check('id').custom(existeSala), tieneRol('ADMIN'), validarCampos], actualizarSala);






module.exports = router