const { Router, response } = require('express');
const { check } = require('express-validator');
const { validarJSON, validarjwt } = require('../middlewares');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { crearCategoria, obtenerCategoria, obtenerCategorias } = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');



const router = Router();

//router.get('/api/categorias', validarCampos, categorias);
router.get('/', obtenerCategorias);
router.get('/:id', [check('id', 'No es id de mongo valido').isMongoId(), check('id').custom(existeCategoria), validarCampos], obtenerCategoria);
router.post('/', [validarJWT, check('nombre', 'El nombre es obligatorio.').not().isEmpty(), validarCampos],
    crearCategoria);
router.put('/:id',);
router.delete('/:id');

/**
 router.post('/', [validarJWT],
    (req, res) => {
        res.json('post');
    });
 */



module.exports = router