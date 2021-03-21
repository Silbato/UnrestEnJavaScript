const { response } = require("express")

const esAdmin = (req, res = response, next) => {
    /**obtenemos el req ,como el middleware de validar token lo deja en req.usuario, podemos usarlo de aqui */
    if (!req.usuario) {
        console.log('No hay req.usuario.');
        return res.status(500).json({
            msg: 'Se quiere verificar rol. Siendo el token invalido primero...'
        });
    }
    //let usuario = jwt.decode(req.get('token'));
    const { rol, nombre } = req.usuario;
    if (rol !== 'ADMIN') {
        return res.status(401).json({
            msg: `${nombre} no es Administrador para realizar la operacion de borrado.`
        });

    }


    next();
}
/** ...roles es el operador resto, segun lo que hayamos pasado como parametro ,los agrupa y arma un arreglo */
const tieneRol = (...roles) => {
    return (req, res = response, next) => {
        /**obtenemos el req ,como el middleware de validar token lo deja en req.usuario, podemos usarlo de aqui */
        if (!req.usuario) {
            console.log('No hay req.usuario.');
            return res.status(500).json({
                msg: 'Se quiere verificar rol. Siendo el token invalido primero...'
            });
        }
        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: `El servico requiere estos roles...${roles}`
            })
        }
        next();
    }
}
module.exports = {
    esAdmin,
    tieneRol
}