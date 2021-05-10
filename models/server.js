const express = require('express')
const cors = require('cors')
const {dbConnection} = require('../database/config')
 
class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        //conexion a la base de datos 
        this.conectarDB();
        //middlewares
        this.middlewares();
        //rutas de la aplicacion
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }
    middlewares(){
        //CORS
        this.app.use(cors());
        //Parseo y lectura de body
        this.app.use(express.json());
        //directorio publico
        this.app.use(express.static('public'));
    }

    routes(){
       this.app.use(this.usuariosPath, require('../routes/usuarios'))
    }

    listen(){
        this.app.listen(process.env.PORT, ()=>{
            console.log('Servidor corriendo en el puerto: ', this.port);
        });
    }
}

module.exports = Server;