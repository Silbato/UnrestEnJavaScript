const { response } = require("express")


const validarArchivoUpload = (req, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({
            msg: '¿No ha subido archivos? - Validar archivos...'
        });

    }
    next();
}

module.exports = { validarArchivoUpload }