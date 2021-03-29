const { response } = require("express");
const coleccionesPermitidas = ['categorias', 'productos', 'roles', 'usuarios'];
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models/');

const buscarCategoria = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: [(categoria) ? [categoria] : []]
        });
    }
    /**no nos importa como este escrito con el 'i' busca toda coincidencia */
    const regex = new RegExp(termino, 'i');
    const categoriaa = await Categoria.find({ nombre: regex, estado: true });
    res.json({
        results: categoriaa
    });
}
const buscarUsuario = async (termino = '', res = response) => {
    /**validamos si el termino es valido */
    const esMongoID = ObjectId.isValid(termino);
    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: [(usuario) ? [usuario] : []]
        })
    }
    const regex = new RegExp(termino, 'i');
    /**Saldria si fuera por otro termino */
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });
    res.json({
        results: usuarios
    });
}
const buscarProducto = async (termino = '', res = response) => {
    /**Hacerle el populate cuando ya tengan la categoria agregada */
    const esMongoID = ObjectId.isValid(termino);
    if (esMongoID) {
        const producto = await Producto.findById(termino).populate('usuario', 'nombre');
        return res.json({
            results: [(producto) ? [producto] : []]
        })
    }
    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({ nombre: regex, estado: true }).populate('usuario', 'nombre');
    res.json({
        results: productos
    });
}

const buscar = (req, res = response) => {
    const { coleccion, termino } = req.params;
    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.json({
            msg: `Las colecciones permitidas: ${coleccionesPermitidas}`
        })
    }
    switch (coleccion) {
        case 'usuarios':
            buscarUsuario(termino, res);
            break;
        case 'categorias':
            buscarCategoria(termino, res);
            break;
        case 'productos':
            buscarProducto(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'Falta realizar esta nueva busqueda.'
            })
    }


}

module.exports = {
    buscar
}