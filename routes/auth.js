const {Router, response} = require('express');
const { check } = require('express-validator');
const {login, googleSignIn, validarTokenUsuario} = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es pbligatoria').not().isEmpty(),
    validarCampos
],login);


router.post('/google',[
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignIn);


router.get('/',[
    validarJWT
], validarTokenUsuario );


module.exports = router;