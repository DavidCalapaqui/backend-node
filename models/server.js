const express = require('express')
const cors = require('cors')
const {dbConnection} = require('../database/config')
const fileUpload = require('express-fileupload')
 
class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            usuarios: '/api/usuarios',
            categorias: '/api/categorias',
            productos: '/api/productos',
            buscar: '/api/buscar',
            uploads: '/api/uploads'
        }
     
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
        //carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes(){
       this.app.use(this.paths.auth, require('../routes/auth'));
       this.app.use(this.paths.usuarios, require('../routes/usuarios'));
       this.app.use(this.paths.categorias, require('../routes/categorias'));
       this.app.use(this.paths.productos, require('../routes/productos'));
       this.app.use(this.paths.buscar, require('../routes/buscar'));
       this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    listen(){
        this.app.listen(process.env.PORT, ()=>{
            console.log('Servidor corriendo en el puerto: ', this.port);
        });
    }
}

module.exports = Server;