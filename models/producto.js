const {Schema, model} = require('mongoose');

const ProductoSchema = Schema({
   nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    }, 
    usuario: {//USUARIO QUIEN HIZO EL REGISTRO
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required:
         true
    },
    descripcion: {
        type: String
    },
    disponible: {
        type:Boolean,
        default:true 
    }
});


ProductoSchema.methods.toJSON = function(){
    //quito la version --v y el password. Los demas parametros quedan en usuario
    const {__v,estado,...data} = this.toObject();
   
    return data;
}
module.exports = model('Producto',  ProductoSchema)