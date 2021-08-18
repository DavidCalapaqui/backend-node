
const { ObjectId } = require("mongoose").Types;
const {Usuario, Categoria, Producto} = require('../models')

const  coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async(termino='', res=response)=>{
    const esMongoId = ObjectId.isValid(termino);

    if(esMongoId){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : [] //pregunto si existe y lo restorno sino retorno un arreglo vacio
        })
    }

    const regex = new RegExp(termino, 'i'); //expresion regular

    const usuarios = await Usuario.find({
        $or: [{nombre: regex},{correo: regex}],
        $and:[{estado:true}]
    });

    res.json({
        results: usuarios
    })


}

const buscarCategorias = async(termino='', res=response)=>{
    const esMongoId = ObjectId.isValid(termino);

    if(esMongoId){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }

    const regex = new RegExp(termino, 'i'); //expresion regular

    const categorias = await Categoria.find({nombre: regex,estado:true});   

    return res.json({
        categorias
    })
    

}

const buscarProductos = async(termino='', res=response)=>{
    const esMongoId = ObjectId.isValid(termino);

    if(esMongoId){
        const producto = await Producto.findById(termino).populate('categoria','nombre');
        return res.json({
            results: (producto) ? [producto] : []
        })
    }

    const regex = new RegExp(termino, 'i'); //expresion regular

    const productos = await Producto.find(
        {
            $or: [{nombre: regex},{descripcion: regex}],
            $and:[{estado:true}]
        }
    ).populate('categoria','nombre');   

    return res.json({
        productos
    })
    

}


const buscar = (req, res=response) =>{
    
    const {coleccion, termino} = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch(coleccion){
        case 'usuarios': buscarUsuarios(termino,res); break;
        case 'categorias': buscarCategorias(termino,res); break;
        case 'productos': buscarProductos(termino,res);break;
       

        default : res.status(500).json({
            msg: 'Se me olvido hacer esta busqueda'
        })

    }

}


module.exports={
    buscar
}