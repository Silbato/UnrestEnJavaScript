const validarCampos = require('./validar-campos');
const validarJSON = require('./validar-JSON');
const validarjwt = require('./validar-jwt');
const validarrol = require('./validar-rol');
const validarArchivoUpload = require('./validar-archivo');

module.exports = {
    validarArchivoUpload,
    validarCampos,
    validarJSON,
    validarjwt,
    validarrol
}