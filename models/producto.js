const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio: {
        type: Number,
        default: 0,
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: false
    },
    descripcion: {
        type: String
    },
    disponible: {
        type: Boolean,
        default: false
    }


});
/**Para modificar lo q devuelva el toJSON(le sacamos solo el __v y el estado de mongo) */
ProductoSchema.methods.toJSON = function () {
    const { __v, estado, ...data } = this.toObject();
    return data;
}
module.exports = model('Producto', ProductoSchema);