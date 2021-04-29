const { Socket } = require('socket.io');
const { comprobarJWT } = require('../helpers');
const { ChatMensajes } = require('../models/chat-mensajes');

const chatMensajes = new ChatMensajes();
/**Despues borrar el  =new Socket() */
const socketController = async (socket = new Socket(), io) => {
    //console.log('cliente conectado con id de socket: ', socket.id);
    //console.log(socket.handshake.headers['x-token']);
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);
    if (!usuario) {
        /**Si no tenemos usuario desconectamos directamente pq el token era invalido */
        console.log('Se desconecto por no haber sido validado el usuario en token-usuario  ', usuario);
        return socket.disconnect();
    }
    //console.log('Se conecto: ', usuario.nombre);
    /**Agregar usuario conectado */
    chatMensajes.conectarUsuario(usuario);
    /**hacemos broadcast y emit a los usuarios,el io es para todos, no es necesaria hacer emito o broadcast deñ arreglo objeto Usuarios */
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    /**Le enviamos los ultimos mensajes */
    socket.emit('recibir-mensajes', chatMensajes.ultimos10);

    /**Salas */
    socket.join(usuario.id);


    /**Limpar los que desconectan */
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    }
    );
    socket.on('enviar-mensaje', ({ uid, mensaje }) => {
        if (uid) {
            /**Mensaje privado a otro usuario*/
            socket.to(uid).emit('mensaje-privado', { de: usuario.nombre, mensaje });
        } else {

            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
            io.emit('recibir-mensaje', chatMensajes.ultimos10);
        }
    });
}


module.exports = {
    socketController
}