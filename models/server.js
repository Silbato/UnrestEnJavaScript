const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config')

class Server {

    constructor() {
        this.app = express();

        this.port = process.env.PORT;
        this.usuariosRoutePath = '/api/usuarios';
        /**Lanzar la conexion a la BD */
        this.conectarDB();
        /**Middlewares */
        this.middlewares();
        /**Rutas de la app */
        this.routes();

    }
    async conectarDB() {
        await dbConection();
    }

    routes() {
        /**Path de /usuarios */
        this.app.use(this.usuariosRoutePath, require('../routes/usuarios'));
        /**Otros path distintos... */
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Iniciamos en el puerto...`, this.port);
        });
    }
    middlewares() {
        /**Lectura y parseo del body si es JSON */
        this.app.use(express.json());
        /**Directorio publico */
        /**use. para iniciar los middlewares , en este caso en vez de usar el path / usa el html que tenemos en la carpeta public*/
        this.app.use(express.static('public'));
        /**Cors */
        this.app.use(cors());
    }
}
module.exports = Server;