const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');


const usuariosGet = async (req = request, res = response) => {
    const query = req.query;
    const filtroEstadoAtivo = { estado: true };
    const { limite = 5, desde = 0 } = req.query;
    //const total = await Usuario.countDocuments(filtroEstadoAtivo);
    //const usuarios = await Usuario.find(filtroEstadoAtivo).skip(Number(desde)).limit(Number(limite));
    /**Armo una coleccion de promesas para que no sea autobloquenate como arriba, y las ejecuta en forma simultanea y no en secuencia */
    /**Si diera erroa alguna de las de adentro, lo devuevve como coleccion */
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(filtroEstadoAtivo),
        Usuario.find(filtroEstadoAtivo).skip(Number(desde)).limit(Number(limite))
    ]);

    res.json({
        msg: 'get API - controlador usuarios',
        total,
        usuarios,
    });
}
const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });
    /**Ver si el correo existe */

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
const usuariosDelete = async (req, res = response) => {
    const { id } = req.params;

    /**Borrado Fisico, ya se hizo validacion de que exista en los paths */
    //const usuario = await Usuario.findByIdAndDelete(id);
    /** Borrado logico o estado inactivo*/
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
    res.json({
        msg: 'delete API - controlador usuarios',
        usuario
    });
}
const usuariosPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    /**ver si existe en la BD */
    if (password) {
        /**Encriptar pass */
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }
    const usuarioDB = await Usuario.findByIdAndUpdate(id, resto);
    /** */
    res.json({
        msg: 'put API - controlador usuarios',
        usuarioDB
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosDelete,
    usuariosPut
}