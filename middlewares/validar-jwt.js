const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token?, es invalido?, etc. ...'
        })

    }
    /**Validar si el token es correcto  */
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        /**Leer el Usuario Correcto al uid */
        const user = await Usuario.findById(uid);
        /**Si no hay usuario o es undefined */
        if (!user) {
            return res.json({
                msg: 'Usuario no existente. Pero el token seria valido... O-o'
            })
        }
        /**Ver que segun su uid, su estado no este false pq no deberia poder ingresar a su cuenta */
        if (!user.estado) {

            return res.status(401).json({
                msg: 'Token invalido - Usuario dado de baja. Comuncarse con un administrador.'
            })
        }
        req.usuario = user;
        next();
    } catch (error) {
        console.log(`Error por token invalido: ----->${error}`);
        res.status(401).json({
            msg: 'Error al validar token jwt. Podrian ser varias las posibles causas...Pero, token vencido.'
        })
    }

}

module.exports = {
    validarJWT
};