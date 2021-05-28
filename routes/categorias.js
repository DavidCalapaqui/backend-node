const {Router} = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoriaPorId, actualizarCategoria, borrarCategoria } = require('../controllers/categoria');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT,validarCampos, esAdminRole, tieneRole } = require('../middlewares');


//{{url}}/api/categorias
const router = Router();

//OBTENER TODAS LAS CATEGORIAS - PUBLIC
router.get('/',obtenerCategorias);
//OBTENER UNA CATEGORIAS POR ID
router.get('/:id',[
        check('id', 'No es un id de mongo').isMongoId(),
         check('id').custom(existeCategoriaPorId),
         validarCampos
       ],obtenerCategoriaPorId);
//CREAR CATEGORIA - PRIVADO - CUALQUIERA CON TOKEN PRIVADO
router.post('/', [
        validarJWT,
        check('nombre','El nombre es obligatorio').not().isEmpty(),
        validarCampos  
        ],crearCategoria
 );

//ACTUALIZAR CATEGORIA - PRIVADO - CUALQUIERA TOKEN VALIDO
router.put('/:id',[
         validarJWT,
         check('nombre', 'El nombre es obligatorio').not().isEmpty(),
         check('id', 'No es un id válido').isMongoId(),
         check('id').custom(existeCategoriaPorId), 
         validarCampos
        ], actualizarCategoria);
//BORRAR CATEGORIA - ADMIN 
router.delete('/:id',[
         validarJWT, 
         esAdminRole,
         check('id', 'No es un id válido').isMongoId(),
         check('id').custom(existeCategoriaPorId),
         validarCampos
         ], 
         borrarCategoria);
module.exports = router;