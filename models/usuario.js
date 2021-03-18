const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'Nombre Obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'Correo Obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Contraseña Obligatoria']
    },
    img: {
        type: String,

    },
    rol: {
        type: String,
        required: true,
        enum: ['ADMIN', 'USER']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});
/**Sobre escribimos el metodo toJSON para que cargue solo los datos menos el password y no lo envie para res */
UsuarioSchema.methods.toJSON = function () {
    const { __v, password, ...usuario } = this.toObject();
    return usuario;
}

/**Monngoose le cambia a Usuarios a la coelccione en la bd */
module.exports = model('Usuario', UsuarioSchema);