const { Router, response } = require('express');
const { check } = require('express-validator');

const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRol } = require('../middlewares/validar-rol');
const { validarCampos } = require('../middlewares/validar-campos');
const { crearCategoria, obtenerCategoria, obtenerCategorias, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');



const router = Router();

//router.get('/api/categorias', validarCampos, categorias);
router.get('/', obtenerCategorias);
router.get('/:id', [check('id', 'No es id de mongo valido').isMongoId(), check('id').custom(existeCategoria), validarCampos], obtenerCategoria);
router.post('/', [validarJWT, check('nombre', 'El nombre es obligatorio.').not().isEmpty(), validarCampos], crearCategoria);
router.put('/:id', [validarJWT, check('nombre', 'El nombre de categoria es obligatorio').not().notEmpty(), check('id').custom(existeCategoria), validarCampos], actualizarCategoria);
router.delete('/:id', [validarJWT, check('id', 'No es id de mongo valido').isMongoId(), tieneRol('ADMIN'), check('id').custom(existeCategoria), validarCampos], borrarCategoria);

/**
 router.post('/', [validarJWT],
    (req, res) => {
        res.json('post');
    });
 */



module.exports = router