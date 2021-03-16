const mongoose = require('mongoose');


const dbConection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN, {
            /**Configuracion de mongoose conection */
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('Base de datos on.')
    } catch (error) {
        console.log(error);
        throw new Error('Error al levantar la conexion a la base de datos')
    }
}


module.exports = {
    dbConection
}