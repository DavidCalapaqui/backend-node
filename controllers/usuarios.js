const {response} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario')

const usuariosGet = (req = request, res = response)=> {
    const {nombre, apikey} = req.query;
    res.json({
        msg: 'get API - controlador',
        nombre,
        apikey
    });
}

const usuariosPost = async (req, res = response)=> {
   
    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({
        nombre, correo, password, rol
    });
   
    //encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);
    //guardar en DB
    await usuario.save();
    res.json({
        usuario
    });
}

const usuariosPut = async (req, res = response)=> {
    const {id} = req.params;
    const {_id, password, google,correo, ...resto} = req.body;

    //TODO validar contra base de datos 
    if(password){
        //encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'put API - usuarioPut',
        usuario
    })
}

const usuariosPatch = (req, res = response)=> {
    res.json({
        msg: 'patch API - controlador'
    });
}

const usuariosDelete = (req, res = response)=> {
    res.json({
        msg: 'delete API - controlador'
    });
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}