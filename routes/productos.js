const {Router} = require('express');
const { check } = require('express-validator');
const {crearProducto, obtenerProductos, obtenerProductoPorId, actualizarProducto, borrarProducto} = require('../controllers/productos');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
//middleware
const { validarJWT,validarCampos, esAdminRole, tieneRole } = require('../middlewares');


const router = Router();


//CREAR PRODUCTO - PRIVADO - CUALQUIERA CON TOKEN PRIVADO
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos  
    ],crearProducto
);

//OBTENER TODOS LOS PRODUCTOS CON ?desde, ?limite - PUBLIC
router.get('/',obtenerProductos);

//OBTENER UN PRDUCTO POR ID
router.get('/:id',[
    check('id', 'No es un id de mongo').isMongoId(),
     check('id').custom(existeProductoPorId),
     validarCampos
   ],obtenerProductoPorId);

//ACTUALIZAR PRODUCTO - PRIVADO - CUALQUIERA TOKEN VALIDO
router.put('/:id',[
    validarJWT,
    //check('categoria','No es un id de mongo').isMongoId(),
    check('id').custom(existeProductoPorId), 
    validarCampos
   ], actualizarProducto);

//BORRAR CATEGORIA - ADMIN 
router.delete('/:id',[
    validarJWT, 
    esAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
    ], 
    borrarProducto);

module.exports = router;