const express = require('express');
const path = require('path');
const cors = require('cors');
const { dbConection } = require('../database/config');
const fileUpload = require('express-fileupload');
const { socketController } = require('../sockets/controller');
const { createServer } = require('http');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        /**Servidor de sockets     */
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server, { origins: '*:*' });
        /**paths varios */

        this.authPath = '/api/auth';
        this.buscarPath = '/api/buscar';
        this.categoriasPath = '/api/categorias';
        this.productosPath = '/api/productos';
        this.usuariosRoutePath = '/api/usuarios';
        this.uploadsPath = '/api/uploads';
        this.salasPath = '/api/salas';


        /**Lanzar la conexion a la BD */
        this.conectarDB();
        /**Middlewares */
        this.middlewares();
        /**Rutas de la app */
        this.routes();
        /**Eventos Sockets */
        this.sockets();

    }
    async conectarDB() {
        await dbConection();
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log(`Iniciamos en el puerto...`, this.port);
        });
    }
    routes() {

        /**Path autenticacion y login */
        this.app.use(this.authPath, require('../routes/auth'));
        /**Path de /usuarios */
        this.app.use(this.usuariosRoutePath, require('../routes/usuarios'));
        /**Otros path distintos... */

        this.app.use(this.buscarPath, require('../routes/buscar'));
        this.app.use(this.categoriasPath, require('../routes/categorias'));
        this.app.use(this.productosPath, require('../routes/productos'));
        this.app.use(this.uploadsPath, require('../routes/uploads'));
        this.app.use(this.salasPath, require('../routes/salas'));
    }
    sockets() {
        /**config para separar la logica de sockets, en "sockets,controller" */
        this.io.on('connection', (socket) => socketController(socket, this.io));
    }

    middlewares() {

        /**Lectura y parseo del body si es JSON */
        this.app.use(express.json());

        /**Directorio publico */
        /**use. para iniciar los middlewares , en este caso en vez de usar el path / usa el html que tenemos en la carpeta public*/
        this.app.use(express.static('public'));
        /**Cors */
        this.app.use(cors());
        /**Para aceptar archivos desde rest ... en FileUpload */
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }
}
module.exports = Server;