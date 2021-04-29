const jwt = require('jsonwebtoken');
const { Usuario } = require('../models/index');

const generarJWT = (uid = '') => {
    /**La idea seria recibir solo el uid para almacenarlo en el payload */
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => {
            /**opciones del callback, si hay error o se genera bien el token */
            if (err) {
                console.log(err);
                reject('No se puedo generar el token,...');
            } else {
                resolve(token);
            }
        })
    })

}
const comprobarJWT = async (token = '') => {

    try {

        if (token.length < 10) {
            return null;
        }

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        console.log(uid);
        const usuario = await Usuario.findById(uid);
        console.log(usuario);
        if (usuario) {
            if (usuario.estado) {
                return usuario;
            } else {
                return null;
            }
        } else {
            return null;
        }

    } catch (error) {
        return null;
    }
}
module.exports = { generarJWT, comprobarJWT }