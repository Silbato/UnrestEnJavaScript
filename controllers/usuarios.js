const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');


const usuariosGet = (req = request, res = response) => {
    const query = req.query;
    res.json({
        msg: 'get API - controlador usuarios',
        query
    });
}
const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });
    /**Ver si el correo existe */
    const existeEmail = await Usuario.findOne({ correo: correo });
    if (existeEmail) {
        return res.status(400).json({
            msg: 'Correo duplicado o ya registrado.'
        });

    }
    /**Encriptar pass */
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);
    /**Guardar en bd */
    await usuario.save();
    res.json({
        msg: 'post API - controlador usuarios',
        usuario
    });
}
const usuariosDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - controlador usuarios'
    });
}
const usuariosPut = (req, res = response) => {
    const id = req.params.id;
    res.json({
        msg: 'put API - controlador usuarios',
        id
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosDelete,
    usuariosPut
}