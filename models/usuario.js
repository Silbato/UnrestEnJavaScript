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
/**Monngoose le cambia a Usuarios a la coelccione en la bd */
module.exports = model('Usuario', UsuarioSchema);