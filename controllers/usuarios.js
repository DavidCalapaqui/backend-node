const {response} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const usuariosGet = async (req = request, res = response)=> {
    //const {nombre, apikey} = req.query;
    const {limite = 5, desde = 0} = req.query;//argumentos opcionales
    const query = {estado:true}; //filto
   
    //permite mandar arreglo con las promesas que quiero ejecutar
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
      total,
      usuarios
       //usuarios
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

    // Generar el JWT
    const token = await generarJWT( usuario.id );
    res.json({
        usuario,
        token
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

    res.json(usuario);
}

const usuariosPatch = (req, res = response)=> {
    res.json({
        msg: 'patch API - controlador'
    });
}

const usuariosDelete = async (req, res = response)=> {
    const {id} = req.params;
    //BORRADO FÍSICO
    //const usuario = await Usuario.findByIdAndDelete(id);
    
    //CAMBIANDO ESTADO A FALSE
    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});
    
    res.json({
        usuario,
        
    });
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}