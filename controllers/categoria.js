const { response } = require("express");
const {Categoria } = require('../models');


//obtenerCategorias - paginado -total - populate
const obtenerCategorias = async(req, res=response) =>{
    const {limite=5, desde=0} = req.query;
    const query = {estado:true};
    //obtener todos los registros populados
    const [total,categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario')
        .skip(Number(desde))
        .limit(Number(limite))
    ])
    
    res.json({
        total,
        categorias
    })
}
//obtenerCategoria -  populate {id}
const obtenerCategoriaPorId = async(req, res= response) =>{
    const {id} = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.json(categoria)

}

const crearCategoria = async (req, res= response)=>{


    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB){
        res.status(400).json({
            msg:`La categoria ${categoriaDB.nombre} ya existe`
        });
    }
    //generar la data a guardar

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);
    await categoria.save();

    res.status(201).json(categoria);
}

// actualizarCategoria
const actualizarCategoria = async(req, res=response)=>{
    const {id} = req.params;
    const {estado, usuario, ...data}= req.body;
    //console.log(`Body: ${JSON.stringify(req.body)}, Id: ${id}, Nombre: ${nombreNuevo}`)
    //const {nombre} = await Categoria.findById(id);
    data.nombre= data.nombre.toUpperCase();
    data.usuario= req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id,data, {new: true});
    res.json(categoria);
}
//borrarCategoria -estado:false
const borrarCategoria = async(req, res=response)=>{
    const {id} = req.params;
    const categoria = await  Categoria.findByIdAndUpdate(id, {estado:false}, {neww:true});
    res.json({
        categoria
    })
}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaPorId,
    actualizarCategoria,
    borrarCategoria
}