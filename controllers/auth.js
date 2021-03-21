const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async (req = request, res = response) => {
    const { correo, password } = req.body;

    try {
        /**Veo si email existe y esta activo */
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                mse: 'Usuario incorecto, puede ser inactivo, inexistente, erroneo, etc. ...'
            });
        }
        if (!usuario.estado) {
            return res.status(400).json({
                mse: 'Usuario inactivo, o el estado sería falso?, de aviso a un administrador para el alta?, etc.  ...'
            });
        }
        /**Ver la contraseña, el bcryptjs compara el password con el usuario.password */
        const validPass = bcryptjs.compareSync(password, usuario.password);
        if (!validPass) {
            return res.status(400).json({
                mse: 'Usuario incorrecto, la contraseña seria erronea?, ...'
            });
        }
        /**Generar el jwt */
        const token = await generarJWT(usuario.id);


        res.json({
            msg: 'post API - auth',
            usuario,
            password,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el Admin, puede ser porblema del JSON, o en campos del login, etc. ...'
        });
    }

}
module.exports = { login }
