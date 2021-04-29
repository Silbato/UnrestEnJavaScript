const { response, request } = require('express');
const Sala = require('../models/sala');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');


const getSalas = async (req = request, res = response) => {

    const filtroEstadoAtivo = { estado: true };
    const { limite = 5, desde = 0 } = req.query;

    /**Armo una coleccion de promesas para que no sea autobloquenate como arriba, y las ejecuta en forma simultanea y no en secuencia */
    /**Si diera erroa alguna de las de adentro, lo devuevve como coleccion */
    const [total, salas] = await Promise.all([
        Sala.countDocuments(filtroEstadoAtivo),
        Sala.find(filtroEstadoAtivo).
            populate('admin', ['nombre', 'correo']).
            populate('articulos', ['nombre', 'disponible', 'precio', 'img']).
            populate('martillero', ['nombre', 'correo']).
            skip(Number(desde)).limit(Number(limite))
    ]);


    res.json({
        msg: 'get API - controlador salas',
        total,
        salas,
    });
}
const getSala = async (req, res = response) => {
    const { id } = req.params;
    const salaPedida = await Sala.findById(id).populate('admin', ['nombre', 'correo']).
        populate('articulos', ['nombre', 'disponible', 'precio', 'img']).
        populate('martillero', ['nombre', 'correo']);
    res.json({
        salaPedida
    });
}


const setSala = async (req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();
    const { descripcion, fecha, fechaInicio } = req.body;
    /*   const usuarioDB = await Usuario.findOne({ nombre });
       //Verificar repetido 
       if (!usuarioDB) {
           return res.status(400).json({
               msg: "Usuario no valido."
           })
       }
   */
    /**Guardar Sala */
    const data = {
        nombre,
        descripcion,
        fecha,
        fechaInicio,
        admin: req.usuario._id,

    }

    const sala = new Sala(data);
    /**guardado fisico */
    await sala.save();
    /**Envio q se grabó bien */
    res.status(201).json(sala);
}
const borrarSala = async (req, res = response) => {
    const { id } = req.params;

    const sala = await Sala.findByIdAndUpdate(id, { estado: false }, { new: true })
    res.json(
        {
            msg: 'API categorias delete',
            sala
        }
    );
};
const actualizarSala = async (req, res = response) => {
    /**de los datos por path, buscar para actualziar sala */
    const { id } = req.params;
    /**del body por si me los mandan */

    const { estado, usuario, articulos, cantidadArticulos, ...data } = req.body;





    data.nombre = data.nombre.toUpperCase();
    data.martillero = req.usuario._id;
    const actu = {
        nombre: data.nombre,
        martillero: data.martillero,
        estado: estado,
        cantidadArticulos,
        data: data,
        articulos
    }
    /**grabar la seg coma para pasarle los datos a cambiar ... el new es para q grabe y devuevla el nuevo obj en response*/
    const sala = await Sala.findByIdAndUpdate(id, actu, { new: true });
    /**Si se graba bien devolvera algo de tipo categoria */
    res.json(sala);
};
module.exports = { actualizarSala, borrarSala, getSala, getSalas, setSala }