const { Router, response } = require('express');
const { check } = require('express-validator');

const { cargarArchivo, actualizarImagen, getImagen, actualizarCloud } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers/db-validators');
const { validarArchivoUpload } = require('../middlewares/validar-archivo');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

router.post('/', validarArchivoUpload, cargarArchivo);
router.put('/:coleccion/:id', [
    validarArchivoUpload,
    check('id', 'Id debe ser de Mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarCloud);
router.get('/:coleccion/:id', [
    check('id', 'Id debe ser de Mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], getImagen);
module.exports = router