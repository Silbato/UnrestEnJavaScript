const { response, request } = require("express");

const { Categoria, Usuario } = require('../models/index');
/**obtenerCategorias -----paginado,total,populate */
/**obtenerCategoria -----populate{} */
/**actualizarCategoria ---- */
/**borrarCategoria ----estado a false */
const obtenerCategorias = async (req, res = response) => {
    /**Como Categoria tiene un campo usuario, con el popultae puedo pasarle todo, en vez del id  */
    const filtroEstadoActivo = { estado: true };
    const { limite = 5, desde = 0 } = req.query;
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(filtroEstadoActivo), Categoria.find(filtroEstadoActivo).populate('usuario', ['nombre', 'correo']).skip(Number(desde)).limit(Number(limite))
    ]);
    res.json({
        msg: 'get API. controlador Categorias',
        total,
        categorias
    });
}
const obtenerCategoria = async (req, res = response) => {
    const { id } = req.params;
    const categoriaPedida = await Categoria.findById(id).populate('usuario', 'nombre');
    res.json({
        categoriaPedida
    });
}
const crearCategoria = async (req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({ nombre });
    /**Verificar repetido */
    if (categoriaDB) {
        return res.status(400).json({
            msg: "Categoria repetida"
        })
    }
    /**Guardar categoria */
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);
    /**guardado fisico */
    await categoria.save();
    /**Envio q se grabó bien */
    res.status(201).json(categoria);
}
const actualizarCategoria = async (req, res = response) => {
    /**de los datos por path */
    const { id } = req.params;
    /**del body por si me los mandan */
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    /**grabar la seg coma para pasarle los datos a cambiar ... el new es para q grabe y devuevla el nuevo obj en response*/
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });
    /**Si se graba bien devolvera algo de tipo categoria */
    res.json(categoria);
};
const borrarCategoria = async (req, res = response) => {
    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true })
    res.json(
        {
            msg: 'API categorias delete',
            categoria
        }
    );
};
module.exports = { crearCategoria, obtenerCategoria, obtenerCategorias, actualizarCategoria, borrarCategoria }
