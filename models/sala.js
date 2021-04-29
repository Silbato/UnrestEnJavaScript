const { Schema, model } = require('mongoose');
const SalaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'Nombre Obligatorio']
    },
    estado: {
        type: Boolean,
        default: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    fechaInicio: {
        type: Date,
    },
    descripcion: {
        type: String,
        required: [true, 'Descripción Obligatoria']
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: false
    },
    martillero: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'

    },
    cantidadArticulos: {
        type: Number,
        default: 0
    },
    cantidadArticulosVendidos: {
        type: Number,
        default: 0
    },
    categoria: {
        type: String,
        default: 'General'
    },
    articulos:
        [
            {
                type: Schema.Types.ObjectId,
                ref: 'Producto'
            }]

})

SalaSchema.methods.toJSON = function () {
    const { __v, _id, ...sala } = this.toObject();
    /**Le cambia el nombre a la propiedad, de _id a uid en todos los lugares que usemos el esquema */
    sala.uid = _id;
    return sala;
}
module.exports = model('Sala', SalaSchema);