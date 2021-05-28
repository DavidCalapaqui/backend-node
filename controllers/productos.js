const { response } = require("express");
const {Producto } = require('../models');

const crearProducto = async (req, res= response)=>{

   
    //const nombre = req.body.nombre.toUpperCase();
    const {estado, usuario, ...body} = req.body;
    
    const productoDB = await Producto.findOne({nombre: body.nombre});

    if(productoDB){
        res.status(400).json({
            msg:`El producto ${productoDB.nombre} ya existe`
        });
    }
    //generar la data a guardar

    const data = {
       ...body,
       nombre: body.nombre.toUpperCase(),
       usuario: req.usuario._id
    }

    const producto = new Producto(data);
    await producto.save();

    res.status(201).json(producto);
}

//obtenerCategorias - paginado -total - populate
const obtenerProductos = async(req, res=response) =>{
    const {limite=5, desde=0} = req.query;
    const query = {estado:true};
    //obtener todos los registros populados
    const [total,productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ])
    
    res.json({
        total,
        productos
    })
}

//obtenerProducto -  populate {id}
const obtenerProductoPorId = async(req, res= response) =>{
    const {id} = req.params;

    const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria','nombre');
    

    res.json(producto)

}

// actualizarCategoria 
const actualizarProducto = async(req, res=response)=>{
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }
    
    data.usuario= req.usuario._id;
    

    const producto = await Producto.findByIdAndUpdate(id,data, {new: true});
    res.json(producto);
}

//borrarCategoria -estado:false
const borrarProducto = async(req, res=response)=>{
    const {id} = req.params;  
    const producto = await  Producto.findByIdAndUpdate(id, {estado:false}, {new:true});
    res.json({
        producto
    })
}

module.exports={
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    borrarProducto
}