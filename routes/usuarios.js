const {Router} = require('express');
const { check } = require('express-validator');

const {validarCampos} = require('../middlewares/validar-campos')
const {esRolValido, emailExiste, existeUsuarioPorId} = require('../helpers/db-validators')
const { usuariosGet, 
        usuariosPost,
        usuariosPut,
        usuariosPatch,
        usuariosDelete } = require('../controllers/usuarios');
const router = Router();

router.get('/', usuariosGet);

router.put('/:id',[
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        check('rol').custom(esRolValido),
        validarCampos
], usuariosPut);

router.post('/',[
        check('nombre','El nombre es obligatorio').not().isEmpty(),
        check('password','El password es obligatorio y debe contener más de 6 caracteres').isLength({min:6}),
        check('correo','El correo no es valido').isEmail(),
        check('correo').custom(emailExiste),
        //check('rol','No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
        check('rol').custom(esRolValido),
        validarCampos   
], usuariosPost);

router.patch('/', usuariosPatch);

router.delete('/', usuariosDelete);

module.exports = router;