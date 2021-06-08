const {Router, response} = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actulizarImagen, mostarImagen, actulizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers/db-validators');
const { validarCampos, validarArchivoSubir } = require('../middlewares');


const router = Router();

router.post('/',validarArchivoSubir, cargarArchivo);

router.put('/:coleccion/:id',[
    validarArchivoSubir,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actulizarImagenCloudinary) 
//actulizarImagen)

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostarImagen)


module.exports = router;