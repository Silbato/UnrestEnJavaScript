
const { validationResult } = require('express-validator');
const validarCampos = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }
    /**hay que colocar el next ya que estamos en secuencia de middlewares,por lo tanto pasaria al siguiente middleware */
    next();
}
module.exports = {
    validarCampos
}