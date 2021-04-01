const { TokenExpiredError } = require('jsonwebtoken');
const { Categoria, Producto } = require('../models');
const Role = require('../models/role')
const Usuario = require('../models/usuario')


const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la BD.`)
    }
}


const emailExiste = async (correo = '') => {
    const emailExistente = await Usuario.findOne({ correo });
    if (emailExistente) {
        throw new Error(`El correo: ${correo} ya esta siendo usado por otro usuario`);
    }
}
const existeUsuarioPorId = async (id) => {
    const existeUser = await Usuario.findById(id);
    if (!existeUser) {
        throw new Error(`El id: ${id} no existe o no pertenece a un usuario activo. O simplemente es erroneo. `);
    }

}
const existeCategoria = async (id) => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`El id: ${id} no corresponde a una categoria existente...`)
    }
}
const existeProducto = async (id) => {
    const existeProd = await Producto.findById(id);
    if (!existeProd) {
        throw new Error(`El id:${id} no corresponde a un producto exisitente...`)
    }
}
const coleccionesPermitidas = (coleccion = '', colecciones = '') => {
    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(`La coleccion :" ${coleccion} "no es permitida`);
    }
    return true;
}
module.exports = { esRolValido, emailExiste, existeUsuarioPorId, existeCategoria, existeProducto, coleccionesPermitidas }