const Role = require('../models/role');
const {Usuario, Categoria, Producto} = require('../models');


const esRolValido = async(rol='')=>{
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
            throw new Error(`El rol ${rol} no está registrado en la base de datos`)
    }
}

const emailExiste = async(correo='')=>{
     //verificar si el correo existe
     const existeEmail = await Usuario.findOne({correo});
     if(existeEmail){
         throw new Error(`El correo ${correo} ya está registrado`)
     }
}


const existeUsuarioPorId = async(id)=>{
    //verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario){
        throw new Error(`El id: ${id} no existe`)
    }
}

const existeCategoriaPorId =  async(id)=>{
    //verificar la categoria existe
    const existeCategoria = await Categoria.findById(id);
    if(!existeCategoria){
        throw new Error(`El id: ${id} de la categoría no existe`)
    }
}


const existeProductoPorId =  async(id)=>{
    //verificar la categoria existe
    const existeProducto = await Producto.findById(id);
    if(!existeProducto){
        throw new Error(`El id: ${id} del producto no existe`)
    }
}

//VALIDAR COLECCIONES PERMITIDAS
const coleccionesPermitidas = (coleccion='', colecciones = [])=>{
    const incluida = colecciones.includes(coleccion);
    if(!incluida){
        throw new Error(`La coleccion ${coleccion} no es permitida. Se permiten: ${colecciones}`)
    }
    return true;
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}