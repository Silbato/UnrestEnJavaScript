
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extensionesValidas = ['jpeg', 'jpg', 'png', 'gif'], carpeta = '') => {
    return new Promise((resolve, reject) => {

        /**Lo checkeamos arriba q venga el "archivo " */
        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
        //validar extension
        if (!extensionesValidas.includes(extension)) {
            return reject(`La extension ${extension} no es permitida, ${extensionesValidas}`);
        }


        /**Renombrar los archvios para que no sean repetidos */
        const temporalName = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, temporalName);
        // res.json({ msg: `${uploadPath}   ${extension}` });

        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);

            }
            resolve(temporalName);
        });


    });
}
module.exports = { subirArchivo }