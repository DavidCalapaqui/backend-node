const mongoose = require('mongoose');

const dbConnection = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });    

        console.log('Conexión a la base de datos exitosa');

    } catch (error) {
        console.log('Database error:', error);
        throw new Error('Error al iniciar la base de datos');
    }
}

module.exports = {
   dbConnection
}