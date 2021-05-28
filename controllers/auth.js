const { response } = require("express");
const bcryptjs = require("bcryptjs")
const Usuario = require("../models/usuario")
const {generarJWT} = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");


const login = async (req, res=response) =>{

    const {correo, password} =  req.body;

    try {
        //verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: "Usuario o contraseña incorrectas - correo"
            })
        }
        //si el usuario está activo 
        if(!usuario.estado){
            return res.status(400).json({
                msg: "Usuario o contraseña incorrectas - estado:false"
            })
        }
        //verificar la contraseña
        const validPassword = bcryptjs.compareSync(password,usuario.password );
        if(!validPassword){
            return res.status(400).json({
                msg: "Usuario o contraseña incorrectas - pass"
            })
        }
        //generar JWT
        const token = await generarJWT(usuario.id);


        res.json({
            mgs:"Login Ok",
            userLogged: usuario,
            token 
        })
    } catch (error) {
        console.log('Error::::::>>', error)
        return res.status(500).json({
            msg: "Hable con el admin :v"
        })
    }
}


const googleSignIn = async(req, res = response)=>{
    
    const {id_token} = req.body;
    
    try {
        const {correo, nombre, img}= await googleVerify(id_token);
        
        //verificar si el correo ya existe n la BD
        let usuario = await Usuario.findOne({correo});
        //si no eiste, lo creo
        if(!usuario){
            
            const data = {
                nombre,
                correo,
                password: ':p',
                img,
                google: true
            }

            usuario = new Usuario(data);
            await usuario.save();
        }
        //si el usuario en DB no le dejo autenticar con google
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el administrador. Usuario Bloqueado'
            });
        }
        //generar JWT
        const token = await generarJWT(usuario.id);
        res.json({
            usuario,
            token
        })
    } catch (error) {
        res.status(400).json({
            msg: 'Token de Google no es valido'
        })
    }
       
    
}


module.exports = {
    login,
    googleSignIn
}