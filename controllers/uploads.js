const { response } = require('express');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");
const path = require('path');
const fs = require('fs');


const cargarArchivo = async (req, res = response) => {

    try {
        //const nombreArchivo = await subirArchivo(req.files, ['txt', 'md'], 'textos');

        const nombreArchivo = await subirArchivo(req.files, undefined, 'imgs');
        res.json({
            nombreArchivo
        });

    } catch (error) {
        res.status(400).json({
            error
        });
    }




}
const actualizarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;
    /**Validar los campos */
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe usuario para ese id. ID: ${id}`
                });
            }
            console.log(modelo);
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe producto para el id: ${id}`
                });
            }
            console.log(modelo);
            break;
        default:
            return res.status(500).json({
                msg: 'No cumple los requisitos su consulta.'
            });

    }
    /**Limpiar imagenes previas si ya tuviese alguna cargada */
    if (modelo.img) {
        /**Buscar el path pq existe su atributo img */
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            /**Si existe lo borramos */
            fs.unlinkSync(pathImagen);
        }
    }

    /**Al tener el nombre de la coleccoin como usuarios o productos, se va a guarda en la carpeta aunque ya este creada */
    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;
    /**Asigno el nombre de la imagen y lo guarda */
    await modelo.save();
    res.json(modelo);
}

const actualizarCloud = async (req, res = response) => {
    const { id, coleccion } = req.params;
    /**Validar los campos */
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe usuario para ese id. ID: ${id}`
                });
            }
            console.log(modelo);
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe producto para el id: ${id}`
                });
            }
            console.log(modelo);
            break;
        default:
            return res.status(500).json({
                msg: 'No cumple los requisitos su consulta.'
            });

    }
    /**Limpiar imagenes previas si ya tuviese alguna cargada */
    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        //console.log(public_id);
        cloudinary.uploader.destroy(public_id);

    }
    /**Subimos  */
    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url;
    /**Al tener el nombre de la coleccoin como usuarios o productos, se va a guarda en la carpeta aunque ya este creada */
    //const nombre = await subirArchivo(req.files, undefined, coleccion);
    //modelo.img = nombre;
    /**Asigno el nombre de la imagen y lo guarda */
    await modelo.save();
    res.json(modelo);
}




const getImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;
    /**Validar los campos */
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe usuario para ese id. ID: ${id}`
                });
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe producto para el id: ${id}`
                });
            }

            break;
        default:
            return res.status(500).json({
                msg: 'No cumple los requisitos su consulta.'
            });

    }
    /**Limpiar imagenes previas si ya tuviese alguna cargada */
    if (modelo.img) {
        /**Buscar el path pq existe su atributo img */
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }
    let pathImagen = path.join(__dirname, '../assets/noimageavailable.png');
    // buscarNotAvailable(req, res, 'notimageavailable');
    return res.sendFile(pathImagen);
}

module.exports = { cargarArchivo, actualizarImagen, getImagen, actualizarCloud }