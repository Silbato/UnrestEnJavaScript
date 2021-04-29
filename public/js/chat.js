


let usuario = null;
let socket = null;
/**Referencias al html */
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');
const btnSalas = document.querySelector('#btnSalas');
const Salas = document.querySelector('#Salas');
const ulSalas = document.querySelector('#ulSalas');
const divSalas = document.querySelector('#divSalas');
/**Valida el token del LocalStorage */
const validarJWToken = async () => {
    const token = localStorage.getItem('token') || '';
    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor....');
    }
    /**Llamaos al endpint */
    const resp = await fetch('/api/auth/', {
        headers: { 'x-token': token }
    });
    /**Como ya estan definidos usuario y token lo renombramos */
    const { usuario: userDB, token: tokenDB } = await resp.json();
    /**Verifico si response es 404 o 401 y voy a inicio */
    if (resp.status === 401 || resp.status === 404) {
        localStorage.removeItem('token');
        window.location = 'index.html';
        throw new Error('Se ha vencido el token pareciera....');
    }
    /**borrar este console log despues */
    //console.log(userDB, tokenDB);
    localStorage.setItem('token', tokenDB);
    usuario = userDB;
    /**Ya sabemos que usuario esta conectado */
    document.title = usuario.nombre;
    await conectarSocket();

}

const conectarSocket = async () => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });
    /**Eventos */
    socket.on('connect', () => {
        console.log('Sockets online');
    });
    socket.on('disconnect', () => {
        console.log('Sockets offline');
    });
    socket.on('recibir-mensaje', (payload) => {
        dibujarMensajes(payload);
    });
    socket.on('usuarios-activos', dibujarUsuarios);
    socket.on('mensaje-privado', (payload) => {
        console.log('Privado: ', payload);
    });


}
const main = async () => {
    await validarJWToken();
}
const dibujarUsuarios = (usuarios = []) => {
    let usersHTML = '';
    usuarios.forEach(({ nombre, uid }) => {
        usersHTML += `
            <li>
                <p>
                    <h5 class="text-success">${nombre}

                    </h5>
                    <span clas="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `;
    });
    ulUsuarios.innerHTML = usersHTML;
}
const dibujarMensajes = (mensajes = []) => {
    let mensajessHTML = '';
    mensajes.forEach(({ nombre, mensaje }) => {
        mensajessHTML += `
            <li>
                <p>
                    <span class="text-primary">${nombre}: </span>
                    <span>${mensaje}</span>
                </p>
            </li>
        `;
    });
    ulMensajes.innerHTML = mensajessHTML;
}
const dibujarSalas = (salas = []) => {
    let mensajessHTML = '';
    salas.forEach(({ nombre, descripcion, cantidadArticulos, uid }) => {
        mensajessHTML += `
            <li>
                <p>
                    <span class="text-primary">${nombre}: </span>
                    <span>Descripcion: ${descripcion} </span>
                    <span>Articulos: ${cantidadArticulos}</span>
                    <span>Articulos: ${uid}</span>
                    <button  id=${uid} onClick="irSala(this.id)">Boton</button>
                </p>
            </li>
        `;
    });
    ulSalas.innerHTML = mensajessHTML;
}
const dibujarSalasVacias = (salas = []) => {
    let mensajessHTML = '';
    mensajessHTML += `
 
                <p>

                </p>

        `;
    ulSalas.innerHTML = mensajessHTML;
}
function irSala(id) {
    console.log(`Se presiono un boton con id : ${id}`);
    let mensajessHTML = '';
    mensajessHTML += `
            <li>
                <p>
                    <span class="text-primary">${id}: </span>
                    <p>Subir: <input type="number" name="puja"></p>
                    <input type="text" id="precioBase" value="0.00" readonly>
                    <input type="text" id="precioActual" value="0.00" readonly>
                    <input type="text" id="usuarioMayor" value="User" readonly>
                </p>
            </li>
        `;
    dibujarSalasVacias();
    divSalas.innerHTML = mensajessHTML;
}
txtMensaje.addEventListener('keyup', ({ keyCode }) => {
    const mensaje = txtMensaje.value;
    const uid = txtUid.value;
    if (keyCode !== 13) {
        /**Es el enter */
        return;
    }
    if (mensaje.length === 0) {
        return;
    }

    socket.emit('enviar-mensaje', { mensaje, uid });
    txtMensaje.value = '';
})
btnSalas.addEventListener('click', async () => {
    const token = localStorage.getItem('token') || '';
    const resp = await fetch('/api/salas/', {
        headers: { 'x-token': token }
    });
    console.log(resp);
    const { salas } = await resp.json();
    /**Verifico si response es 404 o 401 y voy a inicio */
    if (resp.status === 401 || resp.status === 404) {
        localStorage.removeItem('token');
        window.location = 'index.html';
        throw new Error('Se ha vencido el token pareciera....');
    }


    dibujarSalas(salas);

    console.log('Se apretó el boton cargar salas');
})
btnSalir.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location = 'index.html';
})
main();

//const socket = io();

/**Ejecutamos la funcion main */



