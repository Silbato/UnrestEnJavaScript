const { response, request } = require('express');



const validarProducto = async (req = request, res = response, next) => {

    /**Validar si el token es correcto  */
    try {

        const { nombre, descripcion } = req.body;
        if (!nombre || nombre.lengh === 0) {
            return res.status(400).json({
                msg: 'No hay nombre'
            })
        }

        if (!descripcion || descripcion.lengh === 0) {

            return res.status(400).json({
                msg: 'No hay descripcion del articulo.'
            })
        }

        next();
    } catch (error) {

        res.status(400).json({
            msg: 'Error con los campos nombre o descripcion del articulo.'
        })
    }

}

module.exports = {
    validarProducto
};