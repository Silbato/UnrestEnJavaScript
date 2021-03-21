const jwt = require('jsonwebtoken');

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

module.exports = { generarJWT }