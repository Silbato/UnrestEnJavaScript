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
module.exports = { esRolValido, emailExiste, existeUsuarioPorId }