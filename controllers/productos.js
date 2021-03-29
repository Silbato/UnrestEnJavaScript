const { response, request } = require("express");
const { Categoria, Usuario } = require('../models/index');
const { Producto } = require('../models/index');

const obtenerProductos = async (req, res = response) => {
    /**Como Categoria tiene un campo usuario, con el popultae puedo pasarle todo, en vez del id  */
    const filtroEstadoActivo = { estado: true };
    const { limite = 5, desde = 0 } = req.query;
    const [total, productos] = await Promise.all([
        Producto.countDocuments(filtroEstadoActivo), Producto.find(filtroEstadoActivo).populate('usuario', ['nombre', 'correo']).populate('categoria', ['nombre']).skip(Number(desde)).limit(Number(limite))
    ]);
    res.json({
        msg: 'get API. controlador Categorias',
        total,
        productos
    });
}
const obtenerProducto = async (req, res = response) => {
    const { id } = req.params;
    /**Agregar el populate de catgoriaaaa */
    const prod = await (await Producto.findById(id)).populate('usuario', 'nombre');
    res.json({
        msg: 'API get Producto.',
        prod
    })
}
const crearProducto = async (req, res = response) => {
    const { descripcion } = req.body;
    const nombre = req.body.nombre.toUpperCase();
    /**Veo si hay algun producto con el mismo nombre */
    const productoEnDB = await Producto.findOne({ nombre });
    if (productoEnDB) {
        return res.status(400).json({
            msg: `Hay un producto con el nombre ${nombre}. Cambie redactelo de otra manera.`
        });

    }
    const usuario = req.usuario._id;
    const data = {
        nombre,
        descripcion,
        estado: true,
        usuario
    }
    const productoNuevo = new Producto(data);
    await productoNuevo.save();
    res.status(201).json(productoNuevo);


}
const borrarProducto = async (req, res = response) => {
    const { id } = req.params;
    const prod = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });
    res.json({
        msg: `API Delete Producto ${prod.id} ${prod.nombre}`,
        prod
    })
}
const actualizarProducto = async (req, res = response) => {
    const { id } = req.params;
    /**del body por si me los mandan */
    const { estado, usuario, ...data } = req.body;
    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }
    const prodAct = await Producto.findByIdAndUpdate(id, data, { new: true });
    /**Si se graba bien devolvera algo de tipo categoria */
    res.json(prodAct);
}
module.exports = {
    actualizarProducto,
    borrarProducto,
    crearProducto,
    obtenerProductos,
    obtenerProducto
}