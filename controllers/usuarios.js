const { response, request } = require('express');

const usuariosGet = (req = request, res = response) => {
    const query = req.query;
    res.json({
        msg: 'get API - controlador usuarios',
        query
    });
}
const usuariosPost = (req, res = response) => {
    const body = req.body;
    res.json({
        msg: 'post API - controlador usuarios',
        body
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