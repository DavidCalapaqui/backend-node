const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario')

const validarJWT = async (req=request, res=response, next)=>{
    const token = req.header('x-token');
    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const {uid}= jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        //leer el usuario al que corresponde la uid
        const usuarioAuth = await Usuario.findById(uid);

        if(!usuarioAuth){
            return res.status(401).json({
                msg: 'Token no valido - Usuario no exite en DB'
            })
        }

        //verificar si el uid de usuario está activado
        if(!usuarioAuth.estado){
            return res.status(401).json({
                msg: 'Token no valido - Usuario con estado false'
            })
        }
        //console.log('Usuario Autenticado:', usuarioAutenticado)
        req.usuario = usuarioAuth;
        req.uid = uid;

        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            //mandar 
            msg: 'Token no valido'
        })
    }
    console.log(token);
}

module.exports = {
    validarJWT
}