const { response } = require("express");
const bcryptjs = require("bcryptjs")
const Usuario = require("../models/usuario")
const {generarJWT} = require("../helpers/generar-jwt")
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


module.exports = {
    login
}